import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
    });

    const { nombre, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            console.log(res.data); // Recibir token
            // Guardar token y redirigir
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <input type="text" name="nombre" value={nombre} onChange={onChange} placeholder="Nombre" required />
            <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
            <input type="password" name="password" value={password} onChange={onChange} placeholder="Contraseña" required />
            <button type="submit">Registrarse</button>
        </form>
    );
};

export default Register;