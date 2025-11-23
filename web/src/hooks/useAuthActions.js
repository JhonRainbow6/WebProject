import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import BACK_URL from "../config/api";

export const useAuthActions = () => {
    const { setUser, setLoading, setError } = useAuth();
    const navigate = useNavigate();

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(`${BACK_URL}/api/auth/login`, {
                email,
                password
            });

            if (res.data.data && res.data.data.token) {
                localStorage.setItem('token', res.data.data.token);
                await fetchUserData();
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error al iniciar sesión');
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const logout = useCallback(() => {
        setLoading(true);
        try {
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        } catch (error) {
            setError('Error al cerrar sesión');
        } finally {
            setLoading(false);
        }
    }, [navigate, setUser, setError, setLoading]);

    const fetchUserData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get(`${BACK_URL}/api/auth/user` , {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });

            if (res.data && res.data.data && res.data.data.user) {
                setUser(res.data.data.user);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error al obtener datos del usuario');
            localStorage.removeItem('token');
            navigate('/login');
        } finally {
            setLoading(false);
        }
    }, [navigate, setUser, setError, setLoading]);

    const changePassword = async (currentPassword, newPassword) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No autenticado');
        }

        try {
            const res = await axios.post(`${BACK_URL}/api/auth/change-password` , {
                currentPassword,
                newPassword
            }, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });
            return res.data;
        } catch (err) {
            throw new Error(err.response?.data?.error || 'Error al cambiar la contraseña');
        }
    };

    const updateProfileImage = async (file) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No autenticado');
        }

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const response = await axios.post(
                `${BACK_URL}/api/auth/update-profile-image` ,
                formData,
                {
                    headers: {
                        'x-auth-token': token,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data && response.data.data && response.data.data.user) {
                setUser(response.data.data.user);
                return response.data;
            }
        } catch (err) {
            throw new Error(err.response?.data?.error || 'Error al actualizar la imagen de perfil');
        }
    };

    return {
        login,
        logout,
        fetchUserData,
        changePassword,
        updateProfileImage
    };
};
