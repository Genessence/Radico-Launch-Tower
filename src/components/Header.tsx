import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogOut, Wine } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, role, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <Wine className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold text-primary tracking-tight">Radico Launch Tower</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {user} ({role})
        </span>
        <Button variant="ghost" size="icon" onClick={toggle} className="h-8 w-8">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
