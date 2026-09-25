import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, getDoc, doc } from 'firebase/firestore';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// ==============================================
// 🔧 FIREBASE
// ==============================================
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

// ==============================================
// 📧 CORREO
// ==============================================
const CORREO_REMITE = process.env.CORREO_REMITE;
const CONTRASEÑA_CORREO = process.env.CONTRASEÑA_CORREO;

const transportador = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: CORREO_REMITE,
    pass: CONTRASEÑA_CORREO
  }
});

// ==============================================
// ⚙️ CONFIGURACIÓN
// ==============================================
const MAX_INTENTOS = 4;
const TIEMPO_BLOQUEO = 5 * 60 * 1000;
const EXPIRACION_CODIGO = 15 * 60 * 1000;
const estadoIntentos = {};
const codigosRecuperacion = {};

// ==============================================
// 🚀 SERVIDOR — PUERTO 5001 ✅
// ==============================================
const app = express();
const PUERTO = 5001;

app.use(cors());
app.use(express.json());

// ==============================================
// 📝 REGISTRO
// ==============================================
app.post('/api/registro', async (req, res) => {
  try {
    const { nombres, documento, contacto, direccion, correo, contraseña, rol } = req.body;
    const rolesValidos = ['Administrador', 'Administrador de Parque', 'Visitante'];

    if (!rol || !rolesValidos.includes(rol)) {
      return res.json({ mensaje: '❌ Debes seleccionar un rol válido' });
    }

    const qCorreo = query(collection(db, 'usuarios'), where('correo', '==', correo));
    const existeCorreo = await getDocs(qCorreo);
    if (!existeCorreo.empty) return res.json({ mensaje: '❌ Este correo ya está registrado' });

    const qDoc = query(collection(db, 'usuarios'), where('documento', '==', documento));
    const existeDoc = await getDocs(qDoc);
    if (!existeDoc.empty) return res.json({ mensaje: '❌ Este documento ya está registrado' });

    const contraseñaHash = crypto.createHash('sha256').update(contraseña).digest('hex');

    await addDoc(collection(db, 'usuarios'), {
      nombres, documento, contacto, direccion, correo,
      contraseña: contraseñaHash,
      rol,
      fechaRegistro: new Date().toISOString()
    });

    res.json({ mensaje: '✅ Registro exitoso. Ya puedes iniciar sesión' });
  } catch (error) {
    console.error('❌ ERROR REGISTRO:', error);
    res.json({ mensaje: '❌ Error al registrar' });
  }
});

// ==============================================
// 🔑 INICIO DE SESIÓN
// ==============================================
app.post('/api/login', async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    const ahora = Date.now();

    if (estadoIntentos[correo]?.bloqueadoHasta && ahora < estadoIntentos[correo].bloqueadoHasta) {
      const restante = Math.ceil((estadoIntentos[correo].bloqueadoHasta - ahora) / 1000);
      const min = Math.floor(restante / 60);
      const seg = restante % 60;
      return res.json({ mensaje: `🚫 Cuenta bloqueada. Intenta en ${min} min ${seg} seg`, bloqueado: true });
    }

    const contraseñaHash = crypto.createHash('sha256').update(contraseña).digest('hex');
    const q = query(collection(db, 'usuarios'), where('correo', '==', correo), where('contraseña', '==', contraseñaHash));
    const consulta = await getDocs(q);

    if (consulta.empty) {
      if (!estadoIntentos[correo]) estadoIntentos[correo] = { intentos: 0, bloqueadoHasta: 0 };
      estadoIntentos[correo].intentos += 1;
      const restantes = MAX_INTENTOS - estadoIntentos[correo].intentos;

      if (estadoIntentos[correo].intentos >= MAX_INTENTOS) {
        estadoIntentos[correo].bloqueadoHasta = ahora + TIEMPO_BLOQUEO;
        estadoIntentos[correo].intentos = 0;
        return res.json({ mensaje: '🚫 Demasiados intentos. Bloqueada 5 minutos', bloqueado: true });
      }
      return res.json({ mensaje: `❌ Correo o contraseña incorrectos. Te quedan ${restantes} intentos` });
    }

    delete estadoIntentos[correo];
    const usuarioDoc = consulta.docs[0];
    const usuario = { id: usuarioDoc.id, ...usuarioDoc.data() };
    delete usuario.contraseña;

    if (!usuario.rol) {
      usuario.rol = 'Administrador';
      await updateDoc(doc(db, 'usuarios', usuarioDoc.id), { rol: 'Administrador' });
    }

    res.json({ mensaje: `Bienvenido, ${(usuario.nombres || '').toUpperCase()}`, usuario: (usuario.nombres || '').toUpperCase(), rol: usuario.rol, ok: true });
  } catch (error) {
    console.error('❌ ERROR LOGIN:', error);
    res.json({ mensaje: '❌ Error al verificar credenciales' });
  }
});

