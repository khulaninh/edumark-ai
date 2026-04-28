// src/registerService.js
// ─────────────────────────────────────────────────────────────────
// SIMPLIFIED VERSION — fixes "Invalid path specified in request URL"
//
// Strategy: ONE Supabase call during registration (auth.signUp only).
// All user data is passed as metadata. The database trigger creates
// the profile automatically. No table inserts = no RLS/FK errors.
// ─────────────────────────────────────────────────────────────────

import { supabase } from "./supabaseClient.js";

// ─── REGISTER A NEW USER ─────────────────────────────────────────
export async function registerUser(userData) {

  if (!supabase) {
    return { success: false, error: "Supabase not configured. Check your .env file." };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email:    userData.email.trim().toLowerCase(),
      password: userData.password,
      options: {
        data: {
          role:         userData.role         || "student",
          fname:        (userData.fname        || "").trim(),
          lname:        (userData.lname        || "").trim(),
          phone:        userData.phone         || null,
          sace_number:  userData.sace          || null,
          grade:        userData.grade         || null,
          province:     userData.province      || null,
          district:     userData.district      || null,
          municipality: userData.municipality  || null,
          ward:         userData.ward          || null,
          schools_json: JSON.stringify(
            (userData.schools || []).map(s => ({
              id:   s.id   || "",
              name: s.name || "",
              type: s.type || "Public Secondary School",
            }))
          ),
        },
      },
    });

    if (error) {
      console.error("Registration raw error:", error);
      // Show the raw error message so it can be diagnosed
      const msg = error.message || JSON.stringify(error);
      return { success: false, error: msg };
    }

    if (!data?.user) {
      return { success: false, error: "Account creation failed. Please try again." };
    }

    const localProfile = {
      id:           data.user.id,
      email:        data.user.email,
      role:         userData.role,
      fname:        userData.fname,
      lname:        userData.lname,
      phone:        userData.phone        || null,
      sace:         userData.sace         || null,
      grade:        userData.grade        || null,
      province:     userData.province     || null,
      district:     userData.district     || null,
      municipality: userData.municipality || null,
      ward:         userData.ward         || null,
      schools:      userData.schools      || [],
      status:       "active",
      plan:         "Trial",
      submissions:  0,
    };

    return {
      success:              true,
      user:                 data.user,
      profile:              localProfile,
      emailConfirmRequired: !data.session,
    };

  } catch (err) {
    console.error("Unexpected registration error:", err);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}


// ─── LOGIN ────────────────────────────────────────────────────────
export async function loginUser(email, password) {
  if (!supabase) return { success: false, error: "Supabase not configured." };

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email:    email.trim().toLowerCase(),
      password,
    });

    if (error) return { success: false, error: friendlyError(error.message) };
    if (!data?.user) return { success: false, error: "Login failed. Please try again." };

    const profile = await loadProfile(data.user.id, data.user.email);
    return { success: true, user: data.user, profile };

  } catch (err) {
    return { success: false, error: "Login failed. Please try again." };
  }
}


// ─── LOAD PROFILE FROM DATABASE ──────────────────────────────────
export async function loadProfile(userId, email) {
  if (!supabase || !userId) return null;

  try {
    await wait(600);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      console.warn("Profile not found:", error?.message);
      return null;
    }

    let schools = [];
    try {
      if (data.schools_json) {
        schools = typeof data.schools_json === "string"
          ? JSON.parse(data.schools_json)
          : data.schools_json;
      }
    } catch (e) {
      schools = [];
    }

    return {
      ...data,
      id:      userId,
      email:   email || "",
      schools,
      submissions: 0,
    };

  } catch (err) {
    console.error("loadProfile error:", err);
    return null;
  }
}


// ─── SEARCH SCHOOLS FROM DATABASE ────────────────────────────────
export async function searchSchools(query) {
  if (!supabase || !query || query.length < 2) return [];

  try {
    const { data, error } = await supabase
      .from("schools")
      .select("id, name, type, province, district, municipality, ward")
      .or(`name.ilike.%${query}%,id.ilike.%${query}%`)
      .limit(6);

    if (error) { console.error("School search error:", error.message); return []; }
    return data || [];

  } catch (err) {
    return [];
  }
}


// ─── PASSWORD RESET ───────────────────────────────────────────────
export async function resetPassword(email) {
  if (!supabase) return { success: false, error: "Supabase not configured." };

  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    { redirectTo: window.location.origin }
  );
  if (error) return { success: false, error: error.message };
  return { success: true };
}


// ─── HELPERS ─────────────────────────────────────────────────────
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function friendlyError(message) {
  if (!message) return "Something went wrong. Please try again.";
  if (message.includes("already registered") || message.includes("already been registered"))
    return "An account with this email already exists. Please log in instead.";
  if (message.includes("Invalid login credentials"))
    return "Invalid email or password. Please check your credentials.";
  if (message.includes("Email not confirmed"))
    return "Please check your email and click the confirmation link, then try logging in.";
  if (message.includes("Password should be at least"))
    return "Password must be at least 8 characters long.";
  if (message.includes("Invalid path"))
    return "Registration service error. Please check your Supabase configuration.";
  return message;
}
