import { supabase } from "@/lib/supabase";

const clearSupabaseAuthStorage = () => {
  if (typeof window === "undefined") return;

  const removeSupabaseKeys = (store: Storage) => {
    const keysToRemove: string[] = [];
    for (let index = 0; index < store.length; index += 1) {
      const key = store.key(index);
      if (!key) continue;
      if (key.startsWith("sb-") && key.includes("auth-token")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => store.removeItem(key));
  };

  removeSupabaseKeys(window.localStorage);
  removeSupabaseKeys(window.sessionStorage);
};

export const signOutAndRedirect = async (redirectPath?: string) => {
  try {
    if (supabase) {
      await supabase.auth.signOut({ scope: "global" });
    }
  } catch {
    // Continue to local cleanup and redirect even if remote signout fails.
  }

  clearSupabaseAuthStorage();

  if (typeof window !== "undefined" && redirectPath) {
    window.history.replaceState({}, "", redirectPath);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
};