// ==============================================
// ✅ VERIFICAR SESIÓN
// ==============================================
app.post('/api/verificar-sesion', async (req, res) => {
  try {
    const { correo } = req.body;
    const q = query(collection(db, 'usuarios'), where('correo', '==', correo));
    const consulta = await getDocs(q);

    if (consulta.empty) return res.json({ ok: false });

    const usuarioDoc = consulta.docs[0];
    const usuario = { id: usuarioDoc.id, ...usuarioDoc.data() };
    delete usuario.contraseña;

    if (!usuario.rol) {
      usuario.rol = 'Administrador';
      await updateDoc(doc(db, 'usuarios', usuarioDoc.id), { rol: 'Administrador' });
    }

    res.json({ ok: true, usuario, rol: usuario.rol });
  } catch (error) {
    console.error('❌ ERROR SESIÓN:', error);
    res.json({ ok: false });
  }
});

// ==============================================
// 📧 PASO 1 — ENVIAR CÓDIGO
// ==============================================
app.post('/api/enviar-codigo', async (req, res) => {
  try {
    const { correo } = req.body;
    const q = query(collection(db, 'usuarios'), where('correo', '==', correo));
    const consulta = await getDocs(q);

    if (consulta.empty) return res.json({ mensaje: '❌ Este correo no está registrado' });

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    codigosRecuperacion[correo] = { codigo, expiraEn: Date.now() + EXPIRACION_CODIGO };
    console.log('📧 Código generado para', correo, '→', codigo);

    await transportador.sendMail({
      from: CORREO_REMITE,
      to: correo,
      subject: '🔑 Código de Recuperación - BIRDWATCH',
      html: `
        <div style="font-family:Arial; max-width:500px; margin:0 auto; padding:20px; border-radius:10px; background:#f8f9fa;">
          <h2 style="color:#28a745; text-align:center;">🔑 Recuperar Contraseña</h2>
          <p>Hola,</p>
          <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
          <p style="font-size:18px;"><strong>Tu código es:</strong></p>
          <p style="font-size:32px; font-weight:bold; text-align:center; letter-spacing:8px; color:#28a745; background:#e9ecef; padding:15px; border-radius:8px;">${codigo}</p>
          <p>Válido por 15 minutos.</p>
        </div>
      `
    });

    res.json({ ok: true, mensaje: '✅ Código enviado a tu correo' });
  } catch (error) {
    console.error('❌ ERROR ENVIAR CÓDIGO:', error);
    res.json({ mensaje: '❌ No se pudo enviar el código: ' + error.message });
  }
});

// ==============================================
// ✅ PASO 2 — VERIFICAR CÓDIGO
// ==============================================
app.post('/api/verificar-codigo', (req, res) => {
  try {
    const { correo, codigo } = req.body;
    console.log('🔍 Verificando código de', correo, '→ enviado:', codigo);

    const registro = codigosRecuperacion[correo];
    console.log('📋 Código guardado:', registro);

    if (!registro) {
      return res.json({ mensaje: '❌ No hay solicitud activa', valido: false });
    }
    if (registro.codigo !== codigo) {
      return res.json({ mensaje: '❌ Código incorrecto', valido: false });
    }
    if (Date.now() > registro.expiraEn) {
      delete codigosRecuperacion[correo];
      return res.json({ mensaje: '❌ El código expiró', valido: false });
    }

    console.log('✅ Código VERIFICADO');
    res.json({ mensaje: '✅ Código verificado', valido: true });
  } catch (error) {
    console.error('❌ ERROR VERIFICAR:', error);
    res.json({ mensaje: '❌ Error: ' + error.message, valido: false });
  }
});

