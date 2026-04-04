// ============================================================
// AUTH CONTEXT — src/contexts/AuthContext.tsx
// Provides authentication state and methods to the entire app.
// Switched from Firebase to Supabase!
// ============================================================

import { useCallback, useContext, useEffect, useState, type ReactNode, createContext } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// --- Custom User interface to match previous app expectation ---
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AppProfile {
  displayName: string | null;
  bio: string;
  avatarUrl: string;
  skills: string[];
  profileComplete: boolean;
}

interface LoginResult {
  user: AppUser | null;
  profile: AppProfile | null;
}

interface AuthContextType {
  user: AppUser | null;
  profile: AppProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  signup: (email: string, password: string, name: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  saveProfile: (input: { displayName: string; bio: string; avatarUrl: string; skills: string[]; profileComplete?: boolean }) => Promise<void>;
  refreshProfile: () => Promise<AppProfile | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const PROFILE_COLUMNS = "display_name, bio, avatar_url, skills, profile_complete";

// Pure function — no component deps, safe to live outside the component
function mapUser(sbUser: SupabaseUser | null | undefined): AppUser | null {
  if (!sbUser) return null;
  return {
    uid: sbUser.id,
    email: sbUser.email || null,
    displayName: sbUser.user_metadata?.displayName || sbUser.user_metadata?.full_name || null,
  };
}

function createEmptyProfile(displayName: string | null = null): AppProfile {
  return {
    displayName,
    bio: "",
    avatarUrl: "",
    skills: [],
    profileComplete: false,
  };
}

function createProfileUpsertPayload(user: SupabaseUser, displayName: string) {
  return {
    id: user.id,
    email: user.email,
    display_name: displayName,
    wallet: 0,
    streak: 0,
    xp: 0,
    stars_caught: 0,
    daily_stars: 0,
    solved_problems: [],
    completed_lessons: [],
    completed_exercises: [],
    unlocked_lessons: [],
    activity_map: {},
    previous_streak: 0,
    time_spent: 0,
    bio: "",
    avatar_url: "",
    skills: [],
    profile_complete: false,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const syncLocalProfileCache = useCallback((nextProfile: AppProfile | null, fallbackUser?: AppUser | null) => {
    if (!nextProfile) {
      localStorage.removeItem("pymaster_profile_complete");
      return;
    }

    const displayName = nextProfile.displayName || fallbackUser?.displayName || fallbackUser?.email?.split("@")[0] || "";
    localStorage.setItem("pymaster_name", displayName);
    localStorage.setItem("pymaster_bio", nextProfile.bio);
    localStorage.setItem("pymaster_avatar", nextProfile.avatarUrl);
    localStorage.setItem("pymaster_skills", JSON.stringify(nextProfile.skills));
    localStorage.setItem("pymaster_profile_complete", String(nextProfile.profileComplete));
  }, []);

  const toProfile = useCallback((row: Record<string, unknown> | null, fallbackUser?: AppUser | null): AppProfile => {
    const displayName =
      typeof row?.display_name === "string" && row.display_name.trim().length > 0
        ? row.display_name
        : fallbackUser?.displayName || fallbackUser?.email?.split("@")[0] || null;

    const skills = Array.isArray(row?.skills) ? row.skills.filter((item): item is string => typeof item === "string") : [];

    return {
      displayName,
      bio: typeof row?.bio === "string" ? row.bio : "",
      avatarUrl: typeof row?.avatar_url === "string" ? row.avatar_url : "",
      skills,
      profileComplete: row?.profile_complete === true,
    };
  }, []);

  const fetchOrCreateProfile = useCallback(
    async (sbUser: SupabaseUser | null | undefined): Promise<AppProfile | null> => {
      if (!sbUser) {
        setProfile(null);
        syncLocalProfileCache(null);
        return null;
      }

      const appUser = mapUser(sbUser);

      const { data, error } = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("id", sbUser.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      const initialName = appUser?.displayName || sbUser.email?.split("@")[0] || "";

      if (!data) {
        const { error: upsertError } = await supabase.from("profiles").upsert(createProfileUpsertPayload(sbUser, initialName));

        if (upsertError) {
          throw upsertError;
        }

        const createdProfile = createEmptyProfile(initialName || null);

        setProfile(createdProfile);
        syncLocalProfileCache(createdProfile, appUser);
        return createdProfile;
      }

      const nextProfile = toProfile(data, appUser);
      setProfile(nextProfile);
      syncLocalProfileCache(nextProfile, appUser);
      return nextProfile;
    },
    [syncLocalProfileCache, toProfile],
  );

  const refreshProfile = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    return fetchOrCreateProfile(data.user);
  }, [fetchOrCreateProfile]);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const nextUser = mapUser(session?.user);
      setUser(nextUser);
      fetchOrCreateProfile(session?.user)
        .catch(() => {
          setProfile(null);
        })
        .finally(() => setLoading(false));
    });

    // 2. Listen for auth changes (login/logout/token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = mapUser(session?.user);
      setUser(nextUser);
      fetchOrCreateProfile(session?.user)
        .catch(() => {
          setProfile(null);
        })
        .finally(() => setLoading(false));
    });

    return () => subscription.unsubscribe();
  }, [fetchOrCreateProfile]);

  // --- Email/Password Login ---
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
    const nextUser = mapUser(data.user);
    const nextProfile = await fetchOrCreateProfile(data.user);
    return { user: nextUser, profile: nextProfile };
  };

  // --- Email/Password Signup ---
  const signup = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          displayName: name.trim(), // Custom metadata
        },
      },
    });
    if (error) throw error;

    // Supabase Auth officially created the user. Now create their profiles row.
    if (data.user) {
      await supabase.from("profiles").upsert(createProfileUpsertPayload(data.user, name));
    }

    const nextUser = mapUser(data.user);
    const nextProfile = await fetchOrCreateProfile(data.user);
    return { user: nextUser, profile: nextProfile };
  };

  // --- Logout ---
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
    localStorage.removeItem("pymaster_profile_complete");
  };

  // --- Password Reset ---
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) throw error;
  };

  // --- Google Sign-In ---
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const saveProfile = useCallback(
    async (input: { displayName: string; bio: string; avatarUrl: string; skills: string[]; profileComplete?: boolean }) => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        throw new Error("You must be signed in to update your profile.");
      }

      const nextProfile: AppProfile = {
        displayName: input.displayName.trim() || null,
        bio: input.bio.trim(),
        avatarUrl: input.avatarUrl,
        skills: input.skills,
        profileComplete: input.profileComplete ?? true,
      };

      const { error } = await supabase.from("profiles").upsert({
        id: data.user.id,
        email: data.user.email,
        display_name: nextProfile.displayName,
        bio: nextProfile.bio,
        avatar_url: nextProfile.avatarUrl,
        skills: nextProfile.skills,
        profile_complete: nextProfile.profileComplete,
      });

      if (error) throw error;

      await supabase.auth.updateUser({
        data: {
          displayName: nextProfile.displayName,
          full_name: nextProfile.displayName,
        },
      });

      setProfile(nextProfile);
      syncLocalProfileCache(nextProfile, mapUser(data.user));
    },
    [syncLocalProfileCache],
  );

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, signup, logout, resetPassword, signInWithGoogle, saveProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
