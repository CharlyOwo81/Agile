// src/App.tsx
import { Container, Row, Col } from 'react-bootstrap';
import AuthTabs from './components/AuthTabs';
import './App.css';

function App() {
  return (
    <Container fluid className="App p-0"> 
      <Row className="g-0">
        
        <Col md={5} lg={6} className="d-none d-md-block p-0">
          <div className="auth-banner">
            <div className="banner-content">
              <h1>Bienvenido</h1>
              <p className="lead">
                Descubre y reserva experiencias locales únicas o comienza a ofrecer las tuyas.
              </p>
            </div>
          </div>
        </Col>

        {/* COLUMNA DERECHA: Formularios */}
        <Col xs={12} md={7} lg={6} className="auth-container-col">
          <div className="w-100" style={{ maxWidth: '500px' }}>
              <div className="text-center mb-4">
                 <h2 style={{ fontWeight: '700' }}>Plataforma de Experiencias</h2>
                 <p className="text-muted">Inicia sesión o regístrate para continuar</p>
              </div>
             {/* Aquí insertamos nuestro nuevo componente de pestañas */}
             <AuthTabs />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;