/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/auth/login', formData);
      localStorage.setItem('token', res.data.access_token);
      // Aquí idealmente redirigirías al usuario al dashboard
      alert(`Bienvenido de nuevo, ${res.data.user.name}!`);
    } catch (err: any) {
      setError('Credenciales incorrectas. Por favor verifica tu email y contraseña.');
    }
  };

  // Eliminamos <Container> y <h3>
  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" onChange={handleChange} required placeholder="nombre@ejemplo.com" className="py-2" />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" name="password" onChange={handleChange} required placeholder="Ingresa tu contraseña" className="py-2"/>
        </Form.Group>

        {/* Enlace de "Olvidé mi contraseña" según el diseño */}
        <div className="d-flex justify-content-end mb-4">
            <a href="#" className="text-decoration-none" style={{ fontSize: '0.9rem' }}>¿Olvidaste tu contraseña?</a>
        </div>

        <Button variant="primary" type="submit" className="w-100 py-2" style={{ fontWeight: '600', fontSize: '1.1rem' }}>
          Iniciar Sesión
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;