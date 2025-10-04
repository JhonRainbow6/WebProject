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
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-icons">
                    <div className="icon-group">
                        <button className="sidebar-icon">
                            <i className="fas fa-th"></i>
                        </button>
                        <button className="sidebar-icon">
                            <i className="fas fa-gamepad"></i>
                        </button>
                        <button className="sidebar-icon">
                            <i className="fas fa-shopping-cart"></i>
                        </button>
                        <button className="sidebar-icon">
                            <i className="fas fa-users"></i>
                        </button>
                        <button className="sidebar-icon">
                            <i className="fas fa-desktop"></i>
                        </button>
                    </div>
                    <div className="icon-bottom">
                        <button className="sidebar-icon">
                            <i className="fas fa-user"></i>
                        </button>
                        <button className="sidebar-icon" onClick={logout}>
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>
            </aside>
            <main className="dashboard-main">
                <div className="dashboard-grid">
                    <div className="grid-item about-you">
                        <h3>About You</h3>
                        <div className="user-info">
                            <p>Bienvenido, {user.email}</p>
                        </div>
                    </div>
                    <div className="grid-item friends">
                        <h3>Friends</h3>
                    </div>
                    <div className="grid-item whats-new">
                        <h3>What's New?</h3>
                    </div>
                    <div className="grid-item library">
                        <h3>Library</h3>
                    </div>
                    <div className="grid-item deals">
                        <h3>Deals of the day</h3>
                    </div>
                    <div className="grid-item ubisoft">
                        <h3>Ubisoft+</h3>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
