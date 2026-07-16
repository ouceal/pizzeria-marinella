import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

// الإيميلات اللي كتوصلهم الطلبية
const EMPFAENGER = [
  "rivonhermiz27@gmail.com",
  // ملي العميل يفعّل Epson Connect، زيد إيميل الطابعة هنا:
  // "xxxxxxx@print.epson.com",
];

const fmt = (cents) => (cents / 100).toFixed(2).replace(".", ",") + " €";

export const handler = async (event) => {
  const sig = event.headers["stripe-signature"];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type !== "checkout.session.completed") {
    return { statusCode: 200, body: "ignored" };
  }

  const session = stripeEvent.data.object;
  const m = session.metadata || {};

  const items = (m.items || "").split(" | ").join("\n");
  const typ = m.order_type === "delivery" ? "LIEFERUNG" : "ABHOLUNG";

  const text = `
================================
NEUE BESTELLUNG - ONLINE BEZAHLT
================================
Name: ${m.name || "-"}
Telefon: ${m.phone || "-"}
E-Mail: ${session.customer_email || "-"}
Typ: ${typ}
Adresse: ${m.address || "-"}
--------------------------------
BESTELLUNG:
${items}
--------------------------------
GESAMT: ${fmt(session.amount_total)}
Zahlung: KREDITKARTE (bezahlt)
================================
Bestell-ID: ${session.id.slice(-8)}
Zeit: ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}
================================
`.trim();

  try {
    await resend.emails.send({
      from: "Bestellung <bestellung@info.pizzeria-marinella.de>",
      to: EMPFAENGER,
      subject: `NEUE BESTELLUNG (bezahlt) - ${typ} - ${m.name || ""}`,
      text,
    });
  } catch (err) {
    // Stripe كيعاود يجرب إلا رجعنا 500
    return { statusCode: 500, body: `Email error: ${err.message}` };
  }

  return { statusCode: 200, body: "ok" };
};