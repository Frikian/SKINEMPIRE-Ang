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
