

import { createContext, useContext, useEffect, useState } from "react";
import { fetchUserRole, supabaseClient } from "../services/auth";


const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);




  useEffect(() => {
    const getInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabaseClient.auth.getSession();
        setUser(session?.user || null);

        if (session?.user) {
          const role = await fetchUserRole(session.user.id);
          setUserRole(role);
        }



      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, []);


  const hasPermission = (requiredRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!userRole) return false;

    return requiredRoles.includes(userRole);
  };
  console.log({userRole})

  // Authentication functions you might need

  console.log({ user })
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userRole,
        hasPermission,
        isAdmin: userRole === 'admin',
        isTeacher: userRole === 'teacher',
        isStudent: userRole === 'student',
        // signIn,
        // signUp,
        // signOut,
        // supabase // Optional: expose supabase client for direct access
      }}
    >
      {children}
    </AuthContext.Provider>
  )
};
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export default AuthProvider;