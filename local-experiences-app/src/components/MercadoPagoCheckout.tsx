import React, { useState, useMemo, useCallback } from 'react';
import { CardPayment, initMercadoPago } from '@mercadopago/sdk-react';

const PUBLIC_KEY = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY; 

interface OrderResponse {
    id: string;
    status: string;
    // ... otros campos
}

function MercadoPagoCheckout() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [orderId, setOrderId] = useState<string | null>(null);
    const [payerEmail, setPayerEmail] = useState(''); // Estado para el email
    
    const orderAmount = 1000.00; // Monto numérico
    const installments = 1;

    // Inicializa el SDK de Mercado Pago una sola vez
    useMemo(() => {
        if (PUBLIC_KEY !== "MERCADO_PAGO_PUBLIC_KEY") {
            initMercadoPago(PUBLIC_KEY);
        }
    }, []);

    // ----------------------------------------------------------------------
    // 💡 PASO 1: Lógica para enviar el token al Backend después de la tokenización
    // ----------------------------------------------------------------------

    const handlePaymentSubmit = useCallback(async (formData: any) => {
        setLoading(true);
        setMessage('');
        setOrderId(null);

        // El SDK de MP nos proporciona el card_token, que es lo único que enviamos al Backend
        const cardToken = formData.token; 
        
        // 1. Datos que enviarás a tu servidor (Backend)
        const orderData = {
            cardToken: cardToken, 
            payerEmail: payerEmail,
            totalAmount: orderAmount.toFixed(2), // Enviamos como string
        };

        try {
            // 2. Realizar la petición a tu endpoint de backend (Backend)
            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            const data: OrderResponse | { message: string, error: string } = await response.json();

            if (response.ok) {
                const orderData = data as OrderResponse;
                setMessage(`✅ Pago exitoso. ID de la Orden: ${orderData.id}. Estado: ${orderData.status}`);
                setOrderId(orderData.id);
            } else {
                const errorData = data as { message: string, error: string };
                // Manejar errores devueltos por tu servidor o por Mercado Pago
                setMessage(`❌ Error al crear la orden: ${errorData.message || errorData.error || 'Error desconocido del servidor.'}`);
                console.error("Error al crear la orden:", errorData);
            }

        } catch (error) {
            // Este catch maneja los errores de conexión (como el 404 o si el servidor está caído)
            setMessage(`❌ Error de conexión: ${(error as Error).message}. Asegúrate que el Backend esté corriendo.`);
            console.error("Error de conexión:", error);
        } finally {
            setLoading(false);
        }
    }, [orderAmount, payerEmail]);

    // ----------------------------------------------------------------------
    // 💡 PASO 2: Configuración del componente CardPayment del SDK
    // ----------------------------------------------------------------------
    const initialization = {
        amount: orderAmount,
        payer: {
            email: payerEmail,
        },
    };

    const onError = async (error: any) => {
        console.error(error);
        setMessage(`❌ Error de tokenización de tarjeta: ${error.message || 'Error desconocido'}`);
    };

    const onReady = () => {
        // El componente CardPayment está listo para interactuar
    };

    // Validación simple para mostrar el formulario de MP
    const canShowPayment = PUBLIC_KEY !== "MERCADO_PAGO_PUBLIC_KEY" && payerEmail.includes('@');

    if (PUBLIC_KEY === "MERCADO_PAGO_PUBLIC_KEY") {
        return (
            <div style={{ padding: '20px', border: '1px solid red', maxWidth: '400px', margin: '30px auto' }}>
                <h2>⚠️ Error de Configuración</h2>
                <p>Por favor, reemplaza **MERCADO_PAGO_PUBLIC_KEY** en `MercadoPagoCheckout.tsx` con tu clave pública real.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: '30px auto' }}>
            <h2>🛒 Resumen de Compra</h2>
            <p>Monto a Pagar: **${orderAmount.toFixed(2)}**</p>
            
            {/* ----------------- Formulario de Email ----------------- */}
            <div>
                <label htmlFor="payerEmail" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email del Pagador:</label>
                <input 
                    id="payerEmail"
                    type="email"
                    value={payerEmail}
                    onChange={(e) => setPayerEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    required
                    style={{ width: '90%', padding: '8px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            {/* ----------------- Componente de Pago de MP ----------------- */}
            {canShowPayment ? (
                <div style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
                    <CardPayment
                        initialization={initialization}
                        onSubmit={handlePaymentSubmit}
                        onReady={onReady}
                        onError={onError}
                        fields={{
                            cardholderName: { visibility: 'hidden' },
                            identificationType: { visibility: 'hidden' },
                            identificationNumber: { visibility: 'hidden' },
                        }}
                        customization={{
                            // Aquí puedes personalizar los estilos del formulario de tarjeta
                            visual: {
                                button: {
                                    button: `
                                        background-color: ${loading ? '#aaa' : '#009ee3'};
                                        color: white;
                                        padding: 10px 20px;
                                        font-size: 16px;
                                        border: none;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        width: 100%;
                                    `,
                                },
                            },
                        }}
                    />
                </div>
            ) : (
                <p style={{ color: 'gray' }}>Ingresa un email válido para mostrar el formulario de tarjeta.</p>
            )}

            {/* ----------------- Mensajes de Estado ----------------- */}
            {message && (
                <p style={{ marginTop: '15px', fontWeight: 'bold', color: message.startsWith('✅') ? 'green' : 'red' }}>
                    {message}
                </p>
            )}

            {orderId && (
                <p style={{ fontSize: '0.9em', color: '#555' }}>
                    ID de Transacción: **{orderId}**
                </p>
            )}
        </div>
    );
}

export default MercadoPagoCheckout;