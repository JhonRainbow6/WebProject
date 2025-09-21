import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const { name, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            console.log(res.data); // Proceso de registro exitoso
            setError(''); // Limpia errores si el registro es exitoso
            // Guardar el token y redirigir, o muestra el mensaje de éxito
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || 'Ocurrió un error en el registro');
            } else {
                setError('No se pudo conectar con el servidor.');
            }
        }
    };

    return (
        <form onSubmit={onSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input type="text" name="name" value={name} onChange={onChange} placeholder="Nombre" required />
            <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
            <input type="password" name="password" value={password} onChange={onChange} placeholder="Contraseña" required />
            <button type="submit">Registrarse</button>
        </form>
    );
};

export default Register;
