import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DealsOfDay.css';

const DealsOfDay = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        <div className="deals-page">
            <div className="deals-container">
                <h1>Ofertas del Día - Ubisoft</h1>
                <div className="deals-grid">
                    {deals.map((deal) => (
                        <div key={deal.dealID} className="deal-card">
                            <img src={deal.thumb} alt={deal.title} className="deal-image"/>
                            <div className="deal-info">
                                <h3>{deal.title}</h3>
                                <div className="deal-prices">
                                    <span className="normal-price">${deal.normalPrice}</span>
                                    <span className="sale-price">${deal.salePrice}</span>
                                    <span className="savings">-{Math.round(deal.savings)}%</span>
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
    );
};

export default DealsOfDay;