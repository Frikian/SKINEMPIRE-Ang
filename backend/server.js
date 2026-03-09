const express = require('express');
const cors = require('cors');
const app = express();

// --- CONFIGURACIÓN NECESARIA ---
app.use(cors()); // Permite que Angular (puerto 4200) conecte con este servidor
app.use(express.json()); // Vital para poder leer los datos que envías desde el formulario
const PORT = 4020; // Asegúrate de que Angular apunte a este puerto (4020)

// --- FIREBASE ---
var admin = require("firebase-admin");

const db = admin.firestore();

// --- RUTAS ---
app.post('/usuaris', async (req, res) => {
  const { nom, email, contrasena } = req.body;
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
const PORT = 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
