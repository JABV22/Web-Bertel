// Controlador de la escena visual adaptado de src/prototipo/js/escena.js.
/* ---------- utilidades ---------- */

function limitar(v, min, max) { return v < min ? min : (v > max ? max : v); }

function lerp(a, b, t) { return a + (b - a) * t; }

/* Interpola una lista de fotogramas {t, ...props} en el progreso p */
function interpolar(fotogramas, p, claves) {
  var i = 0;
  while (i < fotogramas.length - 2 && p > fotogramas[i + 1].t) i++;
  var a = fotogramas[i], b = fotogramas[i + 1];
  var span = b.t - a.t;
  var t = span <= 0 ? 0 : limitar((p - a.t) / span, 0, 1);
  /* suavizado suave-entrada/suave-salida */
  t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  var salida = {};
  for (var k = 0; k < claves.length; k++) {
    var c = claves[k];
    salida[c] = lerp(a[c], b[c], t);
  }
  return salida;
}

var CLAVES = ["x", "y", "z", "ry", "rx", "s", "o"];

function aplicar(el, v) {
  el.style.transform =
    "translate3d(" + v.x.toFixed(2) + "%," + v.y.toFixed(2) + "%," + v.z.toFixed(1) + "px)" +
    " rotateY(" + v.ry.toFixed(2) + "deg) rotateX(" + v.rx.toFixed(2) + "deg)" +
    " scale(" + v.s.toFixed(4) + ")";
  el.style.opacity = v.o.toFixed(3);
}

/* ============================================================
   Coreografía de la escena principal
   0–25 %  aparece en perspectiva y se aproxima
   25–50 % los paneles se separan y destaca una pregunta
   50–75 % la vista evoluciona hacia el resultado
   75–100 % los elementos se reúnen y se estabilizan
   ============================================================ */

var COREOGRAFIA = {
  progreso: [
    { t: 0,    x: -6,  y: -4,  z: -420, ry: 16,  rx: 9,  s: .90, o: .35 },
    { t: .25,  x: -20, y: -12, z: -230, ry: 14,  rx: 6,  s: .93, o: .95 },
    { t: .5,   x: -38, y: -16, z: -300, ry: 20,  rx: 5,  s: .90, o: .80 },
    { t: .75,  x: -30, y: -18, z: -340, ry: 18,  rx: 5,  s: .88, o: .55 },
    { t: 1,    x: -14, y: -9,  z: -240, ry: 10,  rx: 4,  s: .92, o: .85 }
  ],
  pregunta: [
    { t: 0,    x: 4,   y: 10,  z: -620, ry: 12,  rx: 10, s: .84, o: .25 },
    { t: .25,  x: 0,   y: 0,   z: 0,    ry: 6,   rx: 3,  s: 1,   o: 1 },
    { t: .5,   x: 6,   y: -2,  z: 90,   ry: -2,  rx: 1,  s: 1.06, o: 1 },
    { t: .75,  x: 22,  y: 12,  z: -220, ry: -14, rx: 4,  s: .88, o: .45 },
    { t: 1,    x: 12,  y: 8,   z: -180, ry: -8,  rx: 4,  s: .90, o: .70 }
  ],
  resultado: [
    { t: 0,    x: 14,  y: 26,  z: -760, ry: -18, rx: 12, s: .78, o: 0 },
    { t: .25,  x: 24,  y: 20,  z: -520, ry: -16, rx: 8,  s: .84, o: .18 },
    { t: .5,   x: 34,  y: 16,  z: -300, ry: -14, rx: 6,  s: .88, o: .55 },
    { t: .75,  x: 2,   y: -2,  z: 110,  ry: 2,   rx: 1,  s: 1.05, o: 1 },
    { t: 1,    x: -2,  y: 2,   z: 40,   ry: 5,   rx: 2,  s: 1,   o: 1 }
  ]
};

/* ============================================================
   Controlador
   ============================================================ */

function Escena(raiz) {
  this.raiz = raiz;
  this.pista = raiz.querySelector("[data-pista]");
  this.paneles = {
    progreso:  raiz.querySelector('[data-panel="progreso"]'),
    pregunta:  raiz.querySelector('[data-panel="pregunta"]'),
    resultado: raiz.querySelector('[data-panel="resultado"]')
  };
  this.pasos = Array.prototype.slice.call(raiz.querySelectorAll("[data-paso]"));
  this.medidores = Array.prototype.slice.call(raiz.querySelectorAll("[data-medidor]"));

  this.visible = false;
  this.pendiente = false;
  this.ultimoPaso = -1;
  this.destruido = false;

  this._alDesplazar = this._alDesplazar.bind(this);
  this._pintar = this._pintar.bind(this);
  this._alCambiarVisibilidad = this._alCambiarVisibilidad.bind(this);

  this.iniciar();
}

Escena.prototype.iniciar = function () {


  /* Solo se calcula mientras el recorrido está en pantalla */
  if ("IntersectionObserver" in window) {
    this.observador = new IntersectionObserver((entradas) => {
      this.visible = entradas[0].isIntersecting;
      if (this.visible) this._solicitar();
    }, { rootMargin: "120px 0px" });
    this.observador.observe(this.pista);
  } else {
    this.visible = true;
  }

  window.addEventListener("scroll", this._alDesplazar, { passive: true });
  window.addEventListener("resize", this._alDesplazar, { passive: true });
  document.addEventListener("visibilitychange", this._alCambiarVisibilidad);

  this.raiz.classList.add("escena-lista");
  /* Estado correcto aunque se recargue a mitad de página */
  this._pintar();
};

