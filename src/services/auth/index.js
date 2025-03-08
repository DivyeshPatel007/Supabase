import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient('https://izeqjblmcupsqxaxcblm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6ZXFqYmxtY3Vwc3F4YXhjYmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNTgyMTIsImV4cCI6MjA1NjkzNDIxMn0.Z1RyFqg8Lcm5UX6TByPkaTPVXKA7fCtx81k0771MMCI');



export const signIn = async (email, password) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    return { data, error };
};

export const signUp = async (email, password,fullName) => {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
};

export const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    return { error };
};


export const fetchUserRole = async (userId) => {
    if (!userId) return null;

    const { data, error } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user role:", error);
      return null;
    }

    return data?.role || null;
  };