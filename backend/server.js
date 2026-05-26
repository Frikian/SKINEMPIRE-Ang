const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const { Producte, Compra, ProductesCompra, CarritoGuardat } = require('./models');

app.use(cors());
app.use(express.json());
const PORT = 4020;

app.post('/api/ia-chat', async (req, res) => {
  const { missatge } = req.body;

  if (!missatge) {
    return res.status(400).json({ error: 'Missatge obligatori.' });
  }

  try {
    const resposta = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'Ets un bot de IA senzill. Respon de forma clara, curta i útil.'
          },
          {
            role: 'user',
            content: missatge
          }
        ]
      })
    });

    const dades = await resposta.json();

    if (!resposta.ok) {
      return res.status(500).json({ error: 'Error amb Groq.' });
    }

    res.json({
      resposta: dades.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({ error: 'Error intern del servidor.' });
  }
});



const EMAIL_USER = 'skinempire67@gmail.com';
const EMAIL_PASS = 'qtcp gakr uwlt mpsg';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
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

// --- VERIFICACIÓ DE CORREU ---
const verificationCodes = {};

app.post('/api/send-verification', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requerido' });
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
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
                    border:2px solid #B59356; text-align:center; margin:16px 0;">${code}</div>
        <p style="color:#919191; font-size:0.9rem;">El codi expira en 10 minuts.</p>
      </div>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ mensaje: 'Codi enviat correctament.' });
  } catch (error) {
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
  if (entry.code !== code.toUpperCase()) return res.status(400).json({ valid: false, error: 'Codi incorrecte.' });
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
    for (let i = 0; i < 32; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
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
            <a href="${resetLink}" style="background:#9e6e16; color:#323031; font-weight:bold; padding:12px 28px; border-radius:10px; text-decoration:none; font-size:1rem;">Restablir contrasenya</a>
          </div>
          <p style="color:#919191; font-size:0.9rem;">Aquest enllaç expira en 30 minuts.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ mensaje: 'Correu enviat correctament.' });
  } catch (error) {
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
    res.status(500).json({ error: 'Error intern del servidor.' });
  }
});

