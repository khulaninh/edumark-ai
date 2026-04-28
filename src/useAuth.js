// src/hooks/useAuth.js
// ─────────────────────────────────────────────────────────────
// All Supabase authentication logic in one place.
// Import and use this hook anywhere in the app.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export function useAuth() {
  const [user, setUser]       = useState(null);   // Supabase auth user
  const [profile, setProfile] = useState(null);   // Our profiles table row
  const [loading, setLoading] = useState(true);   // true while session is loading
  const [error, setError]     = useState(null);

  // ── Load profile from our profiles table ───────────────────
  const loadProfile = useCallback(async (userId) => {
    if (!userId) { setProfile(null); return; }
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_schools (
          school_id,
          schools ( id, name, type, province, district, municipality, ward )
        )
      `)
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error loading profile:', error.message);
      setProfile(null);
    } else {
      // Flatten schools into a simple array like the rest of the app expects
      const schools = data.user_schools?.map(us => ({
        id:   us.schools?.id,
        name: us.schools?.name,
        type: us.schools?.type,
      })) || [];
      setProfile({ ...data, schools });
    }
  }, []);

  // ── Listen for auth state changes ──────────────────────────
  // This runs when the app loads (restores session) and whenever
  // the user logs in or out.
  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  // ── SIGN UP ─────────────────────────────────────────────────
  // Called from the Register page.
  // userData contains all the fields from the registration form.
  const signUp = async (email, password, userData) => {
    setError(null);
    setLoading(true);

    // 1. Create the Supabase auth account.
    //    We pass all profile data as metadata so the database trigger
    //    can automatically create the profiles row.
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role:         userData.role,
          fname:        userData.fname,
          lname:        userData.lname,
          phone:        userData.phone        || null,
          sace_number:  userData.sace         || null,
          grade:        userData.grade        || null,
          province:     userData.province     || null,
          district:     userData.district     || null,
          municipality: userData.municipality || null,
          ward:         userData.ward         || null,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return { success: false, error: signUpError.message };
    }

    // 2. Link the user to their selected schools in user_schools table
    if (data.user && userData.schools?.length > 0) {
      const schoolLinks = userData.schools.map(s => ({
        user_id:   data.user.id,
        school_id: s.id,
      }));
      const { error: schoolError } = await supabase
        .from('user_schools')
        .insert(schoolLinks);

      if (schoolError) {
        console.error('Error linking schools:', schoolError.message);
        // Non-fatal — user is created, just schools not linked
      }
    }

    setLoading(false);
    return { success: true, user: data.user };
  };

  // ── SIGN IN ─────────────────────────────────────────────────
  const signIn = async (email, password) => {
    setError(null);
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return { success: false, error: signInError.message };
    }

    // Profile is loaded automatically by the onAuthStateChange listener
    setLoading(false);
    return { success: true, user: data.user };
  };

  // ── SIGN OUT ────────────────────────────────────────────────
  const signOut = async () => {
    setError(null);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // ── RESET PASSWORD ──────────────────────────────────────────
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  // ── UPDATE PASSWORD ─────────────────────────────────────────
  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  // ── UPDATE PROFILE ──────────────────────────────────────────
  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'Not logged in' };
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    if (error) return { success: false, error: error.message };
    await loadProfile(user.id); // refresh local profile
    return { success: true };
  };

  return {
    user,           // raw Supabase auth user object
    profile,        // our profiles table row (with schools array)
    loading,        // true while auth state is being determined
    error,          // last error message
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    isAuthenticated: !!user,
    isTeacher:  profile?.role === 'teacher',
    isStudent:  profile?.role === 'student',
    isAdmin:    profile?.role === 'admin',
  };
}
