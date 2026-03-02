import PublicNavbar from "@/components/layout/PublicNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => (
  <div className="min-h-screen bg-background">
    <PublicNavbar />
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
            <Flame className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <p className="text-sm text-muted-foreground">Sign in to your Align account</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Email</Label><Input type="email" defaultValue="sarah@creator.com" /></div>
          <div><Label>Password</Label><Input type="password" defaultValue="••••••••" /></div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" defaultChecked className="rounded" /> Remember me
            </label>
            <span className="text-primary cursor-pointer hover:underline">Forgot password?</span>
          </div>
          <Button className="w-full gradient-primary text-primary-foreground">Sign In</Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or continue with</span></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">Google</Button>
            <Button variant="outline" className="w-full">Apple</Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/register" className="font-medium text-primary hover:underline">Sign up</Link>
          </p>

          {/* Quick Access */}
          <div className="mt-4 rounded-lg bg-secondary/50 p-4">
            <p className="text-xs font-medium text-muted-foreground mb-3">Quick Demo Access:</p>
            <div className="flex flex-col gap-2">
              <Link to="/brand"><Button variant="outline" size="sm" className="w-full justify-start">🧑‍💼 Brand Dashboard</Button></Link>
              <Link to="/creator"><Button variant="outline" size="sm" className="w-full justify-start">🎥 Creator Dashboard</Button></Link>
              <Link to="/admin"><Button variant="outline" size="sm" className="w-full justify-start">🛡️ Admin Dashboard</Button></Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Login;
