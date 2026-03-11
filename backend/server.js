const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// --- CONFIGURACIÓN NECESARIA ---
app.use(cors());
app.use(express.json());
const PORT = 4020;

const EMAIL_USER = 'skinempire67@gmail.com';
const EMAIL_PASS = 'qtcp gakr uwlt mpsg';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

app.post('/api/contacto', async (req, res) => {
  const { nombre, email, motivo, mensaje } = req.body;

  if (!nombre || !email || !motivo || !mensaje) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const motivoTexto = { '1': 'Soporte', '2': 'Sugerencias', '3': 'Otro' }[motivo] || motivo;

  const mailOptions = {
    from: `"SkinEmpire" <${EMAIL_USER}>`,
    to: EMAIL_USER,
    replyTo: email,
    subject: `[SkinEmpire] ${motivoTexto} - ${nombre}`,
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



// --- FIREBASE ---
var admin = require("firebase-admin");

var serviceAccount = require("./skinempire-641a8-firebase-adminsdk-fbsvc-5b777357d7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// --- FIREBASE ---

const db = admin.firestore();

// --- RUTAS ---
app.post('/usuaris', async (req, res) => {
  const { nom, email, contrasena } = req.body;




  try {
    const ref = db.collection('usuaris').doc(nom);
    const doc = await ref.get();

    if (doc.exists) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    await ref.set({ nom, email, contrasena });
    res.status(200).json({ mensaje: 'Usuario guardado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

app.get('/usuaris', async (req,res) => {
  try {
    const esperaUsuari = await db.collection('usuaris').get();
    const usuaris = esperaUsuari.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(usuaris);
  }catch (error){

  }
})
