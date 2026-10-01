# PRD MAESTRO
## Plataforma Web Educativa — Preicfes Bertel

**Versión:** 1.0  
**Estado:** Documento base de producto  
**Fecha:** Septiembre de 2026  
**Tipo de producto:** Aplicación web educativa + sitio web institucional  
**Mercado inicial:** Colombia  
**Usuarios principales:** Clientes potenciales, padres de familia, estudiantes, docentes y administradores

---

# 1. Propósito del documento

Este documento define los requisitos generales del producto digital de Preicfes Bertel y sirve como referencia principal para diseño UX/UI, arquitectura, base de datos, frontend, backend, autenticación, evaluaciones, panel administrativo, seguridad, pruebas, despliegue y futuras ampliaciones.

Toda decisión de desarrollo deberá respetar este PRD salvo que exista una modificación explícita y documentada.

---

# 2. Visión del producto

Crear una plataforma digital centralizada para Preicfes Bertel que cumpla simultáneamente cuatro funciones:

1. Presentar profesionalmente la empresa, sus servicios, metodología, trayectoria y resultados.
2. Convertir visitantes en potenciales clientes mediante información clara y mecanismos de contacto.
3. Proporcionar a estudiantes matriculados un entorno privado donde puedan realizar simulacros y pruebas académicas.
4. Permitir a la empresa administrar estudiantes, contenidos, preguntas, pruebas y resultados sin necesidad de modificar el código.

La plataforma deberá evolucionar posteriormente hacia un ecosistema educativo basado en datos capaz de analizar el desempeño de los estudiantes y generar recomendaciones personalizadas.

---

# 3. Problema que se busca resolver

Actualmente la información comercial, académica y administrativa puede encontrarse distribuida entre redes sociales, WhatsApp, documentos, archivos y procesos manuales.

Además, realizar simulacros académicos mediante herramientas externas dificulta:

- mantener historial de resultados;
- identificar a cada estudiante;
- administrar preguntas;
- actualizar evaluaciones;
- analizar desempeño por materia;
- comparar resultados históricos;
- obtener estadísticas académicas;
- ofrecer una experiencia de marca unificada.

La plataforma deberá centralizar estas necesidades.

---

# 4. Objetivo general

Diseñar y desarrollar una aplicación web segura, responsive, administrable y escalable que funcione como sitio institucional de Preicfes Bertel y como plataforma académica privada para sus estudiantes.

---

# 5. Objetivos específicos

La plataforma deberá permitir:

- presentar la empresa profesionalmente;
- mostrar programas, servicios y productos educativos;
- explicar misión, visión, metodología y propuesta de valor;
- mostrar resultados históricos y casos destacados;
- facilitar el contacto con potenciales clientes;
- permitir autenticación individual de estudiantes;
- organizar estudiantes por programas y grupos;
- alojar un banco central de preguntas;
- crear múltiples pruebas y simulacros;
- asignar pruebas a estudiantes o grupos;
- responder evaluaciones directamente desde la plataforma;
- guardar automáticamente las respuestas;
- calcular resultados automáticamente;
- identificar respuestas correctas e incorrectas;
- mostrar resultados generales y por materia;
- guardar historial académico;
- permitir actualizar contenido sin modificar código;
- crear nuevas pruebas sin volver a desplegar la aplicación;
- generar estadísticas administrativas y académicas;
- mantener controles de acceso adecuados;
- permitir crecimiento futuro.

---

# 6. Principios fundamentales

## 6.1 Administrable sin programación

La información que cambia regularmente no deberá estar escrita directamente en el código. Esto incluye programas, servicios, fechas, testimonios, resultados institucionales, preguntas, simulacros, estudiantes, grupos y contenidos editables.

## 6.2 Mobile First

La plataforma deberá funcionar correctamente en celulares, tabletas, portátiles y computadores de escritorio.

## 6.3 Modularidad

Cada función importante deberá organizarse como módulo independiente: autenticación, estudiantes, pruebas, preguntas, resultados, página institucional y administración.

## 6.4 Seguridad

Un estudiante nunca deberá poder modificar preguntas, consultar respuestas correctas antes de terminar, acceder a resultados ajenos, administrar usuarios ni acceder al panel administrativo.

## 6.5 Escalabilidad

El sistema deberá poder crecer desde cientos a miles de estudiantes sin reconstruirse completamente.

## 6.6 Integridad de datos

