/* eslint-disable no-debugger */
import React, { useEffect } from 'react';
import LoginForm from '../components/auth/LoginForm';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

const Login = () => {
  const { user,  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);



  return <LoginForm />;
};

export default Login;
