import { useEffect, useState } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { syncCreatorSocialMetricsFromSession } from "@/lib/creator-api";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOAuthSubmitting, setIsOAuthSubmitting] = useState(false);

  const routeByRole = (role: string) => {
    if (role === "brand") return "/brand";
    if (role === "creator") return "/creator";
    if (role === "admin") return "/admin";
    return "/";
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let active = true;

    const routeIfSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!active || !session?.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      const role = (profile?.role as string | undefined) ?? (session.user.user_metadata?.role as string | undefined) ?? "creator";

      if (role === "creator") {
        try {
          await syncCreatorSocialMetricsFromSession(session, session.user.id);
        } catch {
          // Ignore sync failures on automatic redirect; creators can manually resync later.
        }
      }

      navigate(routeByRole(role), { replace: true });
    };

    void routeIfSession();

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleOAuthSignIn = async (provider: "google" | "facebook") => {
    if (!isSupabaseConfigured || !supabase) {
      toast({ title: "Supabase not configured", description: "Set Supabase URL and anon key in .env", variant: "destructive" });
      return;
    }

    setIsOAuthSubmitting(true);

    const scopes = provider === "google"
      ? "openid email profile https://www.googleapis.com/auth/youtube.readonly"
      : "email public_profile pages_show_list pages_read_engagement instagram_basic";

    const queryParams = provider === "google"
      ? { access_type: "offline", prompt: "consent" }
      : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/login`,
        scopes,
        queryParams,
      },
    });

    if (error) {
      setIsOAuthSubmitting(false);
      toast({ title: "OAuth sign in failed", description: error.message, variant: "destructive" });
    }
  };

  const handleSignIn = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      toast({ title: "Missing credentials", description: "Please enter email and password.", variant: "destructive" });
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      toast({ title: "Supabase not configured", description: "Set Supabase URL and anon key in .env", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
      if (error) {
        const hint = error.message.toLowerCase().includes("invalid login credentials")
          ? "Invalid email or password. Ensure this exact email exists in Supabase Auth users, then reset password if needed."
          : error.message;
        toast({ title: "Sign in failed", description: hint, variant: "destructive" });
        return;
      }

      const userId = data.user?.id;
      if (!userId) {
        toast({ title: "Sign in failed", description: "No user session returned.", variant: "destructive" });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) {
        toast({ title: "Profile lookup failed", description: profileError.message, variant: "destructive" });
        return;
      }

      const roleFromProfile = profile?.role as string | undefined;
      const roleFromMetadata = data.user.user_metadata?.role as string | undefined;
      const finalRole = roleFromProfile ?? roleFromMetadata ?? "creator";

      toast({ title: "Welcome back", description: "Signed in successfully." });
      navigate(routeByRole(finalRole));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" defaultChecked className="rounded" /> Remember me
              </label>
              <span className="text-primary cursor-pointer hover:underline">Forgot password?</span>
            </div>
            <Button className="w-full gradient-primary text-primary-foreground" onClick={handleSignIn} disabled={isSubmitting}>
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or continue with</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full" disabled={isOAuthSubmitting} onClick={() => void handleOAuthSignIn("google")}>Google + YouTube</Button>
              <Button variant="outline" className="w-full" disabled={isOAuthSubmitting} onClick={() => void handleOAuthSignIn("facebook")}>Facebook + Instagram</Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account? <Link to="/register" className="font-medium text-primary hover:underline">Sign up</Link>
            </p>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