// ==============================================
// 🔑 PASO 3 — CAMBIAR CONTRASEÑA
// ==============================================
app.post('/api/cambiar-contrasena', async (req, res) => {
  try {
    const { correo, codigo, nuevaContraseña } = req.body;
    console.log('📝 RECIBIDO → correo:', correo, 'codigo:', codigo, 'nuevaContraseña:', nuevaContraseña);

    const registro = codigosRecuperacion[correo];
    if (!registro) {
      console.log('❌ No hay registro para:', correo);
      return res.json({ mensaje: '❌ No hay solicitud activa' });
    }
    if (registro.codigo !== codigo) {
      console.log('❌ Código no coincide. Guardado:', registro.codigo, '→ Enviado:', codigo);
      return res.json({ mensaje: '❌ Código incorrecto' });
    }
    if (Date.now() > registro.expiraEn) {
      delete codigosRecuperacion[correo];
      console.log('❌ Código expiró');
      return res.json({ mensaje: '❌ El código expiró' });
    }

    const q = query(collection(db, 'usuarios'), where('correo', '==', correo));
    const consulta = await getDocs(q);
    if (consulta.empty) {
      console.log('❌ Usuario no encontrado en Firebase');
      return res.json({ mensaje: '❌ Usuario no encontrado' });
    }

    const usuarioDoc = consulta.docs[0];
    const idUsuario = usuarioDoc.id;
    console.log('✅ Usuario encontrado. ID:', idUsuario);

    const contraseñaHash = crypto.createHash('sha256').update(nuevaContraseña).digest('hex');
    await updateDoc(doc(db, 'usuarios', idUsuario), { contraseña: contraseñaHash });

    delete codigosRecuperacion[correo];
    console.log('✅ ✅ CONTRASEÑA ACTUALIZADA EN FIREBASE ✅ ✅');
    res.json({ ok: true, mensaje: '✅ Contraseña actualizada. Ya puedes iniciar sesión' });
  } catch (error) {
    console.error('❌ ❌ ERROR AL CAMBIAR CONTRASEÑA:', error);
    res.json({ mensaje: '❌ Error: ' + error.message });
  }
});

// ==============================================
// 👥 LISTAR USUARIOS
// ==============================================
app.get('/api/listar-usuarios', async (req, res) => {
  try {
    const consulta = await getDocs(collection(db, 'usuarios'));
    const usuarios = [];

    for (const docSnap of consulta.docs) {
      const data = docSnap.data();
      let rol = data.rol;
      if (!rol || rol === 'Sin rol') {
        rol = 'Administrador';
        await updateDoc(doc(db, 'usuarios', docSnap.id), { rol });
      }
      usuarios.push({
        id: docSnap.id,
        nombres: data.nombres || '',
        correo: data.correo || '',
        documento: data.documento || '',
        rol,
        fechaRegistro: data.fechaRegistro || ''
      });
    }

    res.json({ ok: true, usuarios });
  } catch (error) {
    console.error('❌ ERROR LISTAR USUARIOS:', error);
    res.json({ ok: false, mensaje: '❌ Error al listar usuarios' });
  }
});

// ==============================================
// 🔄 ACTUALIZAR ROL DE USUARIO
// ==============================================
app.post('/api/actualizar-rol', async (req, res) => {
  try {
    const { correo, nuevoRol } = req.body;
    const rolesValidos = ['Administrador', 'Administrador de Parque', 'Visitante'];

    if (!nuevoRol || !rolesValidos.includes(nuevoRol)) {
      return res.json({ ok: false, mensaje: '❌ Rol no válido' });
    }

    const q = query(collection(db, 'usuarios'), where('correo', '==', correo));
    const consulta = await getDocs(q);
    if (consulta.empty) {
      return res.json({ ok: false, mensaje: '❌ Usuario no encontrado' });
    }

    const usuarioDoc = consulta.docs[0];
    await updateDoc(doc(db, 'usuarios', usuarioDoc.id), { rol: nuevoRol });
    res.json({ ok: true, mensaje: `✅ Rol actualizado a "${nuevoRol}"` });
  } catch (error) {
    console.error('❌ ERROR ACTUALIZAR ROL:', error);
    res.json({ ok: false, mensaje: '❌ Error al actualizar rol' });
  }
});

