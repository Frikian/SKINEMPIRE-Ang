const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'patata',
  database: 'skinempire',
  waitForConnections: true,
  connectionLimit: 10,
});

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

// --- VERIFICACIÓN DE CORREO ---
const verificationCodes = {};

app.post('/api/send-verification', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requerido' });

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  verificationCodes[email] = { code, expires: Date.now() + 10 * 60 * 1000 };

  const mailOptions = {
    from: `"SkinEmpire" <${EMAIL_USER}>`,
    to: email,
    subject: '[SkinEmpire] Codi de verificació',
    html: `
      <div style="font-family: Arial, sans-serif; background:#323031; color:#E8EBF7; padding:24px; border-radius:8px;">
        <h2 style="color:#FDEBB7; border-bottom:2px solid #B59356; padding-bottom:8px;">Verificació de compte</h2>
        <p>El teu codi de verificació és:</p>
        <div style="font-size:2.5rem; font-weight:bold; letter-spacing:0.4rem; color:#FDEBB7;
                    background:#262525; padding:16px; border-radius:8px;
                    border:2px solid #B59356; text-align:center; margin:16px 0;">
          ${code}
        </div>
        <p style="color:#919191; font-size:0.9rem;">El codi expira en 10 minuts.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ mensaje: 'Codi enviat correctament.' });
  } catch (error) {
    console.error('Error al enviar codi:', error);
    res.status(500).json({ error: 'Error al enviar el codi.' });
  }
});

app.post('/api/verify-code', (req, res) => {
  const { email, code } = req.body;
  const entry = verificationCodes[email];

  if (!entry) return res.status(400).json({ valid: false, error: 'No hi ha codi per aquest email.' });
  if (Date.now() > entry.expires) {
    delete verificationCodes[email];
    return res.status(400).json({ valid: false, error: 'El codi ha expirat.' });
  }
  if (entry.code !== code.toUpperCase()) {
    return res.status(400).json({ valid: false, error: 'Codi incorrecte.' });
  }

  delete verificationCodes[email];
  res.status(200).json({ valid: true });
});

// --- RECUPERACIÓ DE CONTRASENYA ---
const resetTokens = {};

app.post('/api/forgot-password', async (req, res) => {
  const { nom, email } = req.body;
  if (!nom || !email) return res.status(400).json({ error: 'Nom i email són obligatoris.' });

  try {
    const doc = await db.collection('usuaris').doc(nom).get();
    if (!doc.exists || doc.data().email !== email) {
      return res.status(404).json({ error: 'No s\'ha trobat cap usuari amb aquestes dades.' });
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    resetTokens[token] = { nom, email, expires: Date.now() + 30 * 60 * 1000 };

    const resetLink = `http://localhost:4200/reset-password?token=${token}`;

    const mailOptions = {
      from: `"SkinEmpire" <${EMAIL_USER}>`,
      to: email,
      subject: '[SkinEmpire] Restabliment de contrasenya',
      html: `
        <div style="font-family: Arial, sans-serif; background:#323031; color:#E8EBF7; padding:24px; border-radius:8px;">
          <h2 style="color:#FDEBB7; border-bottom:2px solid #B59356; padding-bottom:8px;">Restabliment de contrasenya</h2>
          <p>Hola <strong style="color:#FDEBB7;">${nom}</strong>,</p>
          <p>Has sol·licitat restablir la teva contrasenya. Fes clic al botó següent:</p>
          <div style="text-align:center; margin:24px 0;">
            <a href="${resetLink}"
               style="background:#9e6e16; color:#323031; font-weight:bold; padding:12px 28px;
                      border-radius:10px; text-decoration:none; font-size:1rem;">
              Restablir contrasenya
            </a>
          </div>
          <p style="color:#919191; font-size:0.9rem;">Aquest enllaç expira en 30 minuts. Si no has fet aquesta sol·licitud, ignora aquest correu.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ mensaje: 'Correu enviat correctament.' });
  } catch (error) {
    console.error('Error en forgot-password:', error);
    res.status(500).json({ error: 'Error intern del servidor.' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { token, novaContrasena } = req.body;
  const entry = resetTokens[token];

  if (!entry) return res.status(400).json({ error: 'Token invàlid.' });
  if (Date.now() > entry.expires) {
    delete resetTokens[token];
    return res.status(400).json({ error: 'El token ha expirat.' });
  }

  try {
    await db.collection('usuaris').doc(entry.nom).update({ contrasena: novaContrasena });
    delete resetTokens[token];
    res.status(200).json({ mensaje: 'Contrasenya actualitzada correctament.' });
  } catch (error) {
    console.error('Error en reset-password:', error);
    res.status(500).json({ error: 'Error intern del servidor.' });
  }
});

// --- FIREBASE ---
var admin = require("firebase-admin");

var serviceAccount = require("./skinempire-641a8-firebase-adminsdk-fbsvc-5b777357d7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

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

app.get('/usuaris', async (req, res) => {
  try {
    const esperaUsuari = await db.collection('usuaris').get();
    const usuaris = esperaUsuari.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(usuaris);
  } catch (error) {

  }
});

// --- OBTENIR UN USUARI PER NOM ---
app.get('/usuaris/:nom', async (req, res) => {
  const { nom } = req.params;
  try {
    const doc = await db.collection('usuaris').doc(nom).get();
    if (!doc.exists) {
      return res.status(404).json({ mensaje: 'Usuari no trobat.' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error en GET /usuaris/:nom:', error);
    res.status(500).json({ mensaje: 'Error intern del servidor.' });
  }
});

// --- ACTUALITZAR USUARI (nom i/o email) ---
app.patch('/usuaris/:nom', async (req, res) => {
  const nomActual = req.params.nom;
  const { nouNom, email } = req.body;

  if (!nouNom && !email) {
    return res.status(400).json({ mensaje: 'Has de proporcionar almenys un camp per actualitzar.' });
  }

  try {
    const refActual = db.collection('usuaris').doc(nomActual);
    const docActual = await refActual.get();

    if (!docActual.exists) {
      return res.status(404).json({ mensaje: 'Usuari no trobat.' });
    }

    const dadesActuals = docActual.data();

    if (nouNom && nouNom !== nomActual) {
      const refNou = db.collection('usuaris').doc(nouNom);
      const docNou = await refNou.get();
      if (docNou.exists) {
        return res.status(400).json({ mensaje: 'El nou nom ja existeix.' });
      }

      await refNou.set({
        nom: nouNom,
        email: email ?? dadesActuals.email,
        contrasena: dadesActuals.contrasena,
      });
      await refActual.delete();

      return res.status(200).json({
        mensaje: 'Usuari actualitzat correctament.',
        nom: nouNom,
        email: email ?? dadesActuals.email,
      });
    }

    const actualitzacio = {};
    if (email) actualitzacio.email = email;
    await refActual.update(actualitzacio);

    res.status(200).json({
      mensaje: 'Usuari actualitzat correctament.',
      nom: nomActual,
      email: email ?? dadesActuals.email,
    });
  } catch (error) {
    console.error('Error en PATCH /usuaris:', error);
    res.status(500).json({ mensaje: 'Error intern del servidor.' });
  }
});



app.post('/api/compra', async (req, res) => {
  const { nom_usuari, productes } = req.body;

  if (!nom_usuari || !productes || productes.length === 0) {
    return res.status(400).json({ error: 'Dades incorrectes.' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const dataAvui = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const [resCompra] = await conn.execute(
      'INSERT INTO compra (nom_usuari, data_compra) VALUES (?, ?)',
      [nom_usuari, dataAvui]
    );
    const id_compra = resCompra.insertId;

    for (const p of productes) {
      await conn.execute(
        'INSERT INTO productes_compra (id_compra, id_producte, cuantitat, preu_unitari, oferta) VALUES (?, ?, ?, ?, ?)',
        [id_compra, p.id_producte, p.cuantitat, p.preu_unitari, p.oferta]
      );
    }

    await conn.commit();
    res.status(200).json({ mensaje: 'Compra registrada correctament.', id_compra });
  } catch (error) {
    await conn.rollback();
    console.error('Error en /api/compra:', error);
    res.status(500).json({ error: 'Error intern del servidor.' });
  } finally {
    conn.release();
  }
});


app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
