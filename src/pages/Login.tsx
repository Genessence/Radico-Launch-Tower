import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, Role } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wine } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("Team");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!name.trim()) return;
    login(name.trim(), role);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="w-[380px] border-primary/30">
          <CardHeader className="text-center space-y-3">
            <div className="flex justify-center">
              <Wine className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-primary text-xl">Radico Launch Tower</CardTitle>
            <p className="text-xs text-muted-foreground">Brand Launch Control Tower</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Role</label>
              <Select value={role} onValueChange={v => setRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CXO">CXO</SelectItem>
                  <SelectItem value="Head">Head</SelectItem>
                  <SelectItem value="Team">Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleLogin} disabled={!name.trim()}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
