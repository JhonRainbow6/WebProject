import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthActions } from '../hooks/useAuthActions';
import LoadingSpinner from './LoadingSpinner';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { loading, error } = useAuth();
    const { login } = useAuthActions();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData.email, formData.password);
    };

    const handleGoogleAuth = () => {
        // Redirige al usuario al endpoint de autenticación de Google en el backend
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <p>Welcome to</p>
                    <h1>C.A.P for Games</h1>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <div className="form-group">
                        <label>Enter your email address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Enter your Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Link to="/forgot-password" className="forgot-password">
                        Forgot Password
                    </Link>

                    <button type="submit" className="signin-button" disabled={loading}>
                        {loading ? 'Loading...' : 'Sign in'}
                    </button>

                    <button
                        type="button"
                        className="google-signin"
                        onClick={handleGoogleAuth}
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                             alt="Google"
                             style={{ width: '18px', height: '18px' }}
                        />
                        Sign in with Google
                    </button>
                </form>

                <div className="signup-link">
                    No Account?
                    <Link to="/register">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