// ==============================================
// 🌳 PARQUES — CREAR
// ==============================================
app.post('/api/parques/crear', async (req, res) => {
  try {
    const { nombre, descripcion, direccion, horario, telefono, email, imagen, adminAsignado } = req.body;
    if (!nombre) return res.json({ ok: false, mensaje: '❌ El nombre del parque es obligatorio' });

    const ref = await addDoc(collection(db, 'parques'), {
      nombre,
      descripcion: descripcion || '',
      direccion: direccion || '',
      horario: horario || '',
      telefono: telefono || '',
      email: email || '',
      imagen: imagen || '',
      adminAsignado: adminAsignado || '',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    });

    res.json({ ok: true, mensaje: '✅ Parque creado correctamente', id: ref.id });
  } catch (error) {
    console.error('❌ ERROR CREAR PARQUE:', error);
    res.json({ ok: false, mensaje: '❌ Error al crear parque' });
  }
});

// ==============================================
// 🌳 PARQUES — LISTAR TODOS
// ==============================================
app.get('/api/parques/listar', async (req, res) => {
  try {
    const consulta = await getDocs(collection(db, 'parques'));
    const parques = [];
    consulta.forEach(docSnap => {
      parques.push({ id: docSnap.id, ...docSnap.data() });
    });
    res.json({ ok: true, parques });
  } catch (error) {
    console.error('❌ ERROR LISTAR PARQUES:', error);
    res.json({ ok: false, parques: [] });
  }
});

// ==============================================
// 🌳 PARQUE — OBTENER POR CORREO DEL ADMIN ASIGNADO
// ==============================================
app.post('/api/parques/obtener-por-admin', async (req, res) => {
  try {
    const { correo } = req.body;
    const q = query(collection(db, 'parques'), where('adminAsignado', '==', correo));
    const consulta = await getDocs(q);
    if (consulta.empty) return res.json({ ok: false });

    const docSnap = consulta.docs[0];
    res.json({ ok: true, parque: { id: docSnap.id, ...docSnap.data() } });
  } catch (error) {
    console.error('❌ ERROR OBTENER PARQUE:', error);
    res.json({ ok: false });
  }
});

// ==============================================
// 🌳 PARQUE — ACTUALIZAR
// ==============================================
app.post('/api/parques/actualizar', async (req, res) => {
  try {
    const { id, nombre, descripcion, direccion, horario, telefono, email, imagen, adminAsignado } = req.body;
    if (!id) return res.json({ ok: false, mensaje: '❌ ID del parque requerido' });

    const datos = {
      nombre: nombre || '',
      descripcion: descripcion || '',
      direccion: direccion || '',
      horario: horario || '',
      telefono: telefono || '',
      email: email || '',
      imagen: imagen || '',
      adminAsignado: adminAsignado || '',
      fechaActualizacion: new Date().toISOString()
    };

    await updateDoc(doc(db, 'parques', id), datos);
    res.json({ ok: true, mensaje: '✅ Parque actualizado correctamente' });
  } catch (error) {
    console.error('❌ ERROR ACTUALIZAR PARQUE:', error);
    res.json({ ok: false, mensaje: '❌ Error al actualizar parque' });
  }
});

// ==============================================
// 🌳 PARQUE — ASIGNAR ADMIN DE PARQUE
// ==============================================
app.post('/api/parques/asignar-admin', async (req, res) => {
  try {
    const { idParque, correoAdmin } = req.body;
    if (!idParque) return res.json({ ok: false, mensaje: '❌ ID del parque requerido' });

    const q = query(collection(db, 'usuarios'), where('correo', '==', correoAdmin));
    const consulta = await getDocs(q);
    if (consulta.empty) return res.json({ ok: false, mensaje: '❌ No existe usuario con ese correo' });

    await updateDoc(doc(db, 'parques', idParque), { adminAsignado: correoAdmin });
    res.json({ ok: true, mensaje: `✅ Admin de parque asignado: ${correoAdmin}` });
  } catch (error) {
    console.error('❌ ERROR ASIGNAR ADMIN:', error);
    res.json({ ok: false, mensaje: '❌ Error al asignar admin' });
  }
});

