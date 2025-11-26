/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

type FormData = {
  name: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  role: string;
};

const RegisterForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
    role: 'tourist',
  });

  const [status, setStatus] = useState<{ type: string; msg: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    try {
      await axios.post('http://localhost:3000/auth/register', formData);
      setStatus({
        type: 'success',
        msg: '¡Registro exitoso! Ahora puedes iniciar sesión.',
      });
    } catch (error: any) {
      setStatus({
        type: 'danger',
        msg: error.response?.data?.message || 'Error al registrarse',
      });
    }
  };

  return (
    <Container className="mt-4 p-4 border rounded">
      <h3>Crear Cuenta</h3>

      {status && <Alert variant={status.type}>{status.msg}</Alert>}

      <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fecha de Nacimiento</Form.Label>
          <Form.Control
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rol</Form.Label>
          <Form.Select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="tourist">Turista</option>
            <option value="provider">Proveedor</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Registrarse
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterForm;