Se deberá conservar historial de intentos, respuestas, resultados y pruebas realizadas.

---

# 7. Alcance general del producto

El producto tendrá tres grandes entornos:

1. **Sitio público:** información, posicionamiento, confianza y captación comercial.
2. **Campus del estudiante:** realización de pruebas, resultados y seguimiento académico.
3. **Administración:** gestión de usuarios, contenido, preguntas, pruebas y resultados.

---

# 8. Tipos de usuario

## 8.1 Visitante

Puede ser estudiante, padre, docente, colegio o cliente potencial. Necesita conocer la empresa, programas, resultados, fechas, modalidades y formas de contacto.

## 8.2 Estudiante

Puede iniciar sesión, consultar pruebas, realizar simulacros, continuar intentos permitidos, consultar resultados, fortalezas, debilidades e historial.

## 8.3 Docente

Podrá crear preguntas, editar preguntas propias, participar en revisión y consultar resultados de grupos autorizados.

## 8.4 Coordinador

Podrá gestionar grupos, asignar estudiantes, crear simulacros, publicar pruebas y consultar resultados.

## 8.5 Administrador

Podrá administrar estudiantes, docentes, coordinadores, grupos, programas, preguntas, simulacros, resultados, contenido y configuraciones.

## 8.6 Superadministrador

Rol reservado para asignación de administradores, configuraciones críticas, permisos y auditorías.

---

# 9. Programas educativos

La arquitectura deberá permitir múltiples programas. Inicialmente:

- PreICFES;
- Preuniversitario;
- Curso para el Magisterio.

La plataforma no deberá quedar limitada a ellos y deberá permitir agregar nuevos programas.

---

# 10. Sitio público

La primera versión contemplará:

- Inicio;
- Nosotros;
- Programas;
- Metodología;
- Resultados;
- Testimonios;
- FAQ;
- Contacto;
- Política de privacidad;
- Términos y condiciones;
- Login.

---

# 11. Inicio

Deberá presentar:

- propuesta de valor;
- programas principales;
- resultados destacados;
- metodología;
- testimonios;
- llamados a la acción;
- acceso al campus.

---

# 12. Nosotros

Deberá incluir:

- historia;
- quiénes somos;
- misión;
- visión;
- valores;
- equipo;
- filosofía educativa.

---

# 13. Programas

Cada programa deberá tener su propia página con:

- nombre;
- descripción;
- público objetivo;
- modalidad;
- beneficios;
- metodología;
- duración;
- fechas;
- información comercial;
- CTA.

---

# 14. Resultados

Deberá presentar resultados institucionales históricos mediante estadísticas, indicadores, gráficos, logros y casos destacados. La información deberá ser editable desde administración.

---

# 15. Contacto

Deberá integrar formulario, WhatsApp, teléfono, correo y redes sociales. Los mensajes deberán almacenarse o enviarse mediante un mecanismo seguro.

---

# 16. Autenticación

Cada estudiante deberá tener una cuenta individual con identificador único, credenciales personales, rol y estado.

Estados de cuenta:

- invited;
- active;
- inactive;
- suspended.

Se deberá permitir recuperación segura de contraseña.

---

# 17. Códigos de acceso

El sistema podrá utilizar códigos adicionales para:

- matricularse en un grupo;
- desbloquear un programa;
- acceder a determinadas pruebas;
- habilitar contenido.

Los códigos podrán tener fecha de vencimiento, máximo de usos, programa/grupo asociado y estado.

---

# 18. Grupos

Los estudiantes deberán poder organizarse por cohortes o grupos. Un estudiante podrá pertenecer a uno o varios grupos según la lógica de negocio.

---

# 19. Perfil del estudiante

Datos sugeridos:

- nombre;
- apellidos;
- correo;
- identificación interna;
- grupo;
- programa;
- estado.

Solo se recopilarán datos necesarios.

---

# 20. Dashboard del estudiante

Debe mostrar:

- saludo;
- pruebas pendientes;
- pruebas disponibles;
- últimos resultados;
- desempeño general;
- acceso al historial.

---

# 21. Materias

Para PreICFES inicialmente:

- Matemáticas;
- Lectura Crítica;
- Ciencias Naturales;
- Sociales y Ciudadanas;
- Inglés.

La arquitectura deberá permitir materias adicionales.

---

# 22. Temas y competencias

