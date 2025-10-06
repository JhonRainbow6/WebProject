import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../hooks/useAuthActions';
import './UserProfile.css';

const UserProfile = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { logout, changePassword } = useAuthActions(); // Importar changePassword

    const handleDealsClick = () => navigate('/deals');
    const handleWhatsNewClick = () => navigate('/whats-new');
    const handleProfileClick = () => navigate('/profile');
    const handleDashboardClick = () => navigate('/dashboard');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Las nuevas contraseñas no coinciden.');
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
        }
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-icons">
                    <div className="icon-group">
                        <button className="sidebar-icon" onClick={handleDashboardClick}>
                            <i className="fas fa-th"></i>
                        </button>
                        <button className="sidebar-icon">
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
            <main className="user-profile-main">
                <h3>Configuración de perfil</h3>
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
            </main>
        </div>
    );
};

export default UserProfile;
