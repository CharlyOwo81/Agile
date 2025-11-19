// src/App.tsx
import './App.css'
import { Container, Button } from 'react-bootstrap' // Importa los componentes

function App() {
  return (
    <Container className="mt-5">
      <h1>Plataforma de Experiencias Locales</h1>
      <p>¡Frontend listo con React y Bootstrap!</p>
      <Button variant="success">Empezar a Registrarse</Button>
    </Container>
  )
}

export default App
