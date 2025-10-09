import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';
import './Library.css';

const Library = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = async () => {
            if (!user?.steamId) {
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/steam/games`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                });
                setGames(response.data.games || []);
            } catch (err) {
                setError('Error al cargar los juegos');
                console.error('Error fetching games:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGames().catch(err => {
            console.error('Error al ejecutar fetchGames:', err);
            setError('Ha ocurrido un error inesperado');
            setLoading(false);
        });
    }, [user]);

    const handleDealsClick = () => navigate('/deals');
    const handleWhatsNewClick = () => navigate('/whats-new');
    const handleProfileClick = () => navigate('/profile');
    const handleDashboardClick = () => navigate('/dashboard');

    const formatPlaytime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        if (hours < 1) return 'Menos de 1 hora';
        return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    };

    if (loading) {
        return (
            <div className="library-container">
                <aside className="sidebar">
                    <div className="sidebar-icons">
                        <div className="icon-group">
                            <button className="sidebar-icon" onClick={handleDashboardClick}>
                                <i className="fas fa-th"></i>
                            </button>
                            <button className="sidebar-icon active">
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
                            <button className="sidebar-icon" onClick={handleProfileClick}>
                                <i className="fas fa-user"></i>
                            </button>
                            <button className="sidebar-icon" onClick={() => navigate('/login')}>
                                <i className="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                </aside>
                <main className="library-main">
                    <div className="loading-container">
                        <LoadingSpinner />
                    </div>
                </main>
            </div>
        );
    }

    if (!user?.steamId) {
        return (
            <div className="library-container">
                <aside className="sidebar">
                    <div className="sidebar-icons">
                        <div className="icon-group">
                            <button className="sidebar-icon" onClick={handleDashboardClick}>
                                <i className="fas fa-th"></i>
                            </button>
                            <button className="sidebar-icon active">
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
                            <button className="sidebar-icon" onClick={handleProfileClick}>
                                <i className="fas fa-user"></i>
                            </button>
                            <button className="sidebar-icon" onClick={() => navigate('/login')}>
                                <i className="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                </aside>
                <main className="library-main">
                    <div className="no-steam-linked">
                        <h2>Cuenta de Steam no vinculada</h2>
                        <p>Para ver tu biblioteca de juegos, necesitas vincular tu cuenta de Steam.</p>
                        <button
                            className="link-steam-button"
                            onClick={() => navigate('/profile')}
                        >
                            Ir a vincular Steam
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="library-container">
            <aside className="sidebar">
                <div className="sidebar-icons">
                    <div className="icon-group">
                        <button className="sidebar-icon" onClick={handleDashboardClick}>
                            <i className="fas fa-th"></i>
                        </button>
                        <button className="sidebar-icon active">
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
                        <button className="sidebar-icon" onClick={handleProfileClick}>
                            <i className="fas fa-user"></i>
                        </button>
                        <button className="sidebar-icon" onClick={() => navigate('/login')}>
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>
            </aside>
            <main className="library-main">
                <div className="library-header">
                    <h2>CrossLibrary</h2>
                    {error && <p className="error-message">{error}</p>}
                </div>
                {games.length === 0 ? (
                    <div className="no-games">
                        <h3>No se encontraron juegos</h3>
                        <p>No tienes juegos en tu biblioteca de Steam.</p>
                    </div>
                ) : (
                    <div className="games-grid">
                        {games.map(game => (
                            <div key={game.appid} className="game-card">
                                <img
                                    src={game.img_header}
                                    alt={game.name}
                                    className="game-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
                                    }}
                                />
                                <div className="game-info">
                                    <h3 className="game-title">{game.name}</h3>
                                    <div className="game-stats">
                                        <p className="game-playtime">
                                            <i className="fas fa-clock"></i> {formatPlaytime(game.playtime_forever)}
                                        </p>
                                        {game.achievements.total > 0 && (
                                            <p className="game-achievements">
                                                <i className="fas fa-trophy"></i> {game.achievements.completed}/{game.achievements.total}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="platform-watermark steam"></div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Library;