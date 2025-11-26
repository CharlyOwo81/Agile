/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import axios from "axios";

// 1. Definimos un tipo unión para cubrir todos los posibles inputs de Bootstrap
type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dateOfBirth: string;
  role: string;
}

interface StatusMsg {
  type: string;
  msg: string;
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    role: "tourist",
  });

  const [status, setStatus] = useState<StatusMsg | null>(null);

  // 2. Usamos el tipo FormControlElement en el evento
  const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    // Validación local antes de enviar
    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: "danger", msg: "Las contraseñas no coinciden." });
      return;
    }

    try {
      // Extraemos confirmPassword para no enviarlo a la API
      const { confirmPassword, ...payload } = formData;

      await axios.post("http://localhost:3000/auth/register", payload);

      setStatus({
        type: "success",
        msg: "¡Registro exitoso! Ahora puedes iniciar sesión.",
      });
    } catch (error: any) {
      setStatus({
        type: "danger",
        msg: error.response?.data?.message || "Error al registrarse",
      });
    }
  };

  return (
    <Container className="mt-4 p-4 border rounded" style={{ maxWidth: '500px' }}>
      <h3>Registro de Usuario</h3>
      <hr />
      
      {status && <Alert variant={status.type}>{status.msg}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre Completo</Form.Label>
          <Form.Control
            name="name"
            value={formData.name} // 3. Vinculamos el value al estado
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
          <Form.Label>Repetir Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            isInvalid={formData.confirmPassword !== "" && formData.password !== formData.confirmPassword}
          />
          <Form.Control.Feedback type="invalid">
            Las contraseñas no coinciden.
          </Form.Control.Feedback>
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
            required // Generalmente la fecha es requerida para lógica de negocio
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

        <Button type="submit" className="w-100" variant="primary">
          Registrarse
        </Button>
      </Form>
    </Container>
  );
}