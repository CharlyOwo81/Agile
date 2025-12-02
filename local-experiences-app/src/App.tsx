// src/App.tsx
import { Container, Row, Col } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthTabs from './components/AuthTabs';
import './App.css';

function App() {
  return (
    <Container fluid className="App p-0">
      {/* Configuración global de las notificaciones */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Agregamos 'align-items-stretch' para que ambas columnas tengan la misma altura */}
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
  );
}

export default App;