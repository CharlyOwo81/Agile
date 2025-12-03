// --- ESTE ARCHIVO ES EL PUNTO DE ENTRADA DE TU APP REACT (Frontend) ---

import React from 'react';
import MercadoPagoCheckout from './components/MercadoPagoCheckout'; // Importa el componente de checkout
import './App.css'; // Si usas estilos CSS

function App() {
  return (
    <div className="App" style={{ textAlign: 'center' }}>
      <p>Realiza tu pago de forma segura.</p>
      
      {/* Aquí renderizas el componente de Checkout que 
        contiene la lógica de llamada al servidor
      */}
      <MercadoPagoCheckout />
      
      <footer>
        <p></p>
      </footer>
    </div>
  );
}

export default App;