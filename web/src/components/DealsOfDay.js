import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DealsOfDay.css';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../hooks/useAuthActions';

const DealsOfDay = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { logout } = useAuthActions();

    const handleDealsClick = () => {
        navigate('/deals');
    };

    const handleWhatsNewClick = () => {
        navigate('/whats-new');
    };

    useEffect(() => {
        let isMounted = true;

        const fetchDeals = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/deals/ubisoft');
                if (isMounted) {
                    setDeals(response.data);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Error al cargar las ofertas');
                    console.error('Error:', err);
                    setLoading(false);
                }
            }
        };

        // Manejamos la promesa explícitamente
        fetchDeals().catch(err => {
            if (isMounted) {
                console.error('Error en useEffect:', err);
                setError('Error inesperado al cargar las ofertas');
                setLoading(false);
            }
        });

        // Cleanup function para evitar actualizaciones en componentes desmontados
        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) return <div>Cargando ofertas...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="layout-container">
            <aside className="sidebar">
                <div className="sidebar-icons">
                    <div className="icon-group">
                        <button className="sidebar-icon" onClick={() => navigate('/dashboard')}>
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
                        <button className="sidebar-icon">
                            <i className="fas fa-user"></i>
                        </button>
                        <button className="sidebar-icon" onClick={logout}>
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>
            </aside>
            <div className="deals-page">
                <div className="deals-container">
                    <h1>Ofertas del Día - Ubisoft</h1>
                    <div className="deals-grid">
                        {deals.map((/** @type {{ dealID: string; thumb: string; title: string; normalPrice: string; salePrice: string; savings: string; }} */ deal) => (
                            <div key={deal.dealID} className="deal-card">
                                <img src={deal.thumb} alt={deal.title} className="deal-image"/>
                                <div className="deal-info">
                                    <h3>{deal.title}</h3>
                                    <div className="deal-prices">
                                        <span className="normal-price">${deal.normalPrice}</span>
                                        <span className="sale-price">${deal.salePrice}</span>
                                        <span className="savings">-{Math.round(parseFloat(deal.savings))}%</span>
                                    </div>
                                    <button
                                        className="buy-button"
                                        onClick={() => window.open(`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`, "_blank")}
                                    >
                                        Comprar Ahora
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DealsOfDay;