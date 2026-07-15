import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { cart, orderType, customer } = JSON.parse(event.body);

    if (!cart || cart.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Warenkorb ist leer" }) };
    }

    const line_items = cart.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: { name: `${item.nr}. ${item.name}` },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    // Liefergebühr als eigene Position
    if (orderType === "delivery") {
      line_items.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Liefergebühr" },
          unit_amount: 200,
        },
        quantity: 1,
      });
    }

    const origin = event.headers.origin || `https://${event.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      customer_email: customer?.email,
      success_url: `${origin}/?bezahlt=1`,
      cancel_url: `${origin}/?abgebrochen=1`,
      metadata: {
        name: customer?.name || "",
        phone: customer?.phone || "",
        address: customer?.address || "",
        order_type: orderType,
        items: cart.map((i) => `${i.qty}x ${i.nr}. ${i.name}`).join(" | ").slice(0, 490),
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};cd