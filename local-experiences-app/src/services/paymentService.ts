// --- ESTE ARCHIVO ESTÁ EN TU SERVIDOR (p.ej., Node.js con Express/NestJS) ---

import { MercadoPagoConfig, Order } from "mercadopago";

// ⚠️ Asegúrate de que esta variable de entorno esté configurada en tu servidor
const ACCESS_TOKEN = import.meta.env.MERCADO_PAGO_ACCESS_TOKEN; 

if (!ACCESS_TOKEN) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN no está definido en el entorno del servidor.");
}

const client = new MercadoPagoConfig({
	accessToken: ACCESS_TOKEN, 
	options: { timeout: 5000 },
});

const order = new Order(client);

// Define una interfaz para asegurar la estructura de los datos que recibes
interface OrderData {
    cardToken: string;
    payerEmail: string;
    totalAmount: string;
    // paymentMethodId: string; // Si deseas hacer esto dinámico
}

/**
 * Procesa la orden de pago llamando al SDK de Mercado Pago.
 * @param orderData Datos de la tarjeta tokenizada y del pago.
 * @returns Un objeto con el éxito y la respuesta de Mercado Pago.
 */
export async function createMercadoPagoOrder(orderData: OrderData) {
	try {
		const { cardToken, payerEmail, totalAmount } = orderData;
		
		const body = {
			type: "online",
			processing_mode: "automatic",
			total_amount: totalAmount,
			external_reference: "ext_ref_" + Date.now(),
			payer: {
				email: payerEmail,
			},
			transactions: {
				payments: [
					{
						amount: totalAmount,
						payment_method: {
							id: "master", // Tipo de tarjeta de ejemplo, se puede hacer dinámico
							type: "credit_card",
							token: cardToken, // El token SECURO recibido del frontend
							installments: 1,
							statement_descriptor: "Store name",
						},
					},
				],
			},
		};

		// Realizar la solicitud a la API de Mercado Pago
		const response = await order.create({ body });
		return { success: true, response };

	} catch (error) {
		console.error("Error de Mercado Pago:", error);
        // Devuelve un error para que el controlador lo maneje
		return { success: false, message: (error as Error).message || "Error al procesar el pago." };
	}
}

// Nota: En un proyecto real, necesitarías un controlador (p. ej., order.controller.ts)
// para exponer esta función como un endpoint HTTP (como /api/create-order).