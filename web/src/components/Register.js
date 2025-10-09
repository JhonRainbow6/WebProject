import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { loading, setLoading, error, setError } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Limpiar error cuando el usuario empieza a escribir
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);
            if (response.data.error === null) {
                // Registro exitoso
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error en el registro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <p>Create Account in</p>
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
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Create a Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="signin-button"
                        disabled={loading || !formData.email || !formData.password}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <button
                        type="button"
                        className="google-signin"
                        onClick={() => console.log('Google sign up clicked')}
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            style={{ width: '18px', height: '18px' }}
                        />
                        Sign up with Google
                    </button>
                </form>

                <div className="signup-link">
                    Already have an account?
                    <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
