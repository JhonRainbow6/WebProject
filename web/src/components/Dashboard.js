import React from 'react';

const Dashboard = () => {
    const handleLogout = () => {
        // aqui lógica para cerrar sesión
        alert('Cerrando sesión...');
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <p>¡Bienvenido! Has iniciado sesión correctamente.</p>
            <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
    );
};

export default Dashboard;

