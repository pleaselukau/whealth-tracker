import { Outlet } from "react-router-dom";

import { AppSidebar } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";

export function AppLayout() {
  return (
    <div>
      <div style={{ display: "flex" }}>
        <div className="desktop-only">
          <AppSidebar />
        </div>

        <main style={{ flex: 1, minWidth: 0 }}>
          <div className="mobile-only">
            <AppTopbar />
          </div>

          <div className="page-content">
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        .desktop-only { display: block; }
        .mobile-only { display: none; }

        @media (max-width: 900px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }
        }
      `}</style>
    </div>
  );
}