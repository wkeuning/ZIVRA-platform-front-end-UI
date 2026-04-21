import {
  faHome,
  faInbox,
  faPeopleGroup,
  faGamepad,
  faUser,
  faCog,
  faCalendar,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router";
import logo from "@assets/logo.svg";
import { getUserRole } from "@/services/auth/UserService";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthService } from "@/services/auth/AuthService";

// Menu items for non-patient users (therapists/admins)
const defaultItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: faHome,
  },

  {
    title: "Patients",
    url: "/patients",
    icon: faPeopleGroup,
  },
  {
    title: "Games",
    url: "/games",
    icon: faGamepad,
  },
  {
    title: "Inbox",
    url: "/inbox",
    icon: faInbox,
  },
  // {
  //   title: "Stats",
  //   url: "/stats",
  //   icon: faChartSimple,
  // },
  {
    title: "Profile",
    url: "/profile",
    icon: faUser,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: faCog,
  },
];

// Simplified menu items for patient users
const patientItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: faHome,
  },
  {
    title: "Inbox",
    url: "/inbox",
    icon: faInbox,
  },
  {
    title: "Sessions",
    url: "/session",
    icon: faGamepad,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: faCalendar,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: faUser,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const userRole = getUserRole();
  const isMobile = useIsMobile();
  const isPatient = userRole === "Patient";
  const { logout } = useAuthService();
  // Hide sidebar completely for patients on mobile
  if (isMobile && isPatient) {
    return null;
  }

  // Use appropriate menu items based on user role
  const items = isPatient ? patientItems : defaultItems;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {/* Logo section */}
          <div className="flex items-center justify-center p-4">
            <img src={logo} alt="ZIVRA Logo" className="h-12" />
          </div>

          {/* Navigation menu */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      {typeof item.icon === "function" ? (
                        <FontAwesomeIcon icon={item.icon} />
                      ) : (
                        <FontAwesomeIcon
                          icon={item.icon}
                          className={
                            location.pathname === item.url
                              ? "text-white"
                              : "text-[#4C45FC]"
                          }
                        />
                      )}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="hover:bg-red-500 py-2"
              onClick={logout}
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faSignOut} />
                <span>Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
