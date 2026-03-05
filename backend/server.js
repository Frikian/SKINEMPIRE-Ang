const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/api/contacto', async (req, res) => {
  const { nombre, email, motivo, mensaje } = req.body;

  if (!nombre || !email || !motivo || !mensaje) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const motivoTexto = { '1': 'Soporte', '2': 'Sugerencias', '3': 'Otro' }[motivo] || motivo;

  const mailOptions = {
    from: `"SkinEmpires Contacto" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `[SkinEmpires] ${motivoTexto} - ${nombre}`,
    html: `
      <div style="font-family: Arial, sans-serif; background:#323031; color:#E8EBF7; padding:24px; border-radius:8px;">
        <h2 style="color:#FDEBB7; border-bottom:2px solid #B59356; padding-bottom:8px;">Nuevo mensaje de contacto</h2>
        <p><strong style="color:#B59356;">Nombre:</strong> ${nombre}</p>
        <p><strong style="color:#B59356;">Email:</strong> ${email}</p>
        <p><strong style="color:#B59356;">Motivo:</strong> ${motivoTexto}</p>
        <p><strong style="color:#B59356;">Mensaje:</strong></p>
        <p style="background:#262525; padding:12px; border-radius:4px; border-left:3px solid #9f591d;">${mensaje}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ mensaje: 'Correo enviado correctamente.' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));


