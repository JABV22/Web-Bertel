import { requireRole } from "@/services/auth";
import { PanelSidebar } from "@/components/panel/PanelSidebar";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { roles } = await requireRole(["estudiante", "profesor", "admin"]);

  return (
    <div className="portal">
      <PanelSidebar isAdmin={roles.includes("admin")} />
      <div className="principal">
        {children}
      </div>
    </div>
  );
}