// ==============================================
// 🦜 AVISTAMIENTOS — CREAR
// ==============================================
app.post('/api/avistamientos/crear', async (req, res) => {
  try {
    const { nombreAve, especie, fotoUrl, parqueId, parqueNombre, fecha, descripcion, registradoPor } = req.body;
    if (!nombreAve) return res.json({ ok: false, mensaje: '❌ El nombre del ave es obligatorio' });
    if (!fecha) return res.json({ ok: false, mensaje: '❌ La fecha del avistamiento es obligatoria' });

    const ref = await addDoc(collection(db, 'avistamientos'), {
      nombreAve,
      especie: especie || '',
      fotoUrl: fotoUrl || '',
      parqueId: parqueId || '',
      parqueNombre: parqueNombre || '',
      fecha,
      descripcion: descripcion || '',
      registradoPor: registradoPor || '',
      fechaRegistro: new Date().toISOString()
    });

    res.json({ ok: true, mensaje: '✅ Avistamiento registrado correctamente', id: ref.id });
  } catch (error) {
    console.error('❌ ERROR CREAR AVISTAMIENTO:', error);
    res.json({ ok: false, mensaje: '❌ Error al registrar el avistamiento' });
  }
});

// ==============================================
// 🦜 AVISTAMIENTOS — LISTAR
// ==============================================
app.get('/api/avistamientos/listar', async (req, res) => {
  try {
    const consulta = await getDocs(collection(db, 'avistamientos'));
    const avistamientos = [];
    consulta.forEach(docSnap => {
      avistamientos.push({ id: docSnap.id, ...docSnap.data() });
    });
    res.json({ ok: true, avistamientos });
  } catch (error) {
    console.error('❌ ERROR LISTAR AVISTAMIENTOS:', error);
    res.json({ ok: false, avistamientos: [] });
  }
});

// ==============================================
// 🦜 AVISTAMIENTOS — ACTUALIZAR
// ==============================================
app.post('/api/avistamientos/actualizar', async (req, res) => {
  try {
    const { id, nombreAve, especie, fotoUrl, parqueId, parqueNombre, fecha, descripcion } = req.body;
    if (!id) return res.json({ ok: false, mensaje: '❌ ID del avistamiento requerido' });
    if (!nombreAve) return res.json({ ok: false, mensaje: '❌ El nombre del ave es obligatorio' });

    await updateDoc(doc(db, 'avistamientos', id), {
      nombreAve,
      especie: especie || '',
      fotoUrl: fotoUrl || '',
      parqueId: parqueId || '',
      parqueNombre: parqueNombre || '',
      fecha: fecha || '',
      descripcion: descripcion || ''
    });
    res.json({ ok: true, mensaje: '✅ Avistamiento actualizado correctamente' });
  } catch (error) {
    console.error('❌ ERROR ACTUALIZAR AVISTAMIENTO:', error);
    res.json({ ok: false, mensaje: '❌ Error al actualizar el avistamiento' });
  }
});

// ==============================================
// 🦜 AVISTAMIENTOS — ELIMINAR
// ==============================================
app.post('/api/avistamientos/eliminar', async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.json({ ok: false, mensaje: '❌ ID del avistamiento requerido' });

    await deleteDoc(doc(db, 'avistamientos', id));
    res.json({ ok: true, mensaje: '✅ Avistamiento eliminado correctamente' });
  } catch (error) {
    console.error('❌ ERROR ELIMINAR AVISTAMIENTO:', error);
    res.json({ ok: false, mensaje: '❌ Error al eliminar el avistamiento' });
  }
});

// ==============================================
// 👥 USUARIO — ACTUALIZAR INFORMACIÓN
// ==============================================
app.post('/api/actualizar-usuario', async (req, res) => {
  try {
    const { id, nombres, documento, contacto, direccion, correo } = req.body;
    if (!id) return res.json({ ok: false, mensaje: '❌ ID de usuario requerido' });
    if (!nombres || !correo) return res.json({ ok: false, mensaje: '❌ Nombre y correo son obligatorios' });

    const q = query(collection(db, 'usuarios'), where('correo', '==', correo));
    const existe = await getDocs(q);
    if (!existe.empty && existe.docs[0].id !== id) {
      return res.json({ ok: false, mensaje: '❌ Ese correo ya está registrado por otro usuario' });
    }

    await updateDoc(doc(db, 'usuarios', id), {
      nombres,
      documento: documento || '',
      contacto: contacto || '',
      direccion: direccion || '',
      correo
    });

    res.json({ ok: true, mensaje: '✅ Usuario actualizado correctamente' });
  } catch (error) {
    console.error('❌ ERROR ACTUALIZAR USUARIO:', error);
    res.json({ ok: false, mensaje: '❌ Error al actualizar el usuario' });
  }
});

