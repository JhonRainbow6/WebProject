import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthActions } from '../hooks/useAuthActions';
import LoadingSpinner from './LoadingSpinner';
import './Friends.css';
import BACK_URL from "../config/api";

const Friends = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasSteamLinked, setHasSteamLinked] = useState(true);
    const { logout } = useAuthActions();
    const navigate = useNavigate();

    useEffect(() => {
        // Usando IIFE (Immediately Invoked Function Expression) para manejar async correctamente
        (async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No hay sesión iniciada');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${BACK_URL}/api/steam/friends`, {
                    headers: {
                        'x-auth-token': token,
                        'Content-Type': 'application/json'
                    }
                });

                setFriends(response.data.friends || []);
                setLoading(false);
            } catch (err) {
                console.error('Error al cargar amigos:', err);

                // Manejo específico según el tipo de error
                if (err.response) {
                    // El servidor respondió con un código de error
                    if (err.response.status === 400 && err.response.data?.error?.includes('Steam')) {
                        setHasSteamLinked(false);
                    } else if (err.response.status === 403) {
                        setError('Tu perfil de Steam o tu lista de amigos es privada. Cambia la configuración de privacidad en Steam.');
                    } else if (err.response.status === 502) {
                        setError('No se pudo contactar con Steam. Intenta de nuevo más tarde.');
                    } else {
                        setError(`Error al cargar la lista de amigos: ${err.response.data?.error || err.message}`);
                    }
                } else if (err.request) {
                    // No se recibió respuesta del servidor
                    setError('No se pudo conectar con el servidor. Verifica tu conexión a Internet.');
                } else {
                    // Error en la configuración de la solicitud
                    setError('Error al preparar la solicitud de amigos.');
                }

                setLoading(false);
            }
        })().catch(err => {
            // Capturar cualquier error no manejado en la función anónima async
            console.error('Error no manejado en fetchFriends:', err);
            setError('Ocurrió un error inesperado');
            setLoading(false);
        });
    }, []);

    // Navegación
    const handleDashboardClick = () => navigate('/dashboard');
    const handleLibraryClick = () => navigate('/library');
    const handleDealsClick = () => navigate('/deals');
    const handleFriendsClick = () => navigate('/friends');
    const handleWhatsNewClick = () => navigate('/whats-new');
    const handleProfileClick = () => navigate('/profile');

    // Función para mostrar el estado del usuario de forma legible
    const getStatusText = (status) => {
        const statuses = {
            0: 'Desconectado',
            1: 'En línea',
            2: 'Ocupado',
            3: 'Ausente',
            4: 'Durmiendo',
            5: 'Buscando intercambio',
            6: 'Buscando jugar'
        };
        return statuses[status] || 'Desconocido';
    };

    // Función para formatear la fecha de última conexión
    const formatLastOnline = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp * 1000);
        return date.toLocaleString('es-ES');
    };

    if (loading) return <LoadingSpinner />;

    const renderContent = () => {
        if (!hasSteamLinked) {
            return (
                <div className="friends-content no-steam">
                    <h2>Friends</h2>
                    <p>Necesitas vincular una cuenta de Steam/PlayStation/Xbox para ver tus amigos.</p>
                    <button
                        className="link-steam-button"
                        onClick={() => {
                            const token = localStorage.getItem('token');
                            window.location.href = `${BACK_URL}/api/steam/auth/steam?token=${token}`;
                        }}
                    >
                        Vincular cuentas
                    </button>
                </div>
            );
        }

        if (error) {
            return (
                <div className="friends-content error">
                    <h2>Error al cargar amigos</h2>
                    <p className="friends-error">{error}</p>
                    <button
                        className="retry-button"
                        onClick={() => {
                            setLoading(true);
                            setError(null);
                            window.location.reload();
                        }}
                    >
                        Reintentar
                    </button>
                </div>
            );
        }

        return (
            <div className="friends-content">
                <h2>Amigos de Steam</h2>

                {friends.length === 0 ? (
                    <p>No se encontraron amigos</p>
                ) : (
                    <div className="friends-list">
                        {friends.map(friend => (
                            <div key={friend.steamId} className="friend-card">
                                <div className="friend-avatar">
                                    <img src={friend.avatar} alt={`${friend.name} avatar`} />
                                    <span className={`status-indicator status-${friend.status}`}></span>
                                </div>
                                <div className="friend-details">
                                    <h3>{friend.name}</h3>
                                    <p className="friend-status">Estado: {getStatusText(friend.status)}</p>
                                    {friend.status === 0 && (
                                        <p className="last-online">Última vez: {formatLastOnline(friend.lastOnline)}</p>
                                    )}
                                </div>
                                <div className="friend-actions">
                                    <a
                                        href={friend.profileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="view-profile-button"
                                    >
                                        Ver Perfil
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
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
                        <button className="sidebar-icon active" onClick={handleFriendsClick}>
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
            <main className="friends-main">
                {renderContent()}
            </main>
        </div>
    );
};

export default Friends;
