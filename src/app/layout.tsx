import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Outlet, Link } from "react-router-dom";
import logo from "@assets/logo.svg";
import ProfileIcon from "@/assets/profile.svg";
import { getUserRole } from "@/services/auth/UserService";
import { MobilePatientNav } from "@/components/sidebar/mobile-patient-nav";
import { Toaster } from "@/components/ui/toaster";

export default function Layout() {
  const isMobile = useIsMobile();
  const userRole = getUserRole();
  const isPatient = userRole === "Patient";

  return (
    <SidebarProvider>
      {/* Mobile header - different for patients vs others */}
      {isMobile && (
        <>
          {/* Transparent header for patients (no sidebar toggle) */}
          {isPatient ? (
            <header className="bg-transparent flex items-center justify-center fixed top-0 left-0 right-0 z-50 py-3">
              <img src={logo} alt="ZIVRA Logo" className="logo h-10" />
              <Link to="/profile" className="absolute right-4">
                <img src={ProfileIcon} alt="Profile" className="h-8" />
              </Link>
            </header>
          ) : (
            /* Standard header for non-patients (with sidebar toggle) */
            <header className="bg-[#4C45FC] flex items-center justify-between fixed top-0 left-0 right-0 z-50 py-3 px-4">
              <SidebarTrigger />
              <img src={logo} alt="ZIVRA Logo" className="logo h-10" />
              <Link to="/profile">
                <img src={ProfileIcon} alt="Profile" className="h-8" />
              </Link>
            </header>
          )}

          {/* Bottom navigation bar only for patients on mobile */}
          {isPatient && <MobilePatientNav />}
        </>
      )}

      {/* Sidebar - hidden for patients on mobile */}
      {(!isMobile || !isPatient) && <AppSidebar />}

      {/* Main content area with padding adjustments for mobile */}
      <main
        className={`${
          isMobile ? (isPatient ? "pb-20 pt-[100px]" : "pt-[100px]") : "pt-16"
        } p-6 overflow-x-hidden w-full`}
      >
        <Outlet />
      </main>

      {/* Toast notifications */}
      <Toaster />
    </SidebarProvider>
  );
}
