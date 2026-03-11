const express = require('express');
const cors = require('cors');
const app = express();

// --- CONFIGURACIÓN NECESARIA ---
app.use(cors());
app.use(express.json());
const PORT = 4020;

var admin = require("firebase-admin");


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
