import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAuthActions } from '../hooks/useAuthActions';

const Dashboard = () => {
    const { user, loading, error } = useAuth();
    const { logout, fetchUserData } = useAuthActions();

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>No se encontró información del usuario</div>;
    }

    return (
        <div>
            <h2>Dashboard</h2>
            <p>¡Bienvenido, {user.email}!</p>
            <div>
                <button onClick={logout}>Cerrar Sesión</button>
            </div>
        </div>
    );
};

export default Dashboard;