// ==============================================
// 👥 USUARIO — ELIMINAR
// ==============================================
app.post('/api/eliminar-usuario', async (req, res) => {
  try {
    const { id, correoEliminador } = req.body;
    if (!id) return res.json({ ok: false, mensaje: '❌ ID de usuario requerido' });

    const ref = doc(db, 'usuarios', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return res.json({ ok: false, mensaje: '❌ Usuario no encontrado' });

    const targetUser = snap.data();
    if (targetUser.correo && targetUser.correo === correoEliminador) {
      return res.json({ ok: false, mensaje: '❌ No puedes eliminar tu propia cuenta' });
    }

    if (targetUser.rol === 'Administrador') {
      const admins = await getDocs(query(collection(db, 'usuarios'), where('rol', '==', 'Administrador')));
      if (admins.size <= 1) {
        return res.json({ ok: false, mensaje: '❌ No puedes eliminar al último administrador del sistema' });
      }
    }

    await deleteDoc(ref);
    res.json({ ok: true, mensaje: '✅ Usuario eliminado correctamente' });
  } catch (error) {
    console.error('❌ ERROR ELIMINAR USUARIO:', error);
    res.json({ ok: false, mensaje: '❌ Error al eliminar el usuario' });
  }
});

// ==============================================
// 🌳 PARQUE — ELIMINAR
// ==============================================
app.post('/api/parques/eliminar', async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.json({ ok: false, mensaje: '❌ ID del parque requerido' });

    await deleteDoc(doc(db, 'parques', id));
    res.json({ ok: true, mensaje: '✅ Parque eliminado correctamente' });
  } catch (error) {
    console.error('❌ ERROR ELIMINAR PARQUE:', error);
    res.json({ ok: false, mensaje: '❌ Error al eliminar el parque' });
  }
});

// ==============================================
// 💬 FORO — PUBLICAR
// ==============================================
app.post('/api/foro/publicar', async (req, res) => {
  try {
    const { titulo, contenido, autor, autorCorreo } = req.body;
    if (!titulo || !contenido) return res.json({ ok: false, mensaje: '❌ Título y mensaje son obligatorios' });

    const ref = await addDoc(collection(db, 'publicaciones'), {
      titulo,
      contenido,
      autor: autor || 'Anónimo',
      autorCorreo: autorCorreo || '',
      fechaPublicacion: new Date().toISOString()
    });

    res.json({ ok: true, mensaje: '✅ Publicación creada correctamente', id: ref.id });
  } catch (error) {
    console.error('❌ ERROR PUBLICAR FORO:', error);
    res.json({ ok: false, mensaje: '❌ Error al publicar' });
  }
});

// ==============================================
// 💬 FORO — LISTAR PUBLICACIONES
// ==============================================
app.get('/api/foro/listar', async (req, res) => {
  try {
    const consulta = await getDocs(collection(db, 'publicaciones'));
    const publicaciones = [];
    consulta.forEach(docSnap => {
      publicaciones.push({ id: docSnap.id, ...docSnap.data() });
    });
    publicaciones.sort((a, b) => (b.fechaPublicacion || '').localeCompare(a.fechaPublicacion || ''));
    res.json({ ok: true, publicaciones });
  } catch (error) {
    console.error('❌ ERROR LISTAR FORO:', error);
    res.json({ ok: false, publicaciones: [] });
  }
});

// ==============================================
// 💬 FORO — ELIMINAR PUBLICACIÓN
// ==============================================
app.post('/api/foro/eliminar', async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.json({ ok: false, mensaje: '❌ ID de la publicación requerido' });

    await deleteDoc(doc(db, 'publicaciones', id));
    res.json({ ok: true, mensaje: '✅ Publicación eliminada correctamente' });
  } catch (error) {
    console.error('❌ ERROR ELIMINAR PUBLICACIÓN:', error);
    res.json({ ok: false, mensaje: '❌ Error al eliminar la publicación' });
  }
});

// ==============================================
// 🚀 INICIAR SERVIDOR
// ==============================================
app.listen(PUERTO, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PUERTO}`);
  console.log(`🔒 Bloqueo: ${MAX_INTENTOS} intentos → ${TIEMPO_BLOQUEO/60000} minutos`);
});