Cada materia podrá contener temas, subtemas y competencias para permitir análisis académico detallado.

---

# 23. Banco de preguntas

Cada pregunta deberá tener:

- ID;
- materia;
- tema;
- subtema;
- competencia;
- dificultad;
- enunciado;
- multimedia;
- opciones;
- respuesta correcta;
- explicación;
- autor;
- estado;
- fecha de creación;
- fecha de actualización.

Estados iniciales:

- borrador;
- revisión;
- publicada;
- archivada.

La V1 se centrará en selección múltiple con única respuesta.

---

# 24. Constructor de pruebas

Cada prueba podrá definir:

- nombre;
- descripción;
- programa;
- grupo;
- materias;
- duración;
- instrucciones;
- preguntas;
- fecha de apertura;
- fecha de cierre;
- intentos permitidos;
- estado;
- comportamiento de resultados.

Estados:

- borrador;
- programada;
- activa;
- cerrada;
- archivada.

---

# 25. Asignación de pruebas

Una prueba podrá asignarse a uno o varios estudiantes, uno o varios grupos o un programa.

---

# 26. Motor de evaluaciones

La interfaz deberá mostrar:

- nombre de prueba;
- instrucciones;
- pregunta;
- opciones;
- navegación;
- progreso;
- tiempo restante.

Durante la prueba deberá ser posible:

- siguiente;
- anterior;
- seleccionar pregunta;
- distinguir contestadas y pendientes;
- marcar para revisar.

---

# 27. Temporizador

El temporizador deberá persistir correctamente tras recargas, depender de datos confiables del servidor y no poder extenderse artificialmente desde el navegador.

---

# 28. Autoguardado

Las respuestas deberán guardarse automáticamente y recuperarse tras recarga, cierre accidental o interrupciones breves de conexión.

---

# 29. Continuidad de intento

Si el estudiante cierra accidentalmente la plataforma, deberá poder regresar al mismo intento conservando respuestas, progreso y tiempo real restante.

---

# 30. Entrega

Antes de finalizar deberá mostrarse confirmación. Después de entregar, las respuestas no podrán modificarse salvo función administrativa excepcional.

---

# 31. Calificación

La V1 deberá calcular:

- preguntas totales;
- correctas;
- incorrectas;
- sin responder;
- porcentaje de aciertos;
- resultados por materia;
- resultados por tema;
- resultados por competencia.

---

# 32. Puntaje estimado

Cuando se presente una escala relacionada con Saber 11, deberá identificarse como **puntaje estimado** y nunca como puntaje oficial. La fórmula deberá ser configurable y documentada.

---

# 33. Resultados

Según configuración, el estudiante podrá visualizar:

- puntaje;
- porcentaje;
- correctas;
- incorrectas;
- desempeño por materia;
- preguntas correctas e incorrectas;
- respuesta seleccionada;
- respuesta correcta;
- explicación.

El administrador deberá decidir cuándo liberar respuestas correctas.

---

# 34. Seguridad de respuestas

Las respuestas correctas no deberán quedar expuestas durante una evaluación activa. La validación deberá realizarse en servidor.

---

# 35. Historial

Cada intento deberá conservar:

- prueba;
- fecha;
- duración;
- puntaje;
- porcentaje;
- resultados por materia.

---

# 36. Intentos

El administrador podrá configurar uno, varios o intentos ilimitados. El sistema deberá permitir definir qué resultado se usa en estadísticas: primero, último, mejor o promedio.

---

# 37. Panel administrativo

Secciones iniciales:

- Dashboard;
- estudiantes;
- docentes;
- grupos;
- programas;
- materias;
- preguntas;
- pruebas;
- resultados;
- estadísticas;
- contenido web;
- configuraciones.

---

# 38. Dashboard administrativo

Indicadores básicos:

- estudiantes activos;
- grupos activos;
- pruebas activas;
- pruebas realizadas;
- promedio general;
- cantidad de preguntas.

---

# 39. Administración de estudiantes

Los administradores podrán crear, consultar, editar, activar, desactivar, asignar grupos y consultar historial. Se preferirá desactivación frente a eliminación permanente.

---

# 40. Administración de contenido

Deberán ser editables sin código:

- programas;
- testimonios;
- resultados destacados;
- FAQ;
- contenidos institucionales seleccionados.

---

# 41. Estadísticas V1

El administrador podrá consultar:

