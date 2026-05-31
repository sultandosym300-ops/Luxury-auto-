import { useState, useEffect, useCallback } from "react";
import type { AuthUser } from "./api";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

let _state: AuthState = { user: null, isLoading: true, isAuthenticated: false };
const _listeners = new Set<() => void>();

function notify() { _listeners.forEach(fn => fn()); }

async function fetchUser() {
  try {
    const res = await fetch("/api/auth/user", { credentials: "include" });
    const data = await res.json();
    _state = { user: data.user ?? null, isLoading: false, isAuthenticated: !!data.user };
  } catch {
    _state = { user: null, isLoading: false, isAuthenticated: false };
  }
  notify();
}

// fetch once on module load
fetchUser();

export function useAuth() {
  const [state, setState] = useState(_state);

  useEffect(() => {
    const handler = () => setState({ ..._state });
    _listeners.add(handler);
    return () => { _listeners.delete(handler); };
  }, []);

  const login = useCallback(() => {
    window.location.href = `/api/login?returnTo=${encodeURIComponent(window.location.pathname)}`;
  }, []);

  const logout = useCallback(() => {
    window.location.href = "/api/logout";
  }, []);

  return { ...state, login, logout, refetch: fetchUser };
}
