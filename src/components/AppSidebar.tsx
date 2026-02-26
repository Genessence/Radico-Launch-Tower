import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  CheckCircle,
  FlaskConical,
  Box,
  FileText,
  Factory,
  Megaphone,
  Rocket,
} from "lucide-react";
import { STAGE_NAMES } from "@/data/mockData";

const stageIcons: Record<string, React.ElementType> = {
  "Brand Approval": CheckCircle,
  "R&D / Blend Development": FlaskConical,
  "Packaging": Box,
  "Regulatory": FileText,
  "Manufacturing": Factory,
  "Marketing": Megaphone,
  "Launch": Rocket,
};

const mainNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Brands", url: "/brands", icon: Package },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className="hover:bg-accent/20" activeClassName="bg-accent/30 text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold">Stages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {STAGE_NAMES.map((name) => {
                const Icon = stageIcons[name] || CheckCircle;
                return (
                  <SidebarMenuItem key={name}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={`/stages/${encodeURIComponent(name)}`}
                        className="hover:bg-accent/20"
                        activeClassName="bg-accent/30 text-primary font-medium"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        <span className="text-xs">{name}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
