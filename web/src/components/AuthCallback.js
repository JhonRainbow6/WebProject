import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthActions } from '../hooks/useAuthActions';
import LoadingSpinner from './LoadingSpinner';

const AuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fetchUserData } = useAuthActions();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // Guardar el token en localStorage
            localStorage.setItem('token', token);

            // Obtener los datos del usuario y luego redirigir al dashboard
            fetchUserData().then(() => {
                navigate('/dashboard');
            });
        } else {
            // Si no hay token, redirigir al login con un mensaje de error
            navigate('/login?error=auth_failed');
        }
    }, [location, navigate, fetchUserData]);

    // Muestra un spinner mientras se procesa la autenticación
    return <LoadingSpinner />;
};

export default AuthCallback;
