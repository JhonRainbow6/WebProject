import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../hooks/useAuthActions';
import LoadingSpinner from './LoadingSpinner';
import './WhatsNew.css';
import useFetch from '../hooks/useFetch';

/**
 * @typedef {Object} Article
 * @property {string} title - Título del artículo
 * @property {string} [description] - Descripción del artículo (opcional)
 * @property {string} url - URL del artículo original
 * @property {string} [urlToImage] - URL de la imagen del artículo (opcional)
 * @property {string} publishedAt - Fecha de publicación
 * @property {Object} source - Fuente del artículo
 * @property {string} source.name - Nombre de la fuente
 * @property {string} [author] - Autor del artículo (opcional)
 */

const WhatsNew = () => {
    const { data: newsData, loading, error } = useFetch('http://localhost:5000/api/news/gaming');
    const navigate = useNavigate();
    const { logout } = useAuthActions();

    // Lista de fuentes a excluir
    const excludedSources = ["Generación Xbox"];

    // Filtracion de fuentes excluidas y artículos con datos incompletos
    const news = newsData?.articles?.filter(article =>
        article &&
        article.source &&
        article.source.name &&
        !excludedSources.includes(article.source.name)
    ) || [];

    // Funciones de navegación
    const handleDashboardClick = () => {
        navigate('/dashboard');
    };

    const handleLibraryClick = () => {
        navigate('/library');
    }
    const handleDealsClick = () => {
        navigate('/deals');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error-container">Error: {error}</div>;

    return (
        <div className="layout-container">
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
                        <button className="sidebar-icon" onClick={() => navigate('/friends')}>
                            <i className="fas fa-users"></i>
                        </button>
                        <button className="sidebar-icon active">
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
            <div className="whats-new-page">
                <div className="whats-new-container">
                    <header className="whats-new-header">
                        <h1>What's New?</h1>
                        <p>Mantente al día con las últimas novedades relacionadas con Ubisoft</p>
                    </header>

                    <div className="news-grid">
                        {news.map((article, index) => (
                            <div className="news-card" key={index} onClick={() => window.open(article.url, '_blank')}>
                                {article && article.urlToImage && (
                                    <div className="news-image">
                                        <img src={article.urlToImage} alt={(article && article.title) || 'Noticia de Ubisoft'} />
                                    </div>
                                )}
                                <div className="news-content">
                                    <h3>{(article && article.title) || 'Noticia de Ubisoft'}</h3>
                                    <div className="news-meta">
                                        <span>Fecha: {article && article.publishedAt ?
                                            new Date(article.publishedAt).toLocaleDateString('es-ES') :
                                            'Fecha desconocida'}</span>
                                    </div>
                                    <p className="news-excerpt">
                                        {article && article.description ?
                                            (article.description.length > 150 ?
                                                `${article.description.substring(0, 150)}...` :
                                                article.description) :
                                            'Haz clic para leer más sobre esta noticia de Ubisoft.'}
                                    </p>
                                    <div className="news-tags">
                                        <span className="tag">Ubisoft</span>
                                        {article && article.author && <span className="tag">Por: {article.author}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {news.length === 0 && !loading && !error && (
                        <div className="no-news-message">
                            <p></p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WhatsNew;