import { PanelSidebar } from "@/components/panel/PanelSidebar";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="portal">
      <PanelSidebar />
      <div className="principal">
        {children}
      </div>
    </div>
  );
}
