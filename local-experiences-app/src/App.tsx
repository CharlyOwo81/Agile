// src/App.tsx
import { Container, Row, Col } from 'react-bootstrap';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import './App.css';

function App() {
  return (
    <Container>
      <h1 className="text-center my-5">Plataforma de Experiencias Locales</h1>
      <Row>
        <Col md={6}>
          <RegisterForm />
        </Col>
        <Col md={6}>
          <LoginForm />
        </Col>
      </Row>
    </Container>
  );
}

export default App;