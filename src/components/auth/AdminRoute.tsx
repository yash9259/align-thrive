import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

type AdminRouteProps = {
  children: ReactNode;
};

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    let active = true;

    const check = async () => {
      if (!isSupabaseConfigured || !supabase) {
        if (!active) return;
        setIsAllowed(false);
        setIsChecking(false);
        return;
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (sessionError || !user) {
        if (!active) return;
        setIsAllowed(false);
        setIsChecking(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const roleFromProfile = profile?.role as string | undefined;
      const roleFromMeta = (user.user_metadata?.role as string | undefined)?.toLowerCase();
      const role = roleFromProfile ?? roleFromMeta;

      if (!active) return;
      setIsAllowed(!profileError && role === "admin");
      setIsChecking(false);
    };

    void check();
    return () => {
      active = false;
    };
  }, []);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking admin access...
      </div>
    );
  }

  if (!isAllowed) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