Escena.prototype._alCambiarVisibilidad = function () {
  if (!document.hidden && this.visible) this._solicitar();
};

Escena.prototype._alDesplazar = function () { this._solicitar(); };

Escena.prototype._solicitar = function () {
  if (this.pendiente || this.destruido) return;
  if (document.hidden) return;              /* pestaña oculta: no se pinta */
  if (!this.visible) return;                /* fuera de pantalla: no se pinta */
  this.pendiente = true;
  window.requestAnimationFrame(this._pintar);
};

Escena.prototype._pintar = function () {
  this.pendiente = false;
  if (this.destruido || !this.pista) return;

  var caja = this.pista.getBoundingClientRect();
  var alto = window.innerHeight;
  var recorrido = caja.height - alto;
  /* p = 0 al entrar, 1 al salir. Derivado de la posición: reversible. */
  var p = recorrido <= 0 ? 0 : limitar(-caja.top / recorrido, 0, 1);

  for (var nombre in this.paneles) {
    var el = this.paneles[nombre];
    if (!el) continue;
    aplicar(el, interpolar(COREOGRAFIA[nombre], p, CLAVES));
  }

  /* Paso activo: 4 tramos iguales */
  var indice = limitar(Math.floor(p * 4), 0, 3);
  if (indice !== this.ultimoPaso) {
    for (var i = 0; i < this.pasos.length; i++) {
      this.pasos[i].setAttribute("data-activo", i === indice ? "true" : "false");
    }
    this.ultimoPaso = indice;
  }

  /* Medidores de avance */
  for (var m = 0; m < this.medidores.length; m++) {
    var local = limitar(p * 4 - m, 0, 1);
    this.medidores[m].style.width = (local * 100).toFixed(1) + "%";
  }
};

Escena.prototype.destruir = function () {
  this.destruido = true;
  window.removeEventListener("scroll", this._alDesplazar);
  window.removeEventListener("resize", this._alDesplazar);
  document.removeEventListener("visibilitychange", this._alCambiarVisibilidad);
  if (this.observador) { this.observador.disconnect(); this.observador = null; }
  this.paneles = {}; this.pasos = []; this.medidores = [];
};

/* ============================================================
   Paralaje suave del hero (puntero, solo escritorio fino)
   ============================================================ */

function HeroParalaje(raiz) {
  var paneles = Array.prototype.slice.call(raiz.querySelectorAll(".panel"));
  var fotograma = null, mx = 0, my = 0;

  function mover(e) {
    var c = raiz.getBoundingClientRect();
    mx = (e.clientX - (c.left + c.width / 2)) / c.width;
    my = (e.clientY - (c.top + c.height / 2)) / c.height;
    if (fotograma !== null) return;
    fotograma = requestAnimationFrame(function () {
      fotograma = null;
      for (var i = 0; i < paneles.length; i++) {
        var f = parseFloat(paneles[i].getAttribute("data-profundidad") || "1");
        paneles[i].style.setProperty("--mx", (mx * 8 * f).toFixed(2) + "deg");
        paneles[i].style.setProperty("--my", (-my * 6 * f).toFixed(2) + "deg");
      }
    });
  }

  function salir() {
    if (fotograma !== null) cancelAnimationFrame(fotograma);
    fotograma = null;
    for (var i = 0; i < paneles.length; i++) {
      paneles[i].style.removeProperty("--mx");
      paneles[i].style.removeProperty("--my");
    }
  }

  raiz.addEventListener("pointermove", mover);
  raiz.addEventListener("pointerleave", salir);
  return {
    destruir: function () {
      salir();
      raiz.removeEventListener("pointermove", mover);
      raiz.removeEventListener("pointerleave", salir);
    }
  };
}

export function iniciarEscena(hero, relato) {
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");
  const esAncho = window.matchMedia("(min-width: 981px)");
  const punteroFino = window.matchMedia("(pointer: fine)");
  let escena;
  let paralaje;

  function limpiar() {
    escena?.destruir();
    paralaje?.destruir();
    escena = undefined;
    paralaje = undefined;
    relato.classList.remove("escena-lista");
    for (const panel of relato.querySelectorAll("[data-panel]")) {
      panel.style.removeProperty("transform");
      panel.style.removeProperty("opacity");
    }
  }

  function actualizar() {
    limpiar();
    if (sinMovimiento.matches || !esAncho.matches) return;
    escena = new Escena(relato);
    if (punteroFino.matches) paralaje = HeroParalaje(hero);
  }

  const preferencias = [sinMovimiento, esAncho, punteroFino];
  for (const preferencia of preferencias) {
    preferencia.addEventListener("change", actualizar);
  }
  actualizar();

  return () => {
    for (const preferencia of preferencias) {
      preferencia.removeEventListener("change", actualizar);
    }
    limpiar();
  };
}
