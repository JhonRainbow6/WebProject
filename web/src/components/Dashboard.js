import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthActions } from '../hooks/useAuthActions';
import LoadingSpinner from './LoadingSpinner';
import './Dashboard.css';
import BACK_URL from "../config/api";

const Dashboard = () => {
    const { user, loading, error } = useAuth();
    const { logout, fetchUserData } = useAuthActions();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    useEffect(() => {
        const loadUserData = async () => {
            try {
                await fetchUserData();
            } catch (error) {
                console.error("Error al cargar los datos del usuario:", error);
            }
        };
        loadUserData().catch(console.error);
    }, [fetchUserData]);

    const handleNavigation = (path) => {
        navigate(path);
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No se encontró información del usuario</div>;

    return (
        <div className="dashboard-container">
            <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <button className="toggle-sidebar" onClick={toggleSidebar}>
                    <i className="fas fa-chevron-left"></i>
                </button>
                <div className="sidebar-icons">
                    <div className="icon-group">
                        <button className={`sidebar-icon ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => handleNavigation('/dashboard')}>
                            <i className="fas fa-th"></i>
                        </button>
                        <button className={`sidebar-icon ${location.pathname === '/library' ? 'active' : ''}`} onClick={() => handleNavigation('/library')}>
                            <i className="fas fa-gamepad"></i>
                        </button>
                        <button className={`sidebar-icon ${location.pathname === '/deals' ? 'active' : ''}`} onClick={() => handleNavigation('/deals')}>
                            <i className="fas fa-shopping-cart"></i>
                        </button>
                        <button className={`sidebar-icon ${location.pathname === '/friends' ? 'active' : ''}`} onClick={() => handleNavigation('/friends')}>
                            <i className="fas fa-users"></i>
                        </button>
                        <button className={`sidebar-icon ${location.pathname === '/whats-new' ? 'active' : ''}`} onClick={() => handleNavigation('/whats-new')}>
                            <i className="fas fa-newspaper"></i>
                        </button>
                    </div>
                    <div className="icon-bottom">
                        <button className={`sidebar-icon ${location.pathname === '/profile' ? 'active' : ''}`} onClick={() => handleNavigation('/profile')}>
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
                    <div className="grid-item about-you" onClick={() => handleNavigation('/profile')} style={{ cursor: 'pointer' }}>
                        <h3>About You</h3>
                        <div className="user-info">
                            <div className="dashboard-profile-image">
                                <img
                                    src={user?.profileImage
                                        ? `${BACK_URL}${user.profileImage}`
                                        : 'https://via.placeholder.com/150'
                                    }
                                    alt="Foto de perfil"
                                />
                            </div>
                            <p>Bienvenido, {user.email}</p>
                        </div>
                    </div>
                    <div className="grid-item friends" onClick={() => handleNavigation('/friends')} style={{ cursor: 'pointer' }}>
                        <h3>Friends</h3>
                        <p>Gestiona y conecta con tus amigos en todas las plataformas</p>
                    </div>
                    <div className="grid-item whats-new" onClick={() => handleNavigation('/whats-new')} style={{ cursor: 'pointer' }}>
                        <h3>What's New?</h3>
                        <p>Ultimas novedades y actualizaciones relacionadas con Ubisoft.</p>
                    </div>
                    <div className="grid-item library" onClick={() => handleNavigation('/library')} style={{ cursor: 'pointer' }}>
                        <h3>CrossLibrary</h3>
                        <p>Accede a tu biblioteca de juegos en plataformas conectadas</p>
                    </div>
                    <div className="grid-item deals" onClick={() => handleNavigation('/deals')} style={{ cursor: 'pointer' }}>
                        <h3>Deals of the Day</h3>
                        <p>¡Descubre las ofertas especiales de UPlay el dia de hoy!</p>
                    </div>
                    <a href="https://store.ubisoft.com/us/ubisoftplus" target="_blank" rel="noopener noreferrer" className="grid-item ubisoft" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                        <h3>Ubisoft+</h3>
                        <p>¡Suscribete a U+ para obtener acceso a un amplio catalogo de juegos!</p>
                    </a>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;