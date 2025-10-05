import React, { useState, useEffect } from 'react';
import './WhatsNew.css';

const WhatsNew = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Llamamos a nuestro propio endpoint que ahora filtra solo noticias de Ubisoft
                const response = await fetch('http://localhost:5000/api/news/gaming');

                if (!response.ok) {
                    throw new Error('No se pudieron cargar las noticias de Ubisoft');
                }

                const data = await response.json();

                // Verificamos que tengamos artículos para mostrar
                if (data.articles && data.articles.length > 0) {
                    setNews(data.articles);
                } else {
                    throw new Error('No se encontraron artículos de Ubisoft');
                }
            } catch (err) {
                setError(err.message);
                console.error('Error al obtener noticias de Ubisoft:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) return <div className="loading-container">Cargando noticias de Ubisoft...</div>;
    if (error) return <div className="error-container">Error: {error}</div>;

    return (
        <div className="whats-new-container">
            <header className="whats-new-header">
                <h1>Noticias de Ubisoft</h1>
                <p>Mantente al día con las últimas novedades de Ubisoft y sus juegos</p>
            </header>

            <div className="news-grid">
                {news.map((article, index) => (
                    <div className="news-card" key={index} onClick={() => window.open(article.url, '_blank')}>
                        {article.urlToImage && (
                            <div className="news-image">
                                <img src={article.urlToImage} alt={article.title} />
                            </div>
                        )}
                        <div className="news-content">
                            <h3>{article.title}</h3>
                            <div className="news-meta">
                                <span>Fuente: {article.source.name}</span>
                                <span>Fecha: {new Date(article.publishedAt).toLocaleDateString('es-ES')}</span>
                            </div>
                            <p className="news-excerpt">
                                {article.description ?
                                    (article.description.length > 150 ?
                                        `${article.description.substring(0, 150)}...` :
                                        article.description) :
                                    'Haz clic para leer más sobre esta noticia de Ubisoft.'}
                            </p>
                            <div className="news-tags">
                                <span className="tag">Ubisoft</span>
                                {article.author && <span className="tag">Por: {article.author}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {news.length === 0 && !loading && !error && (
                <div className="no-news-message">
                    <p>No hay noticias recientes de Ubisoft disponibles en este momento.</p>
                </div>
            )}
        </div>
    );
};

export default WhatsNew;
