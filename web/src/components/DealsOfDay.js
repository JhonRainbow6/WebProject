import React from 'react';
import './DealsOfDay.css';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../hooks/useAuthActions';
import LoadingSpinner from './LoadingSpinner';
import useFetch from '../hooks/useFetch';

const DealsOfDay = () => {
    const { data: deals, loading, error } = useFetch('http://localhost:5000/api/deals/ubisoft');
    const navigate = useNavigate();
    const { logout } = useAuthActions();

    const handleLibraryClick = () => {
        navigate('/library');
    }
    const handleDealsClick = () => {
        navigate('/deals');
    };

    const handleWhatsNewClick = () => {
        navigate('/whats-new');
    };
    const handleProfileClick = () => {
        navigate('/profile');
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div>{error}</div>;

    return (
        <div className="layout-container">
            <aside className="sidebar">
                <div className="sidebar-icons">
                    <div className="icon-group">
                        <button className="sidebar-icon" onClick={() => navigate('/dashboard')}>
                            <i className="fas fa-th"></i>
                        </button>
                        <button className="sidebar-icon" onClick={handleLibraryClick} >
                            <i className="fas fa-gamepad"> </i>
                        </button>
                        <button className="sidebar-icon active" onClick={handleDealsClick}>
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
                        <button className="sidebar-icon" onClick={logout}>
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>
            </aside>
            <div className="deals-page">
                <div className="deals-container">
                    <h1>Deals of the Day - UPlay</h1>
                    <div className="deals-grid">
                        {deals && deals.map((/** @type {{ dealID: string; thumb: string; title: string; normalPrice: string; salePrice: string; savings: string; }} */ deal) => (
                            <div key={deal.dealID} className="deal-card">
                                <img src={deal.thumb} alt={deal.title} className="deal-image"/>
                                <div className="deal-info">
                                    <h3>{deal.title}</h3>
                                    <div className="deal-prices">
                                        {parseFloat(deal.savings) > 0 ? (
                                            <>
                                                <span className="normal-price">${deal.normalPrice}</span>
                                                <span className="sale-price">${deal.salePrice}</span>
                                                <span className="savings">-{Math.round(parseFloat(deal.savings))}%</span>
                                            </>
                                        ) : (
                                            <span className="sale-price">${deal.normalPrice}</span>
                                        )}
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