- resultados por estudiante;
- resultados por prueba;
- resultados por grupo;
- promedio por materia;
- porcentaje de aciertos;
- preguntas más falladas;
- preguntas más acertadas.

---

# 42. Exportación

Se contemplará exportación a CSV y Excel para resultados, estudiantes y estadísticas.

---

# 43. Búsqueda y filtros

Las tablas administrativas deberán soportar búsqueda, filtros y paginación.

---

# 44. Auditoría

Las acciones administrativas relevantes deberán registrar usuario, acción, fecha y entidad afectada.

---

# 45. Experiencia visual

La plataforma deberá transmitir una identidad:

- profesional;
- moderna;
- académica;
- confiable;
- juvenil sin resultar infantil;
- organizada;
- tecnológica.

---

# 46. Accesibilidad

El diseño deberá procurar contraste, textos legibles, áreas de interacción adecuadas, navegación clara y formularios comprensibles.

---

# 47. Performance

Se deberá optimizar:

- imágenes;
- consultas;
- recursos estáticos;
- carga de preguntas.

---

# 48. Seguridad

El sistema deberá contemplar:

- autenticación segura;
- autorización por roles;
- protección de rutas;
- protección de datos académicos;
- validación en servidor;
- RLS;
- variables de entorno;
- protección contra acciones administrativas no autorizadas.

---

# 49. Privacidad

Se evitará recopilar información innecesaria y se contemplará la normativa colombiana de protección de datos, con especial atención a menores de edad.

---

# 50. Respaldos

Se deberán respaldar:

- usuarios;
- preguntas;
- evaluaciones;
- intentos;
- respuestas;
- resultados;
- archivos.

---

# 51. Concurrencia

El sistema deberá soportar múltiples estudiantes guardando y entregando simultáneamente sin duplicaciones ni resultados inconsistentes.

---

# 52. Compatibilidad

Navegadores prioritarios:

- Chrome;
- Edge;
- Safari;
- navegadores móviles modernos.

---

# 53. SEO

Solo las páginas públicas deberán indexarse. Campus, admin y login no deberán indexarse.

---

# 54. Analítica

Eventos comerciales posibles:

- page_view;
- program_view;
- whatsapp_click;
- contact_submit.

Eventos académicos:

- exam_started;
- exam_submitted.

---

# 55. Contactos comerciales

Campos mínimos sugeridos:

- nombre;
- teléfono;
- programa de interés.

Opcionales:

- correo;
- mensaje.

---

# 56. WhatsApp

La V1 podrá usar enlaces directos. Integraciones API y CRM quedan para versiones posteriores.

---

# 57. Notificaciones

No será obligatorio implementar un sistema complejo en el MVP, pero la arquitectura deberá permitir correo, avisos internos, WhatsApp y recordatorios.

---

# 58. Casos especiales del simulacro

Debe contemplar:

- recarga;
- dos pestañas;
- pérdida de conexión;
- tiempo agotado;
- doble envío;
- prueba cerrada.

---

# 59. Reglas de negocio iniciales

**RB-001:** todo usuario debe tener un rol.  
**RB-002:** estudiantes solo acceden a contenido autorizado.  
**RB-003:** pruebas en borrador no son visibles.  
**RB-004:** respuestas correctas no se exponen durante prueba activa.  
**RB-005:** cada intento pertenece a un único estudiante.  
**RB-006:** cada respuesta pertenece a un intento.  
**RB-007:** un intento entregado queda cerrado.  
**RB-008:** un resultado debe poder reproducirse desde las respuestas registradas.  
**RB-009:** datos históricos no se sobrescriben al modificar posteriormente una prueba.  
**RB-010:** una pregunta utilizada históricamente no se elimina físicamente si destruye historial.

---

# 60. MVP — Versión 1.0

## Sitio público

- Inicio;
- Nosotros;
- Programas;
- Metodología;
- Resultados;
- FAQ;
- Contacto.

## Usuarios

- login;
- recuperación de contraseña;
- roles;
- estudiantes;
- grupos.

## Campus

- dashboard;
- pruebas;
- historial;
- resultados;
- perfil.

## Evaluaciones

- banco de preguntas;
- selección múltiple;
- simulacros;
- temporizador;
- navegación;
- autoguardado;
- entrega;
- calificación automática.

## Administración

- estudiantes;
- grupos;
- preguntas;
- simulacros;
- resultados;
- contenido básico.

## Estadísticas

