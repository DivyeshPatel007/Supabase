import React, { useEffect } from 'react';
import LoginForm from '../components/auth/LoginForm';
import { signIn } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (payload) => {
    const { data, error } = await signIn(payload.email, payload.password);
    console.log({ data, error });

    if (data?.user) {
      navigate("/");
    }
  };

  return <LoginForm onSubmit={handleSubmit} />;
};

export default Login;
