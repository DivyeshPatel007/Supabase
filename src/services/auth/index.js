import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  'https://qtftvwxaeatuidfidhkm.supabase.co', 
   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZnR2d3hhZWF0dWlkZmlkaGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MjQ0ODgsImV4cCI6MjA1NzAwMDQ4OH0.QsTvOoKb61P7TtUk7L6dffjCrfwp3k--ETnc_MdAwlY');



export const signIn = async (email, password) => {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signUp = async (email, password, fullName) => {
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

export const fetchAuthUsers = async () => {
  const { data: users,error } = await supabaseClient.auth.admin.listUsers();

  return { users, error }
}


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




export const signInWithGoogle = async () => {
  return await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    }
  });
};