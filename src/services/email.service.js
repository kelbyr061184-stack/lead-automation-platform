const { Resend } = require("resend")

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendLeadEmail(lead) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: lead.email,
    subject: "Gracias por tu interés 🚀",
    html: `
      <h2>Hola ${lead.name}</h2>
      <p>Recibimos tu información correctamente.</p>
      <p>Muy pronto te contactaremos.</p>
    `,
  })

  console.log("📧 Email sent to", lead.email)
}

module.exports = sendLeadEmail