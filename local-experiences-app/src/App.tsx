// src/App.tsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Button } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthTabs from './components/AuthTabs';
import { ExperienceManagement } from './components/ExperienceManagement';
import './App.css';

function App() {
  // 1. Estado para guardar el token
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // 2. Efecto para detectar cuando el usuario inicia sesión (cambia el localStorage)
  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem('token');
      if (currentToken !== token) {
        setToken(currentToken);
      }
    };

    // Revisamos cada segundo si hay un token nuevo (forma sencilla de detectar el login)
    const interval = setInterval(checkToken, 500);

    return () => clearInterval(interval);
  }, [token]);

  // 3. Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
  };

  return (
    <div className="App">
      {/* Configuración global de notificaciones */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* RENDERIZADO CONDICIONAL */}
      {token ? (
        // CASO A: Usuario Logueado -> Mostrar Panel
        <>
          <Navbar bg="dark" variant="dark" className="px-4 justify-content-between mb-4">
            <Navbar.Brand>Panel de Proveedor</Navbar.Brand>
            <div className="d-flex align-items-center gap-3">
              <span className="text-light d-none d-md-block">Bienvenido</span>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </Navbar>
          
          {/* Aquí se carga el componente de la HU002 */}
          <ExperienceManagement />
        </>
      ) : (
        // CASO B: No hay token -> Mostrar Login/Registro (Tu diseño anterior)
        <Container fluid className="p-0">
          <Row className="g-0 align-items-stretch"> 
            <Col md={5} lg={6} className="d-none d-md-block p-0">
              <div className="auth-banner">
                <div className="banner-content">
                  <h1>Bienvenido</h1>
                  <p className="lead">
                    Descubre y reserva experiencias locales únicas.
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} md={7} lg={6} className="auth-container-col">
              <div className="w-100" style={{ maxWidth: '500px' }}>
                  <div className="text-center mb-4">
                     <h2 style={{ fontWeight: '700' }}>Plataforma de Experiencias</h2>
                     <p className="text-muted">Inicia sesión o regístrate para continuar</p>
                  </div>
                 <AuthTabs />
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}

export default App;