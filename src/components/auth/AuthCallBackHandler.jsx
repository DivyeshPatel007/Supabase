import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';
import { supabaseClient } from '../../services/auth';
import { useAuth } from '../../contexts/AuthProvider';

const AuthCallbackHandler = () => {
  const navigate = useNavigate();
  const { setUserRole } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const { data, error } = await supabaseClient.auth.getSession();
        
        if (error) throw error;
        
        if (data?.session?.user) {
          const userId = data.session.user.id;
          

          const { data: userData, error: userError } = await supabaseClient
            .from('user_roles')
            .select('role')
            .eq('id', userId)
            .single();
          
          if (userError && userError.code !== 'PGRST116') { // this error means then the payload is very large
            throw userError;
          }
          
          if (!userData) {
            const { error: insertError } = await supabaseClient
              .from('user_roles')
              .insert([
                { id: userId, role: 'student' }
              ]);
              
            if (insertError) throw insertError;
            
            setUserRole('student');
          } else {
            setUserRole(userData.role);
          }
          
          navigate('/');
        }
      } catch (err) {
        console.error('Error handling OAuth callback:', err);
        setError(err.message || 'Failed to process authentication');
      }
    };

    handleOAuthCallback();
  }, [navigate, setUserRole]);

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Authentication Error
        </Typography>
        <Typography variant="body1">{error}</Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          <a href="/login" style={{ textDecoration: 'none' }}>Return to login</a>
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <CircularProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Completing sign in...
      </Typography>
    </Box>
  );
};

export default AuthCallbackHandler;