- estudiante;
- grupo;
- prueba;
- materia.

---

# 61. Fuera del alcance del MVP

- app móvil nativa;
- videoconferencia;
- streaming propio;
- LMS completo;
- pagos en línea complejos;
- marketplace;
- certificados;
- gamificación avanzada;
- red social;
- chat;
- IA personalizada;
- TRI propia;
- reconocimiento facial;
- proctoring por cámara;
- bloqueo del computador;
- sistema contable;
- CRM empresarial completo.

---

# 62. Funciones V2

- recomendaciones académicas;
- análisis por competencia;
- comparación histórica;
- prácticas personalizadas;
- creación automática de pruebas;
- notificaciones;
- importación masiva;
- reportes PDF;
- dashboards avanzados;
- pagos;
- integración WhatsApp;
- contenidos académicos adicionales.

---

# 63. Funciones V3

- tutor con IA;
- modelos predictivos;
- rutas de aprendizaje personalizadas;
- análisis psicométrico;
- calibración de dificultad;
- TRI;
- recomendación automática;
- generación asistida de preguntas;
- detección de anomalías;
- apps móviles.

---

# 64. Métricas de éxito

## Comerciales

- visitas;
- contactos;
- conversiones;
- programas consultados.

## Uso

- usuarios activos;
- estudiantes activos;
- frecuencia de ingreso.

## Académicas

- pruebas completadas;
- tasa de finalización;
- promedio;
- desempeño por materia;
- evolución.

## Operativas

- preguntas creadas;
- pruebas publicadas;
- tiempo para crear simulacro;
- errores.

---

# 65. Criterios de aceptación del MVP

El MVP se considera funcional cuando:

1. Un visitante puede navegar por el sitio público.
2. Un estudiante puede iniciar sesión.
3. Un administrador puede crear estudiante.
4. Puede crear grupo.
5. Puede crear preguntas.
6. Puede crear prueba.
7. Puede asignarla.
8. El estudiante puede iniciarla.
9. Las respuestas se guardan.
10. El temporizador funciona.
11. El estudiante puede entregar.
12. El sistema califica.
13. El estudiante consulta el resultado permitido.
14. El administrador consulta resultados.
15. No hay acceso a datos ajenos.
16. No se exponen respuestas correctas durante la prueba.
17. Funciona en móvil y escritorio.
18. Se conserva historial.
19. Se actualizan preguntas y pruebas sin modificar código.
20. El contenido administrable se actualiza sin redeploy.

---

# 66. Prioridades

**P0 — Crítico:** login, usuarios, banco de preguntas, simulacros, respuestas, resultados, seguridad.  
**P1 — Importante:** dashboard, estadísticas, autoguardado, contenido administrable.  
**P2 — Deseable:** mejoras posteriores.  
**P3 — Futuro:** fuera del MVP.

---

# 67. Regla para desarrollo asistido por IA

Antes de implementar una función nueva deberá verificarse:

1. ¿Existe en el PRD?
2. ¿Es necesaria para cumplir un requisito?
3. ¿Está dentro del alcance?
4. ¿Introduce dependencias?
5. ¿Afecta seguridad?
6. ¿Afecta base de datos?
7. ¿Afecta funciones existentes?

---

# 68. Regla de cambios

Los cambios importantes deberán registrarse por versión:

- PRD 1.0;
- PRD 1.1;
- PRD 1.2;
- PRD 2.0.

Cada cambio deberá documentar qué cambia, por qué y qué afecta.

---

# 69. Definición de terminado

Una funcionalidad no se considera terminada solo porque visualmente funcione. Debe:

- cumplir requisitos;
- funcionar en móvil y escritorio;
- tener validaciones;
- manejar errores;
- respetar permisos;
- no exponer datos sensibles;
- conservar información correctamente;
- superar pruebas básicas;
- estar documentada.

---

# 70. Objetivo final

La plataforma deberá evolucionar desde:

**sitio institucional + simulacros**

hacia:

**plataforma integral de diagnóstico y seguimiento académico.**

La visión futura es convertir los datos de desempeño en información útil para estudiantes, docentes y la empresa.

---

# 71. Principio final

El sistema debe ser suficientemente sencillo para que el equipo administrativo lo utilice sin conocimientos técnicos, pero suficientemente bien estructurado para evolucionar durante varios años sin reconstrucción completa.

**Fin — PRD Maestro v1.0**
