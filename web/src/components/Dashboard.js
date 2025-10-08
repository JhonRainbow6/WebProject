import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthActions } from '../hooks/useAuthActions';
import LoadingSpinner from './LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
    const { user, loading, error } = useAuth();
    const { logout, fetchUserData } = useAuthActions();
    const navigate = useNavigate();

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

    const handleDealsClick = () => {
        navigate('/deals');
    };

    const handleWhatsNewClick = () => {
        navigate('/whats-new');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLibraryClick = () => {
        navigate('/library');
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No se encontró información del usuario</div>;

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-icons">
                    <div className="icon-group">
                        <button className="sidebar-icon">
                            <i className="fas fa-th"></i>
                        </button>
                        <button className="sidebar-icon" onClick={handleLibraryClick}>
                            <i className="fas fa-gamepad"></i>
                        </button>
                        <button className="sidebar-icon" onClick={handleDealsClick}>
                            <i className="fas fa-shopping-cart"></i>
                        </button>
                        <button className="sidebar-icon">
                            <i className="fas fa-users"></i>
                        </button>
                        <button className="sidebar-icon" onClick={handleWhatsNewClick}>
                            <i className="fas fa-newspaper"></i>
                        </button>
                    </div>
                    <div className="icon-bottom">
                        <button className="sidebar-icon" onClick={handleProfileClick}>
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
                    <div className="grid-item about-you" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                        <h3>About You</h3>
                        <div className="user-info">
                            <div className="dashboard-profile-image">
                                <img
                                    src={user?.profileImage
                                        ? `http://localhost:5000${user.profileImage}`
                                        : 'https://via.placeholder.com/150'
                                    }
                                    alt="Foto de perfil"
                                />
                            </div>
                            <p>Bienvenido, {user.email}</p>
                        </div>
                    </div>
                    <div className="grid-item friends">
                        <h3>Friends</h3>
                    </div>
                    <div className="grid-item whats-new" onClick={handleWhatsNewClick} style={{ cursor: 'pointer' }}>
                        <h3>What's New?</h3>
                        <p>Ultimas novedades y actualizaciones relacionadas con Ubisoft.</p>
                    </div>
                    <div className="grid-item library">
                        <h3>Library</h3>
                    </div>
                    <div className="grid-item deals" onClick={handleDealsClick} style={{ cursor: 'pointer' }}>
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