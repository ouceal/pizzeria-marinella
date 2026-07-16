import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMPFAENGER = [
  "rivonhermiz27@gmail.com",
  // ملي العميل يفعّل Epson Connect: "xxxxxxx@print.epson.com",
];

const fmt = (n) => n.toFixed(2).replace(".", ",") + " €";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const zeit = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });

    let subject, text;

    if (data.kind === "reservation") {
      const r = data.form;
      subject = `NEUE RESERVIERUNG - ${r.date} ${r.time} - ${r.name}`;
      text = `
================================
NEUE RESERVIERUNG
================================
Name: ${r.name}
Telefon: ${r.phone}
E-Mail: ${r.email}
--------------------------------
Datum: ${r.date}
Uhrzeit: ${r.time}
Anzahl Gäste: ${r.guests}
================================
Eingegangen: ${zeit}
================================`.trim();
    } else {
      const { cart, form, orderType, subtotal, discount, deliveryFee, total } = data;
      const typ = orderType === "delivery" ? "LIEFERUNG" : "ABHOLUNG";
      const items = cart.map((i) => `${i.qty}x  ${i.nr}. ${i.name}`).join("\n");

      subject = `NEUE BESTELLUNG (BAR) - ${typ} - ${form.name}`;
      text = `
================================
NEUE BESTELLUNG - BARZAHLUNG
================================
Name: ${form.name}
Telefon: ${form.phone}
E-Mail: ${form.email}
Typ: ${typ}
Adresse: ${form.address || "-"}
--------------------------------
BESTELLUNG:
${items}
--------------------------------
Zwischensumme: ${fmt(subtotal)}
Bar-Rabatt (10%): -${fmt(discount)}
${deliveryFee > 0 ? `Liefergebühr: ${fmt(deliveryFee)}` : ""}
GESAMT (bar): ${fmt(total)}
================================
Eingegangen: ${zeit}
================================`.trim();
    }

    await resend.emails.send({
      from: "Bestellung <bestellung@info.pizzeria-marinella.de>",
      to: EMPFAENGER,
      replyTo: data.form?.email,
      subject,
      text,
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};