// --- FIREBASE ---
var admin = require("firebase-admin");
var serviceAccount = require("./skinempire-641a8-firebase-adminsdk-fbsvc-819343b0e4.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

(async () => {
  const ref = db.collection('usuaris').doc('SkinEmpireAdmin123');
  const doc = await ref.get();
  if (!doc.exists) {
    await ref.set({ nom: 'SkinEmpireAdmin123', email: 'admin@skinempire.com', contrasena: 'Admin1234!', esAdmin: true });
    console.log('Admin creat correctament.');
  } else if (!doc.data().esAdmin) {
    await ref.update({ esAdmin: true });
    console.log('Admin actualitzat correctament.');
  }
})();

// --- RUTAS FIREBASE ---
app.post('/usuaris', async (req, res) => {
  const { nom, email, contrasena } = req.body;
  try {
    const ref = db.collection('usuaris').doc(nom);
    const doc = await ref.get();
    if (doc.exists) return res.status(400).json({ mensaje: 'El usuario ya existe' });
    await ref.set({ nom, email, contrasena });
    res.status(200).json({ mensaje: 'Usuario guardado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

app.get('/usuaris', async (req, res) => {
  try {
    const esperaUsuari = await db.collection('usuaris').get();
    const usuaris = esperaUsuari.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(usuaris);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error intern del servidor' });
  }
});

app.get('/usuaris/:nom', async (req, res) => {
  const { nom } = req.params;
  try {
    const doc = await db.collection('usuaris').doc(nom).get();
    if (!doc.exists) return res.status(404).json({ mensaje: 'Usuari no trobat.' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error intern del servidor.' });
  }
});

app.get('/usuaris/:nom/admin', async (req, res) => {
  const { nom } = req.params;
  try {
    const doc = await db.collection('usuaris').doc(nom).get();
    if (!doc.exists) return res.status(404).json({ esAdmin: false });
    res.json({ esAdmin: doc.data().esAdmin === true });
  } catch (error) {
    res.status(500).json({ esAdmin: false });
  }
});

app.patch('/usuaris/:nom', async (req, res) => {
  const nomActual = req.params.nom;
  const { nouNom, email } = req.body;
  if (!nouNom && !email) return res.status(400).json({ mensaje: 'Has de proporcionar almenys un camp per actualitzar.' });
  try {
    const refActual = db.collection('usuaris').doc(nomActual);
    const docActual = await refActual.get();
    if (!docActual.exists) return res.status(404).json({ mensaje: 'Usuari no trobat.' });
    const dadesActuals = docActual.data();
    if (nouNom && nouNom !== nomActual) {
      const refNou = db.collection('usuaris').doc(nouNom);
      const docNou = await refNou.get();
      if (docNou.exists) return res.status(400).json({ mensaje: 'El nou nom ja existeix.' });
      await refNou.set({ nom: nouNom, email: email ?? dadesActuals.email, contrasena: dadesActuals.contrasena });
      await refActual.delete();
      return res.status(200).json({ mensaje: 'Usuari actualitzat correctament.', nom: nouNom, email: email ?? dadesActuals.email });
    }
    const actualitzacio = {};
    if (email) actualitzacio.email = email;
    await refActual.update(actualitzacio);
    res.status(200).json({ mensaje: 'Usuari actualitzat correctament.', nom: nomActual, email: email ?? dadesActuals.email });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error intern del servidor.' });
  }
});

// --- PRODUCTES (Sequelize ORM) ---
app.get('/api/productes', async (req, res) => {
  try {
    const productes = await Producte.findAll();
    console.log('Productes trobats:', productes.length, JSON.stringify(productes));
    res.json(productes);
  } catch (error) {
    console.error('Error en GET /api/productes:', error);
    res.status(500).json({ error: 'Error intern del servidor.' });
  }
});

// --- COMPRA (Sequelize ORM) ---
app.post('/api/compra', async (req, res) => {
  const { nom_usuari, productes } = req.body;
  if (!nom_usuari || !productes || productes.length === 0) {
    return res.status(400).json({ error: 'Dades incorrectes.' });
  }
  try {
    const dataAvui = new Date().toISOString().slice(0, 10);
    const compra = await Compra.create({ nom_usuari, data_compra: dataAvui });
    for (const p of productes) {
      await ProductesCompra.create({
        id_compra: compra.id_compra,
        id_producte: p.id_producte,
        cuantitat: p.cuantitat,
        preu_unitari: p.preu_unitari,
        oferta: p.oferta,
      });
    }
    res.status(200).json({ mensaje: 'Compra registrada correctament.', id_compra: compra.id_compra });
  } catch (error) {
    console.error('Error en /api/compra:', error);
    res.status(500).json({ error: 'Error intern del servidor.' });
  }
});

// --- HISTORIAL (Sequelize ORM) ---
app.get('/api/historial', async (req, res) => {
  try {
    const historial = await ProductesCompra.findAll({
      include: [
        { model: Compra, attributes: ['nom_usuari', 'data_compra'], required: true },
        { model: Producte, attributes: ['nom_producte'], required: true },
      ],
      order: [[{ model: Compra, as: 'compra' }, 'data_compra', 'DESC']],
    });
    const result = historial.map(h => ({
      id_productes_compra: h.id_productes_compra,
      id_compra: h.id_compra,
      nom_usuari: h.Compra ? h.Compra.nom_usuari : '',
      data_compra: h.Compra ? h.Compra.data_compra : '',
      nom_producte: h.Producte ? h.Producte.nom_producte : '',
      cuantitat: h.cuantitat,
      preu_unitari: h.preu_unitari,
      oferta: h.oferta,
    }));
    res.json(result);
  } catch (error) {
    console.error('Error en GET /api/historial:', error);
    res.status(500).json({ error: 'Error intern del servidor.' });
  }
});
// --- CARRITO GUARDAT ---
app.post('/api/carrito/guardar', async (req, res) => {
  const { nom_usuari, productes } = req.body;
  if (!nom_usuari || !productes) return res.status(400).json({ error: 'Dades incorrectes.' });
  try {
    await CarritoGuardat.destroy({ where: { nom_usuari } });
    const expira = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    for (const p of productes) {
      await CarritoGuardat.create({ nom_usuari, id_producte: p.id_producte, cuantitat: p.cuantitat, expira });
    }
    res.status(200).json({ mensaje: 'Carrito guardat correctament.' });
  } catch (error) {
    console.error('Error en /api/carrito/guardar:', error);
    res.status(500).json({ error: 'Error intern del servidor.' });
  }
});

app.get('/api/carrito/:nom', async (req, res) => {
  const { nom } = req.params;
  try {
    await CarritoGuardat.destroy({ where: { nom_usuari: nom, expira: { [require('sequelize').Op.lt]: new Date() } } });
    const items = await CarritoGuardat.findAll({ where: { nom_usuari: nom } });
    res.json(items);
  } catch (error) {
    console.error('Error en GET /api/carrito:', error);
    res.status(500).json({ error: 'Error intern del servidor.' });
  }
});

app.delete('/api/carrito/:nom', async (req, res) => {
  const { nom } = req.params;
  try {
    await CarritoGuardat.destroy({ where: { nom_usuari: nom } });
    res.status(200).json({ mensaje: 'Carrito esborrat.' });
  } catch (error) {
    console.error('Error esborrant carrito:', error);
    res.status(500).json({ error: 'Error intern del servidor.' });
  }
});


app.get('/api/estadisticas/admin', async (req, res) => {
  try {
    const ventasPorDiaProducto = await ProductesCompra.findAll({
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('compra.data_compra')), 'fecha'],
        [require('sequelize').col('producte.nom_producte'), 'producto'],
        [require('sequelize').fn('SUM', require('sequelize').col('cuantitat')), 'cantidad']
      ],
      include: [
        { model: Compra, attributes: [], required: true },
        { model: Producte, attributes: [], required: true }
      ],
      group: [
        require('sequelize').fn('DATE', require('sequelize').col('compra.data_compra')),
        'ProductesCompra.id_producte'
      ],
      raw: true,
      subQuery: false,
      order: [[require('sequelize').fn('DATE', require('sequelize').col('compra.data_compra')), 'ASC']]
    });

    const ofertaVsSinOferta = await ProductesCompra.findAll({
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('compra.data_compra')), 'fecha'],
        'oferta',
        [require('sequelize').fn('SUM', require('sequelize').col('cuantitat')), 'cantidad']
      ],
      include: [
        { model: Compra, attributes: [], required: true }
      ],
      group: [
        require('sequelize').fn('DATE', require('sequelize').col('compra.data_compra')),
        'oferta'
      ],
      raw: true,
      subQuery: false,
      order: [[require('sequelize').fn('DATE', require('sequelize').col('compra.data_compra')), 'ASC']]
    });

    res.json({
      ventasPorDiaProducto: ventasPorDiaProducto.map(v => ({
        fecha: v.fecha,
        producto: v.producto,
        cantidad: parseInt(v.cantidad)
      })),
      ofertaVsSinOferta: ofertaVsSinOferta.map(o => ({
        fecha: o.fecha,
        oferta: o.oferta === 1,
        cantidad: parseInt(o.cantidad)
      }))
    });
  } catch (error) {
    console.error('Error en GET /api/estadisticas/admin:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.get('/api/estadisticas/usuario/:nom', async (req, res) => {
  const { nom } = req.params;
  try {
    const ventasPorDiaProducto = await ProductesCompra.findAll({
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('compra.data_compra')), 'fecha'],
        [require('sequelize').col('producte.nom_producte'), 'producto'],
        [require('sequelize').fn('SUM', require('sequelize').col('cuantitat')), 'cantidad']
      ],
      include: [
        {
          model: Compra,
          attributes: [],
          required: true,
          where: { nom_usuari: nom }
        },
        { model: Producte, attributes: [], required: true }
      ],
      group: [
        require('sequelize').fn('DATE', require('sequelize').col('compra.data_compra')),
        'id_producte'
      ],
      raw: true,
      subQuery: false,
      order: [[require('sequelize').fn('DATE', require('sequelize').col('compra.data_compra')), 'ASC']]
    });

    const ofertaVsSinOferta = await ProductesCompra.findAll({
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('compra.data_compra')), 'fecha'],
        'oferta',
        [require('sequelize').fn('SUM', require('sequelize').col('cuantitat')), 'cantidad']
      ],
      include: [
        {
          model: Compra,
          attributes: [],
          required: true,
          where: { nom_usuari: nom }
        }
      ],
      group: [
        require('sequelize').fn('DATE', require('sequelize').col('compra.data_compra')),
        'oferta'
      ],
      raw: true,
      subQuery: false,
      order: [[require('sequelize').fn('DATE', require('sequelize').col('compra.data_compra')), 'ASC']]
    });

    res.json({
      ventasPorDiaProducto: ventasPorDiaProducto.map(v => ({
        fecha: v.fecha,
        producto: v.producto,
        cantidad: parseInt(v.cantidad)
      })),
      ofertaVsSinOferta: ofertaVsSinOferta.map(o => ({
        fecha: o.fecha,
        oferta: o.oferta === 1,
        cantidad: parseInt(o.cantidad)
      }))
    });
  } catch (error) {
    console.error('Error en GET /api/estadisticas/usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});


app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
