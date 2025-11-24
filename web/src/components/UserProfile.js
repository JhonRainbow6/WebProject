import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthActions } from '../hooks/useAuthActions';
import LoadingSpinner from './LoadingSpinner';
import './UserProfile.css';
import BACK_URL from "../config/api";

const UserProfile = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [imageError, setImageError] = useState('');
    const [imageSuccess, setImageSuccess] = useState('');
    const [activePlatforms, setActivePlatforms] = useState({
        steam: false,
        xbox: false,
        playstation: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuth();
    const { logout, changePassword, updateProfileImage } = useAuthActions();

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    // Efecto para mantener actualizado el estado de las plataformas
    useEffect(() => {
        if (user) {
            setActivePlatforms(prev => ({
                ...prev,
                steam: !!user.steamId // Convierte steamId a booleano
            }));
        }
    }, [user]);

    const handleLinkSteam = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No se encontró el token de autenticación');
            return;
        }
        window.location.href = `${BACK_URL}/api/steam/auth/steam?token=${token}`;
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validar el tipo de archivo
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            setImageError('Solo se permiten imágenes JPG, JPEG o PNG');
            return;
        }

        // Validar el tamaño del archivo (5MB máximo)
        if (file.size > 5 * 1024 * 1024) {
            setImageError('La imagen no debe superar los 5MB');
            return;
        }

        try {
            await updateProfileImage(file);
            setImageSuccess('Imagen de perfil actualizada correctamente');
            setImageError('');
        } catch (err) {
            setImageError(err.message || 'Error al actualizar la imagen de perfil');
            setImageSuccess('');
        }
    };

    const handleDealsClick = () => navigate('/deals');
    const handleWhatsNewClick = () => navigate('/whats-new');
    const handleProfileClick = () => navigate('/profile');
    const handleDashboardClick = () => navigate('/dashboard');
    const handleLibraryClick = () => navigate('/library');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (newPassword !== confirmPassword) {
            setError('Las nuevas contraseñas no coinciden.');
            setIsLoading(false);
            return;
        }
        setError('');
        setSuccess('');

        try {
            // Llamar a la función para cambiar la contraseña
            const data = await changePassword(currentPassword, newPassword);
            setSuccess(`${data.message} Cerrarándo sesion...`);
            // Limpiar los campos tras el éxito
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Se cerrara la sesión automáticamente después de 3 segundos
            setTimeout(() => {
                logout();
            }, 3000);
        } catch (err) {
            // Mostrar el mensaje de error del servidor
            setError(err.message || 'Ocurrió un error al cambiar la contraseña.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="dashboard-container">
            <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <button className="toggle-sidebar" onClick={toggleSidebar}>
                    <i className="fas fa-chevron-left"></i>
                </button>
                <div className="sidebar-icons">
                    <div className="icon-group">
                        <button className="sidebar-icon" onClick={handleDashboardClick}>
                            <i className="fas fa-th"></i>
                        </button>
                        <button className="sidebar-icon" onClick={handleLibraryClick}>
                            <i className="fas fa-gamepad"></i>
                        </button>
                        <button className="sidebar-icon" onClick={handleDealsClick}>
                            <i className="fas fa-shopping-cart"></i>
                        </button>
                        <button className="sidebar-icon" onClick={() => navigate('/friends')}>
                            <i className="fas fa-users"></i>
                        </button>
                        <button className="sidebar-icon" onClick={handleWhatsNewClick}>
                            <i className="fas fa-newspaper"></i>
                        </button>
                    </div>
                    <div className="icon-bottom">
                        <button className="sidebar-icon active" onClick={handleProfileClick}>
                            <i className="fas fa-user"></i>
                        </button>
                        <button className="sidebar-icon" onClick={logout}>
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>
            </aside>
            <main className="user-profile-main">
                <h3>Configuración de perfil</h3>
                <div className="profile-content">
                    <div className="user-info-box">
                        <h4>Información del Usuario</h4>
                        <div className="profile-image-container">
                            <div className="profile-image">
                                <img
                                    src={user?.profileImage
                                        ? `${BACK_URL}${user.profileImage}`
                                        : 'https://via.placeholder.com/150'
                                    }
                                    alt="Foto de perfil"
                                />
                                <label htmlFor="profile-image-input" className="image-upload-label">
                                    <i className="fas fa-camera"></i>
                                    <span>Cambiar foto</span>
                                </label>
                                <input
                                    type="file"
                                    id="profile-image-input"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            {imageError && <p className="error-message">{imageError}</p>}
                            {imageSuccess && <p className="success-message">{imageSuccess}</p>}
                        </div>
                        <p><strong>Email:</strong> {user?.email}</p>
                    </div>
                    <div className="profile-settings">
                        <h4>Cambiar Contraseña</h4>
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="current-password">Contraseña Actual</label>
                                <input
                                    type="password"
                                    id="current-password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="new-password">Nueva Contraseña</label>
                                <input
                                    type="password"
                                    id="new-password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm-password">Confirmar Nueva Contraseña</label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-submit">Guardar Cambios</button>
                        </form>
                    </div>
                </div>
                <div className="platforms-box">
                    <h4>Plataformas</h4>
                    <div className="platforms-grid">
                        <div className="platform-item">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/512px-Steam_icon_logo.svg.png"
                                alt="Steam"
                                className={`platform-icon ${activePlatforms.steam ? 'active' : ''}`}
                                style={{ cursor: 'default' }}
                                title={activePlatforms.steam ? 'Cuenta de Steam vinculada' : 'Vincular cuenta de Steam'}
                            />
                            <button
                                className={`platform-link-button ${activePlatforms.steam ? 'active' : ''}`}
                                onClick={() => !activePlatforms.steam && handleLinkSteam()}
                                style={{ cursor: activePlatforms.steam ? 'default' : 'pointer' }}
                            >
                                {activePlatforms.steam ? 'Vinculado' : 'Vincular Steam'}
                            </button>
                        </div>
                        <div className="platform-item">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/512px-Xbox_one_logo.svg.png"
                                alt="Xbox"
                                className="platform-icon"
                                style={{ cursor: 'default' }}
                                title="Vinculación de Xbox próximamente"
                            />
                            <button className="platform-link-button coming-soon" disabled>
                                Vincular Xbox
                            </button>
                        </div>
                        <div className="platform-item">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Playstation_logo_colour.svg/512px-Playstation_logo_colour.svg.png"
                                alt="PlayStation"
                                className="platform-icon"
                                style={{ cursor: 'default' }}
                                title="Vinculación de PlayStation próximamente"
                            />
                            <button className="platform-link-button coming-soon" disabled>
                                Vincular PlayStation
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;