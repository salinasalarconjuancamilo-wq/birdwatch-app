import { useState, useEffect } from 'react';
import './App.css';
import Carrusel from './Carrusel';

function App() {
  const [pagina, setPagina] = useState(() => {
    try {
      if (localStorage.getItem('correoUsuario') && localStorage.getItem('rolUsuario')) return 'dashboard';
    } catch (e) { /* sin almacenamiento */ }
    return 'inicio';
  });
  const [subPagina, setSubPagina] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [usuarioNombre, setUsuarioNombre] = useState('');
  const [correoUsuario, setCorreoUsuario] = useState('');
  const [cookiesAceptadas, setCookiesAceptadas] = useState(false);
  const [rolUsuario, setRolUsuario] = useState('');
  const [rolRegistro, setRolRegistro] = useState('');
  
  const imagenesSanAntonio = [
    {
      imagen: "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/472899361/1200",
      nombre: "Colibrí Pico largo",
      descripcion: "Especie común en los jardines y bosques de San Antonio"
    },
    {
      imagen: "https://i2.wp.com/birdscolombia.com/wp-content/uploads/2020/03/Ramphocelus-dimidiatus1.jpg?fit=1024%2C683&ssl=1",
      nombre: "Tángara Dorsirroja",
      descripcion: "Ave de colores brillantes habitante del bosque nublado"
    },
    {
      imagen: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Keel-billed_toucan.jpg",
      nombre: "Tucán Pico de Arcoíris",
      descripcion: "Icono de la biodiversidad del Zoológico Santa Cruz"
    },
    {
      imagen: "https://upload.wikimedia.org/wikipedia/commons/5/57/Picoides_nuttallii_Morro_Bay.jpg",
      nombre: "Carpintero Real",
      descripcion: "Frecuente en los ecoparques de la región"
    },
    {
      imagen: "https://upload.wikimedia.org/wikipedia/commons/2/23/Bubo_virginianus_06.jpg",
      nombre: "Búho Campestre",
      descripcion: "Habitante nocturno de los bosques protectores de San Antonio"
    },
    {
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Blue-grey_tanager_%28Thraupis_episcopus_quaesita%29_Las_Tangaras.jpg/960px-Blue-grey_tanager_%28Thraupis_episcopus_quaesita%29_Las_Tangaras.jpg",
      nombre: "Azulejo Común",
      descripcion: "Especie habitual en los bordes de bosque y jardines de San Antonio"
    },
    {
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Palm_tanager_%28Thraupis_palmarum_melanoptera%29_Cundinamarca.jpg/960px-Palm_tanager_%28Thraupis_palmarum_melanoptera%29_Cundinamarca.jpg",
      nombre: "Azulejo Palmero",
      descripcion: "Se observa con facilidad en las zonas abiertas y palmares de la región"
    },
    {
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Tangara_nigroviridis_T%C3%A1ngara_berlina_Beryl-spangled_Tanager_%286491814425%29.jpg/960px-Tangara_nigroviridis_T%C3%A1ngara_berlina_Beryl-spangled_Tanager_%286491814425%29.jpg",
      nombre: "Tángara Berlina",
      descripcion: "Tángara del bosque nuboso, típica de los Andes colombianos"
    },
    {
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Great_thrush_%28Turdus_fuscater_quindio%29_male_Caldas.jpg/960px-Great_thrush_%28Turdus_fuscater_quindio%29_male_Caldas.jpg",
      nombre: "Mirla Negra",
      descripcion: "Ave de gran tamaño, común en los bosques andinos de San Antonio"
    },
    {
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rufous_collared_sparrow_%28Zonotrichia_capensis_costaricensis%29_Cundinamarca.jpg/960px-Rufous_collared_sparrow_%28Zonotrichia_capensis_costaricensis%29_Cundinamarca.jpg",
      nombre: "Copetón",
      descripcion: "Ave muy común en los pueblos y fincas de San Antonio del Tequendama"
    },
    {
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Long-tailed_sylph_%28Aglaiocercus_kingii_kingii%29_male_Cundinamarca_2.jpg/960px-Long-tailed_sylph_%28Aglaiocercus_kingii_kingii%29_male_Cundinamarca_2.jpg",
      nombre: "Silfo Colilargo",
      descripcion: "Colibrí de larga cola verde metálico, joya del bosque de niebla"
    },
    {
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/White-booted_racket-tail_%28Ocreatus_underwoodii_melanantherus%29_male_in_flight_Paz_de_las_Aves_2.jpg/960px-White-booted_racket-tail_%28Ocreatus_underwoodii_melanantherus%29_male_in_flight_Paz_de_las_Aves_2.jpg",
      nombre: "Colibrí Coliblanco",
      descripcion: "Pequeño colibrí con plumitas blancas en las patas, del bosque andino"
    },
    {
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Scrub_tanager_%28Stilpnia_vitriolina%29_Las_Tangaras.jpg/960px-Scrub_tanager_%28Stilpnia_vitriolina%29_Las_Tangaras.jpg",
      nombre: "Tángara Rastrojera",
      descripcion: "Endémica de la zona andina, recorre matorrales en busca de frutos"
    },
    {
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Bananaquits.jpg/960px-Bananaquits.jpg",
      nombre: "Mielero",
      descripcion: "Pequeña ave nectarívora, frecuente en los jardines floridos de la región"
    },
    {
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Tangara_cyanicollis_T%C3%A1ngara_real_Blue-necked_Tanager_%286730353263%29.jpg/960px-Tangara_cyanicollis_T%C3%A1ngara_real_Blue-necked_Tanager_%286730353263%29.jpg",
      nombre: "Tángara Real",
      descripcion: "Tángara de colores vibrantes que habita el dosel del bosque nuboso"
    }
  ];


  const [nombres, setNombres] = useState('');
  const [documento, setDocumento] = useState('');
  const [contacto, setContacto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correoRegistro, setCorreoRegistro] = useState('');
  const [contraseñaRegistro, setContraseñaRegistro] = useState('');

  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');

  const [pasoRecuperar, setPasoRecuperar] = useState(1);
  const [correoRecuperar, setCorreoRecuperar] = useState('');
  const [codigoRecuperar, setCodigoRecuperar] = useState('');
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');

  const [verNueva, setVerNueva] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const [verLogin, setVerLogin] = useState(false);
  const [verRegistro, setVerRegistro] = useState(false);

  const [listaUsuarios, setListaUsuarios] = useState([]);

  const [listaParques, setListaParques] = useState([]);
  const [parqueNombre, setParqueNombre] = useState('');
  const [parqueDescripcion, setParqueDescripcion] = useState('');
  const [parqueDireccion, setParqueDireccion] = useState('');
  const [parqueHorario, setParqueHorario] = useState('');
  const [parqueTelefono, setParqueTelefono] = useState('');
  const [parqueEmail, setParqueEmail] = useState('');
  const [parqueAdmin, setParqueAdmin] = useState('');
  const [parqueEditId, setParqueEditId] = useState('');
  const [miParque, setMiParque] = useState(null);

  const [listaAvistamientos, setListaAvistamientos] = useState([]);
  const [avistamientoNombre, setAvistamientoNombre] = useState('');
  const [avistamientoEspecie, setAvistamientoEspecie] = useState('');
  const [avistamientoFoto, setAvistamientoFoto] = useState('');
  const [avistamientoParqueId, setAvistamientoParqueId] = useState('');
  const [avistamientoFecha, setAvistamientoFecha] = useState('');
  const [avistamientoDescripcion, setAvistamientoDescripcion] = useState('');
  const [avistamientoEditId, setAvistamientoEditId] = useState('');

  const [usuarioEditId, setUsuarioEditId] = useState('');
  const [usuarioEditNombres, setUsuarioEditNombres] = useState('');
  const [usuarioEditCorreo, setUsuarioEditCorreo] = useState('');
  const [usuarioEditDocumento, setUsuarioEditDocumento] = useState('');
  const [usuarioEditContacto, setUsuarioEditContacto] = useState('');
  const [usuarioEditDireccion, setUsuarioEditDireccion] = useState('');

  const [listaPublicaciones, setListaPublicaciones] = useState([]);
  const [foroTitulo, setForoTitulo] = useState('');
  const [foroContenido, setForoContenido] = useState('');

  const validarContraseña = (contraseña) => {
    const errores = [];
    if (contraseña.length < 8) errores.push('• Mínimo 8 caracteres');
    if (!/[A-Z]/.test(contraseña)) errores.push('• Al menos una letra MAYÚSCULA (A-Z)');
    if (!/[!@#$%&*?¿¡+-]/.test(contraseña)) errores.push('• Al menos un carácter especial: ! @ # $ % & * ? ¿ ¡ + -');
    return errores;
  };

  const Logo = () => (
    <div className="cabecera-logo">
      <img src="/1.png" alt="BIRDWATCH" />
      <span className="cabecera-logo-texto">BIRDWATCH</span>
    </div>
  );

  useEffect(() => {
    const aceptadas = localStorage.getItem('cookiesAceptadas');
    if (aceptadas) setCookiesAceptadas(true);

    if (pagina === 'dashboard') {
      const correoGuardado = localStorage.getItem('correoUsuario');
      const rolGuardado = localStorage.getItem('rolUsuario');
      if (rolGuardado) setRolUsuario(rolGuardado);
      if (correoGuardado) {
        setCorreoUsuario(correoGuardado);
        fetch('http://localhost:5001/api/verificar-sesion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo: correoGuardado })
        })
        .then(res => res.json())
        .then(datos => {
          if (datos.ok) {
            setUsuarioNombre((datos.usuario.nombres || '').toUpperCase());
            const rol = datos.usuario.rol || 'Administrador';
            setRolUsuario(rol);
            localStorage.setItem('rolUsuario', rol);
          }
        });

        fetch('http://localhost:5001/api/listar-usuarios', { cache: 'no-store' })
          .then(res => res.json())
          .then(datos => { if (datos.ok) setListaUsuarios(datos.usuarios); });

        fetch('http://localhost:5001/api/parques/listar', { cache: 'no-store' })
          .then(res => res.json())
          .then(datos => { if (datos.ok) setListaParques(datos.parques); });

        fetch('http://localhost:5001/api/avistamientos/listar', { cache: 'no-store' })
          .then(res => res.json())
          .then(datos => { if (datos.ok) setListaAvistamientos(datos.avistamientos); });

        fetch('http://localhost:5001/api/foro/listar', { cache: 'no-store' })
          .then(res => res.json())
          .then(datos => { if (datos.ok) setListaPublicaciones(datos.publicaciones); });

        if (rolGuardado === 'Administrador de Parque') {
          fetch('http://localhost:5001/api/parques/obtener-por-admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: correoGuardado })
          })
          .then(res => res.json())
          .then(datos => { if (datos.ok) setMiParque(datos.parque); });
        }
      }
    }
  }, [pagina]);

  const aceptarCookies = () => {
    setCookiesAceptadas(true);
    try { localStorage.setItem('cookiesAceptadas', 'SI'); } catch (e) { /* almacenamiento no disponible */ }
  };

  const rechazarCookies = () => {
    setCookiesAceptadas(true);
    try { localStorage.setItem('cookiesAceptadas', 'NO'); } catch (e) { /* almacenamiento no disponible */ }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setMensaje('🔄 Enviando...');
    if (!rolRegistro) { setMensaje('❌ Debes seleccionar un rol'); return; }
    const errores = validarContraseña(contraseñaRegistro);
    if (errores.length > 0) { setMensaje('❌ La contraseña NO cumple:\n' + errores.join('\n')); return; }
    try {
      const r = await fetch('http://localhost:5001/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombres, documento, contacto, direccion, correo: correoRegistro, contraseña: contraseñaRegistro, rol: rolRegistro })
      });
      const d = await r.json();
      setMensaje(d.mensaje);
      if (d.mensaje.includes('✅')) { setRolRegistro(''); setPagina('login'); }
    } catch { setMensaje('❌ No se pudo conectar al servidor'); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('🔄 Verificando...');
    try {
      const r = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contraseña })
      });
      const d = await r.json();
      setMensaje(d.mensaje);
      if (d.mensaje.includes('Bienvenido')) {
        localStorage.setItem('correoUsuario', correo);
        const rol = d.rol || 'Administrador';
        localStorage.setItem('rolUsuario', rol);
        setRolUsuario(rol);
        setCorreoUsuario(correo);
        if (d.usuario) setUsuarioNombre(d.usuario.toUpperCase());
        setSubPagina('');
        setPagina('dashboard');
      }
    } catch { setMensaje('❌ No se pudo conectar al servidor'); }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('correoUsuario');
    localStorage.removeItem('rolUsuario');
    setUsuarioNombre(''); setCorreoUsuario(''); setCorreo(''); setContraseña('');
    setMensaje(''); setRolUsuario(''); setSubPagina(''); setMiParque(null);
    setListaParques([]); setListaUsuarios([]); setListaAvistamientos([]); setListaPublicaciones([]);
    cerrarEditarUsuario(); limpiarFormularioAvistamiento();
    setForoTitulo(''); setForoContenido('');
    setPagina('inicio');
  };

  const irAModulo = (modulo) => { setSubPagina(modulo); };
  const volverAlDashboard = () => { setSubPagina(''); };

  const badgeClass = rolUsuario === 'Administrador' ? 'badge-admin' : rolUsuario === 'Administrador de Parque' ? 'badge-parque' : 'badge-visitante';

  const cargarParques = () => {
    fetch('http://localhost:5001/api/parques/listar', { cache: 'no-store' })
      .then(res => res.json())
      .then(datos => { if (datos.ok) setListaParques(datos.parques); });
  };

  const limpiarFormularioParque = () => {
    setParqueNombre(''); setParqueDescripcion(''); setParqueDireccion('');
    setParqueHorario(''); setParqueTelefono(''); setParqueEmail('');
    setParqueAdmin(''); setParqueEditId('');
  };

  const guardarParque = async (e) => {
    e.preventDefault();
    setMensaje('🔄 Guardando...');
    try {
      const body = {
        nombre: parqueNombre, descripcion: parqueDescripcion, direccion: parqueDireccion,
        horario: parqueHorario, telefono: parqueTelefono, email: parqueEmail, adminAsignado: parqueAdmin
      };
      let r;
      if (parqueEditId) {
        body.id = parqueEditId;
        r = await fetch('http://localhost:5001/api/parques/actualizar', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
      } else {
        r = await fetch('http://localhost:5001/api/parques/crear', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
      }
      const d = await r.json();
      setMensaje(d.mensaje);
      if (d.ok) { limpiarFormularioParque(); cargarParques(); }
      setTimeout(() => setMensaje(''), 3000);
    } catch { setMensaje('❌ Error de conexión'); }
  };

  const editarParque = (p) => {
    setParqueEditId(p.id); setParqueNombre(p.nombre || '');
    setParqueDescripcion(p.descripcion || ''); setParqueDireccion(p.direccion || '');
    setParqueHorario(p.horario || ''); setParqueTelefono(p.telefono || '');
    setParqueEmail(p.email || ''); setParqueAdmin(p.adminAsignado || '');
    setSubPagina('crear-parque');
  };

  const asignarAdminParque = async (idParque, correoAdmin) => {
    try {
      const r = await fetch('http://localhost:5001/api/parques/asignar-admin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idParque, correoAdmin })
      });
      const d = await r.json();
      setMensaje(d.mensaje);
      if (d.ok) cargarParques();
      setTimeout(() => setMensaje(''), 3000);
    } catch { setMensaje('❌ Error de conexión'); }
  };

  const eliminarParque = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este parque? Esta acción no se puede deshacer.')) return;
    try {
      const r = await fetch('http://localhost:5001/api/parques/eliminar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const d = await r.json();
      setMensaje(d.mensaje);
      if (d.ok) cargarParques();
      setTimeout(() => setMensaje(''), 3000);
    } catch { setMensaje('❌ Error al eliminar'); }
  };

  const cambiarRol = async (correo, nuevoRol) => {
    try {
      const r = await fetch('http://localhost:5001/api/actualizar-rol', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, nuevoRol })
      });
      const d = await r.json();
      if (d.ok) setListaUsuarios(prev => prev.map(u => u.correo === correo ? { ...u, rol: nuevoRol } : u));
      setMensaje(d.mensaje);
      setTimeout(() => setMensaje(''), 3000);
    } catch { setMensaje('❌ Error de conexión'); }
  };

  const cargarAvistamientos = () => {
    fetch('http://localhost:5001/api/avistamientos/listar', { cache: 'no-store' })
      .then(res => res.json())
      .then(datos => { if (datos.ok) setListaAvistamientos(datos.avistamientos); });
  };

  const limpiarFormularioAvistamiento = () => {
    setAvistamientoNombre(''); setAvistamientoEspecie(''); setAvistamientoFoto('');
    setAvistamientoParqueId(''); setAvistamientoFecha(''); setAvistamientoDescripcion('');
    setAvistamientoEditId('');
  };

  const guardarAvistamiento = async (e) => {
    e.preventDefault();
    setMensaje('🔄 Guardando...');
    try {
      let parqueSel = listaParques.find(p => p.id === avistamientoParqueId);
      let parqueGuardarId = avistamientoParqueId;
      if (rolUsuario === 'Administrador de Parque' && miParque) {
        parqueSel = miParque;
        parqueGuardarId = miParque.id || '';
      }
      const body = {
        nombreAve: avistamientoNombre,
        especie: avistamientoEspecie,
        fotoUrl: avistamientoFoto,
        parqueId: parqueGuardarId,
        parqueNombre: parqueSel ? parqueSel.nombre : '',
        fecha: avistamientoFecha,
        descripcion: avistamientoDescripcion,
        registradoPor: correoUsuario
      };
      let r;
      if (avistamientoEditId) {
        body.id = avistamientoEditId;
        r = await fetch('http://localhost:5001/api/avistamientos/actualizar', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
      } else {
        r = await fetch('http://localhost:5001/api/avistamientos/crear', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
      }
      const d = await r.json();
      setMensaje(d.mensaje);
      if (d.ok) { limpiarFormularioAvistamiento(); cargarAvistamientos(); }
      setTimeout(() => setMensaje(''), 3000);
    } catch { setMensaje('❌ No se pudo conectar al servidor'); }
  };

  const editarAvistamiento = (av) => {
    setAvistamientoEditId(av.id);
    setAvistamientoNombre(av.nombreAve || '');
    setAvistamientoEspecie(av.especie || '');
    setAvistamientoFoto(av.fotoUrl || '');
    setAvistamientoParqueId(av.parqueId || (miParque ? miParque.id : ''));
    setAvistamientoFecha(av.fecha || '');
    setAvistamientoDescripcion(av.descripcion || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminarAvistamiento = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este avistamiento?')) return;
    try {
      const r = await fetch('http://localhost:5001/api/avistamientos/eliminar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id })
      });
      const d = await r.json();
      setMensaje(d.mensaje);
      if (d.ok) cargarAvistamientos();
      setTimeout(() => setMensaje(''), 3000);
    } catch { setMensaje('❌ Error al eliminar'); }
  };

  const abrirEditarUsuario = (u) => {
    setUsuarioEditId(u.id);
    setUsuarioEditNombres(u.nombres || '');
    setUsuarioEditCorreo(u.correo || '');
    setUsuarioEditDocumento(u.documento || '');
    setUsuarioEditContacto(u.contacto || '');
    setUsuarioEditDireccion(u.direccion || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cerrarEditarUsuario = () => {
    setUsuarioEditId(''); setUsuarioEditNombres(''); setUsuarioEditCorreo('');
    setUsuarioEditDocumento(''); setUsuarioEditContacto(''); setUsuarioEditDireccion('');
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();
    setMensaje('🔄 Guardando...');
    try {
      const r = await fetch('http://localhost:5001/api/actualizar-usuario', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: usuarioEditId, nombres: usuarioEditNombres, documento: usuarioEditDocumento,
          contacto: usuarioEditContacto, direccion: usuarioEditDireccion, correo: usuarioEditCorreo
        })
      });
      const d = await r.json();
      setMensaje(d.mensaje);
      if (d.ok) {
        setListaUsuarios(prev => prev.map(u => u.id === usuarioEditId ? {
          ...u, nombres: usuarioEditNombres, documento: usuarioEditDocumento,
          contacto: usuarioEditContacto, direccion: usuarioEditDireccion, correo: usuarioEditCorreo
        } : u));
        if (usuarioEditCorreo === correoUsuario) localStorage.setItem('correoUsuario', usuarioEditCorreo);
        cerrarEditarUsuario();
      }
      setTimeout(() => setMensaje(''), 3000);
    } catch { setMensaje('❌ No se pudo conectar al servidor'); }
  };

  const eliminarUsuario = async (id, correo) => {
    if (correo === correoUsuario) { setMensaje('❌ No puedes eliminar tu propia cuenta'); setTimeout(() => setMensaje(''), 3000); return; }
    if (!window.confirm('¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.')) return;
    try {
      const r = await fetch('http://localhost:5001/api/eliminar-usuario', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, correoEliminador: correoUsuario })
      });
      const d = await r.json();
      setMensaje(d.mensaje);
      if (d.ok) setListaUsuarios(prev => prev.filter(u => u.id !== id));
      setTimeout(() => setMensaje(''), 3000);
    } catch { setMensaje('❌ Error al eliminar'); }
  };

  const cargarPublicaciones = () => {
    fetch('http://localhost:5001/api/foro/listar', { cache: 'no-store' })
      .then(res => res.json())
      .then(datos => { if (datos.ok) setListaPublicaciones(datos.publicaciones); });
  };

  const publicarEnForo = async (e) => {
    e.preventDefault();
    if (!foroTitulo.trim() || !foroContenido.trim()) { setMensaje('❌ Escribe un título y un mensaje'); setTimeout(() => setMensaje(''), 3000); return; }
    setMensaje('🔄 Publicando...');
    try {
      const r = await fetch('http://localhost:5001/api/foro/publicar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: foroTitulo, contenido: foroContenido, autor: usuarioNombre, autorCorreo: correoUsuario })
      });
      const d = await r.json();
      setMensaje(d.mensaje);
      if (d.ok) { setForoTitulo(''); setForoContenido(''); cargarPublicaciones(); }
      setTimeout(() => setMensaje(''), 3000);
    } catch { setMensaje('❌ No se pudo conectar al servidor'); }
  };

  const eliminarPublicacion = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta publicación?')) return;
    try {
      const r = await fetch('http://localhost:5001/api/foro/eliminar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id })
      });
      const d = await r.json();
      setMensaje(d.mensaje);
      if (d.ok) cargarPublicaciones();
      setTimeout(() => setMensaje(''), 3000);
    } catch { setMensaje('❌ Error al eliminar'); }
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '';
    try {
      const d = new Date(fechaISO);
      return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return fechaISO; }
  };

  const procesarImagen = (evento) => {
    const archivo = evento.target.files[0];
    if (!archivo) return;
    if (!archivo.type.startsWith('image/')) { setMensaje('❌ Solo se permiten imágenes'); setTimeout(() => setMensaje(''), 3000); return; }
    const lector = new FileReader();
    lector.onload = () => {
      const imagen = new Image();
      imagen.onload = () => {
        const lienzo = document.createElement('canvas');
        const maxAncho = 800;
        const escala = Math.min(1, maxAncho / imagen.width);
        lienzo.width = Math.round(imagen.width * escala);
        lienzo.height = Math.round(imagen.height * escala);
        const ctx = lienzo.getContext('2d');
        ctx.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
        setAvistamientoFoto(lienzo.toDataURL('image/jpeg', 0.75));
        setMensaje('✅ Imagen lista');
        setTimeout(() => setMensaje(''), 2000);
      };
      imagen.src = lector.result;
    };
    lector.readAsDataURL(archivo);
    evento.target.value = '';
  };

  return (
    <div className="pagina">
      <div className="fondo-difuminado"></div>

      {/* ==================== INICIO ==================== */}
      {pagina === 'inicio' && (
        <>
          <header className="cabecera">
            <Logo />
            <div className="cabecera-botones">
              <button className="boton boton-iniciar" onClick={() => setPagina('login')}>Iniciar Sesion</button>
              <button className="boton boton-registrar" onClick={() => {setPagina('registro'); setMensaje('');}}>Registrarse</button>
            </div>
          </header>
          <main className="contenido">
            <h1 className="titulo-principal">Bienvenido a BIRDWATCH</h1>
            <Carrusel imagenes={imagenesSanAntonio} />
            <div className="tarjetas">
              <div className="tarjeta">
                <h3>Mision</h3>
                <p>Desarrollar una aplicacion hibrida educativa que brinde informacion completa, dinamica y accesible sobre las especies de aves del Zoologico Santa Cruz y ecoparques aliados.</p>
              </div>
              <div className="tarjeta">
                <h3>Vision</h3>
                <p>Ser la aplicacion hibrida de referencia en educacion y conservacion de aves en el Zoologico Santa Cruz y ecoparques de la region.</p>
              </div>
              <div className="tarjeta">
                <h3>Contactanos</h3>
                <p>contacto@birdwatch.com</p>
              </div>
            </div>
            {!cookiesAceptadas && (
              <div className="cookies">
                <div className="cookies-contenido">
                  <h4 className="cookies-titulo">Usamos cookies</h4>
                  <p className="cookies-texto">
                    Utilizamos cookies para mejorar tu experiencia en BIRDWATCH.
                    Puedes aceptarlas todas, rechazarlas o conocer más en nuestros
                    <button className="enlace" onClick={() => setPagina('terminos')}> Términos y Condiciones</button>.
                  </p>
                </div>
                <div className="cookies-botones">
                  <button type="button" className="boton boton-rojo" onClick={rechazarCookies}>Rechazar</button>
                  <button type="button" className="boton boton-verde" onClick={aceptarCookies}>Aceptar</button>
                </div>
              </div>
            )}
          </main>
          <footer className="pie">contacto@birdwatch.com | Instagram: @birdwatch_sat | 2026 BIRDWATCH</footer>
        </>
      )}

      {/* ==================== TERMINOS Y CONDICIONES ==================== */}
      {pagina === 'terminos' && (
        <>
          <header className="cabecera">
            <Logo />
            <div className="cabecera-botones">
              <button className="boton boton-blanco" onClick={() => setPagina('inicio')}>Volver al inicio</button>
            </div>
          </header>
          <main className="contenido terminos-contenedor">
            <h1 className="titulo-formulario">Terminos y Condiciones</h1>

            <div className="tarjeta">
              <h3>1. Aceptacion de los Terminos</h3>
              <p>
                Al acceder y utilizar la plataforma BIRDWATCH, aceptas cumplir con los presentes Terminos y Condiciones.
                Si no estas de acuerdo con ellos, te pedimos que no utilices la aplicacion.
              </p>
            </div>

            <div className="tarjeta">
              <h3>2. Uso de la Plataforma</h3>
              <p>
                BIRDWATCH es una aplicacion hibrida educativa sobre aves del Zoologico Santa Cruz y ecoparques aliados.
                El uso de la plataforma debe ser exclusivamente con fines educativos e informativos, sin fines comerciales
                no autorizados.
              </p>
            </div>

            <div className="tarjeta">
              <h3>3. Cuenta del Usuario</h3>
              <p>
                Eres responsable de la confidencialidad de tus credenciales de acceso y de todas las actividades que se
                realicen con tu cuenta. Debes proporcionar datos veraces al momento de registrarte y mantenerlos actualizados.
              </p>
            </div>

            <div className="tarjeta">
              <h3>4. Contenido y Publicaciones</h3>
              <p>
                Los avistamientos, publicaciones del foro y demas contenidos que compartas deben ser respetuosos y adecuados.
                Queda prohibido publicar contenido ofensivo, falso o que infrinja derechos de terceros.
              </p>
            </div>

            <div className="tarjeta">
              <h3>5. Privacidad y Cookies</h3>
              <p>
                Respetamos tu privacidad. Esta plataforma utiliza cookies para mejorar la experiencia de navegacion.
                Puedes aceptarlas o rechazarlas desde el aviso de cookies. Al aceptar, consientes el uso de cookies para
                recordar tus preferencias.
              </p>
            </div>

            <div className="tarjeta">
              <h3>6. Propiedad Intelectual</h3>
              <p>
                El nombre BIRDWATCH, su logotipo, imagenes y contenidos son propiedad de sus creadores. No esta permitida
                su reproduccion total o parcial sin autorizacion previa.
              </p>
            </div>

            <div className="tarjeta">
              <h3>7. Limitacion de Responsabilidad</h3>
              <p>
                BIRDWATCH no se hace responsable por el uso indebido de la informacion publicada ni por interrupciones
                temporales del servicio. La informacion sobre aves tiene fines educativos y puede estar sujeta a cambios.
              </p>
            </div>

            <div className="tarjeta">
              <h3>8. Modificaciones</h3>
              <p>
                Nos reservamos el derecho de modificar estos Terminos y Condiciones en cualquier momento. Los cambios
                entraran en vigencia desde su publicacion en la plataforma.
              </p>
            </div>

            <div className="tarjeta">
              <h3>9. Contacto</h3>
              <p>
                Para consultas o solicitudes relacionadas con estos Terminos y Condiciones, escribenos a:
                <strong> contacto@birdwatch.com</strong>
              </p>
            </div>

            <div className="terminos-boton">
              <button className="boton boton-verde" onClick={() => { setPagina('inicio'); setMensaje(''); }}>Aceptar y volver al inicio</button>
            </div>
          </main>
          <footer className="pie">contacto@birdwatch.com | Instagram: @birdwatch_sat | 2026 BIRDWATCH</footer>
        </>
      )}

      {/* ==================== LOGIN ==================== */}
      {pagina === 'login' && (
        <>
          <header className="cabecera"><Logo /></header>
          <main className="formulario-contenedor">
            <h2 className="titulo-formulario">🔐 Iniciar Sesion</h2>
            <form onSubmit={handleLogin}>
              <label>Usuario (Correo)</label>
              <input type="email" className="input" placeholder="Ingresa tu correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
              <label>Contrasena</label>
              <div className="input-con-icono">
                <input type={verLogin ? 'text' : 'password'} className="input" placeholder="Ingresa tu contrasena" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
                <button type="button" className="boton-icono" onClick={() => setVerLogin(!verLogin)}>{verLogin ? 'O' : 'V'}</button>
              </div>
              <button type="submit" className="boton boton-verde boton-ancho">INICIAR SESION</button>
            </form>
            {mensaje && <p className="mensaje">{mensaje}</p>}
            <div className="enlaces">
              <button className="enlace" onClick={() => {setPagina('registro'); setMensaje('');}}>Registrarse</button>
              <button className="enlace enlace-rojo" onClick={() => { setPagina('recuperar'); setPasoRecuperar(1); setMensaje(''); setCorreoRecuperar(''); setCodigoRecuperar(''); setNuevaContraseña(''); setConfirmarContraseña(''); }}>Olvide mi contrasena</button>
              <button className="enlace enlace-gris" onClick={() => {setPagina('inicio'); setMensaje('');}}>Volver al inicio</button>
            </div>
          </main>
          <footer className="pie">contacto@birdwatch.com</footer>
        </>
      )}

      {/* ==================== REGISTRO ==================== */}
      {pagina === 'registro' && (
        <>
          <header className="cabecera"><Logo /></header>
          <main className="formulario-contenedor formulario-ancho">
            <h2 className="titulo-formulario">Registro de Usuario</h2>
            <div className="texto-ayuda">
              <strong>Requisitos de contrasena:</strong>
              <ul><li>Minimo 8 caracteres</li><li>Al menos una letra MAYUSCULA (A-Z)</li><li>Al menos un caracter especial: ! @ # $ % & * ? + -</li></ul>
            </div>
            <form onSubmit={handleRegistro}>
              <label>Nombres y Apellidos</label>
              <input type="text" className="input" placeholder="Tu nombre completo" value={nombres} onChange={(e) => setNombres(e.target.value)} required />
              <label>Numero de Documento</label>
              <input type="text" className="input" placeholder="Tu documento de identidad" value={documento} onChange={(e) => setDocumento(e.target.value)} required />
              <label>Numero de Contacto</label>
              <input type="tel" className="input" placeholder="Tu telefono o celular" value={contacto} onChange={(e) => setContacto(e.target.value)} required />
              <label>Direccion</label>
              <input type="text" className="input" placeholder="Tu direccion de residencia" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
              <label>Correo Electronico</label>
              <input type="email" className="input" placeholder="tu@correo.com" value={correoRegistro} onChange={(e) => setCorreoRegistro(e.target.value)} required />
              <label>Rol</label>
              <select className="input select-rol" value={rolRegistro} onChange={(e) => setRolRegistro(e.target.value)} required>
                <option value="">Selecciona tu rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Administrador de Parque">Administrador de Parque</option>
                <option value="Visitante">Visitante</option>
              </select>
              <label>Contrasena</label>
              <div className="input-con-icono">
                <input type={verRegistro ? 'text' : 'password'} className="input" placeholder="Crea tu contrasena segura" value={contraseñaRegistro} onChange={(e) => setContraseñaRegistro(e.target.value)} required />
                <button type="button" className="boton-icono" onClick={() => setVerRegistro(!verRegistro)}>{verRegistro ? 'O' : 'V'}</button>
              </div>
              <button type="submit" className="boton boton-verde boton-ancho">REGISTRAR</button>
            </form>
            {mensaje && <p className="mensaje">{mensaje}</p>}
            <div className="enlaces">
              <p>Ya tienes cuenta? <button className="enlace" onClick={() => {setPagina('login'); setMensaje('');}}>Iniciar Sesion</button></p>
              <button className="enlace enlace-gris" onClick={() => {setPagina('inicio'); setMensaje('');}}>Volver al inicio</button>
            </div>
          </main>
          <footer className="pie">contacto@birdwatch.com</footer>
        </>
      )}

      {/* ==================== RECUPERAR CONTRASENA ==================== */}
      {pagina === 'recuperar' && (
        <>
          <header className="cabecera"><Logo /></header>
          <main className="formulario-contenedor">
            <h2 className="titulo-formulario">Recuperar Contrasena</h2>
            {pasoRecuperar === 1 && (
              <form onSubmit={async (e) => { e.preventDefault(); setMensaje('Enviando codigo...'); try { const res = await fetch('http://localhost:5001/api/enviar-codigo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ correo: correoRecuperar }) }); const datos = await res.json(); setMensaje(datos.mensaje); if (datos.ok) setPasoRecuperar(2); } catch { setMensaje('Sin conexion con el servidor'); } }}>
                <label>Paso 1 de 3: Ingresa tu correo electronico</label>
                <input type="email" className="input" placeholder="tu@correo.com" value={correoRecuperar} onChange={(e) => setCorreoRecuperar(e.target.value)} required />
                <button type="submit" className="boton boton-verde boton-ancho">ENVIAR CODIGO</button>
              </form>
            )}
            {pasoRecuperar === 2 && (
              <form onSubmit={async (e) => { e.preventDefault(); setMensaje('Verificando codigo...'); try { const res = await fetch('http://localhost:5001/api/verificar-codigo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ correo: correoRecuperar, codigo: codigoRecuperar }) }); const datos = await res.json(); setMensaje(datos.mensaje); if (datos.valido) setPasoRecuperar(3); } catch { setMensaje('Sin conexion con el servidor'); } }}>
                <label>Paso 2 de 3: Codigo enviado a {correoRecuperar}</label>
                <input type="text" className="input" placeholder="Escribe el codigo de 6 digitos" value={codigoRecuperar} onChange={(e) => setCodigoRecuperar(e.target.value)} required maxLength={6} />
                <button type="submit" className="boton boton-verde boton-ancho">VERIFICAR CODIGO</button>
                <button type="button" className="enlace" onClick={() => {setPasoRecuperar(1); setMensaje('');}}>Volver al correo</button>
              </form>
            )}
            {pasoRecuperar === 3 && (
              <form onSubmit={async (e) => { e.preventDefault(); if (nuevaContraseña !== confirmarContraseña) { setMensaje('Las contrasenas NO coinciden'); return; } const errores = validarContraseña(nuevaContraseña); if (errores.length > 0) { setMensaje('La contrasena NO cumple:\n' + errores.join('\n')); return; } try { const res = await fetch('http://localhost:5001/api/cambiar-contrasena', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ correo: correoRecuperar, codigo: codigoRecuperar, nuevaContraseña }) }); const datos = await res.json(); setMensaje(datos.mensaje); if (datos.ok) { setTimeout(() => { setPagina('login'); setMensaje('Contrasena actualizada. Inicia sesion'); setPasoRecuperar(1); setCorreoRecuperar(''); setCodigoRecuperar(''); setNuevaContraseña(''); setConfirmarContraseña(''); }, 1500); } } catch { setMensaje('Error de conexion'); } }}>
                <label>Paso 3 de 3: Escribe tu nueva contrasena</label>
                <div className="texto-ayuda"><strong>Requisitos:</strong><ul><li>Minimo 8 caracteres</li><li>Al menos una MAYUSCULA</li><li>Al menos un caracter especial</li></ul></div>
                <label>Nueva contrasena</label>
                <div className="input-con-icono">
                  <input type={verNueva ? 'text' : 'password'} className="input" placeholder="Nueva contrasena" value={nuevaContraseña} onChange={(e) => setNuevaContraseña(e.target.value)} required />
                  <button type="button" className="boton-icono" onClick={() => setVerNueva(!verNueva)}>{verNueva ? 'O' : 'V'}</button>
                </div>
                <label>Confirmar contrasena</label>
                <div className="input-con-icono">
                  <input type={verConfirmar ? 'text' : 'password'} className="input" placeholder="Repite la contrasena" value={confirmarContraseña} onChange={(e) => setConfirmarContraseña(e.target.value)} required />
                  <button type="button" className="boton-icono" onClick={() => setVerConfirmar(!verConfirmar)}>{verConfirmar ? 'O' : 'V'}</button>
                </div>
                <button type="submit" className="boton boton-verde boton-ancho">GUARDAR CONTRASENA</button>
                <button type="button" className="enlace" onClick={() => {setPasoRecuperar(2); setMensaje('');}}>Volver al codigo</button>
              </form>
            )}
            {mensaje && <p className="mensaje">{mensaje}</p>}
            <div className="enlaces">
              <button className="enlace enlace-gris" onClick={() => { setPagina('login'); setMensaje(''); setPasoRecuperar(1); setCorreoRecuperar(''); setCodigoRecuperar(''); setNuevaContraseña(''); setConfirmarContraseña(''); }}>Volver a Iniciar Sesion</button>
            </div>
          </main>
          <footer className="pie">contacto@birdwatch.com</footer>
        </>
      )}

      {/* ==================== DASHBOARD - ADMINISTRADOR ==================== */}
      {pagina === 'dashboard' && rolUsuario === 'Administrador' && !subPagina && (
        <>
          <header className="cabecera">
            <Logo />
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span className="badge-rol badge-admin">Administrador</span>
              <button className="boton boton-rojo" onClick={cerrarSesion}>Cerrar Sesion</button>
            </div>
          </header>
          <main className="contenido">
            <h1 className="titulo-principal">Panel de Administracion</h1>
            <p style={{ textAlign: 'center', fontSize: '16px', color: '#ffffff', marginBottom: '10px' }}>Bienvenido, <strong>{usuarioNombre}</strong></p>
            <p className="subtitulo">Tienes acceso total a todos los modulos</p>
            <div className="modulos">
              <div className="tarjeta modulo-card" onClick={() => irAModulo('parques')}>
                <h3>🌳 Parques</h3>
                <p>Crear parques y asignar administradores</p>
                <button className="boton boton-verde">INGRESAR</button>
              </div>
              <div className="tarjeta modulo-card" onClick={() => irAModulo('avistamientos')}>
                <h3>🦜 Avistamientos</h3>
                <p>Crear, editar y eliminar avistamientos</p>
                <button className="boton boton-verde">INGRESAR</button>
              </div>
              <div className="tarjeta modulo-card" onClick={() => irAModulo('foro')}>
                <h3>💬 Foro</h3>
                <p>Comparte y lee publicaciones de la comunidad</p>
                <button className="boton boton-verde">INGRESAR</button>
              </div>
              <div className="tarjeta modulo-card" onClick={() => irAModulo('usuarios')}>
                <h3>👥 Usuarios</h3>
                <p>Administrar todos los usuarios del sistema</p>
                <button className="boton boton-verde">INGRESAR</button>
              </div>
            </div>
            <div className="lista-usuarios-dashboard">
              <h2 className="titulo-seccion">🌳 Parques registrados ({listaParques.length})</h2>
              <div className="tarjeta">
                {listaParques.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No hay parques creados</p>
                ) : (
                  <div className="usuarios-grid">
                    {listaParques.map(p => (
                      <div key={p.id} className="usuario-item" onClick={() => editarParque(p)} style={{ cursor: 'pointer' }}>
                        <div className="usuario-avatar" style={{ backgroundColor: '#28a745' }}>{p.nombre.charAt(0).toUpperCase()}</div>
                        <div className="usuario-info">
                          <span className="usuario-nombre">{p.nombre}</span>
                          <span className="usuario-email">{p.direccion || 'Sin direccion'}</span>
                          <span className={`badge-rol badge-${p.adminAsignado ? 'parque' : 'visitante'}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                            {p.adminAsignado ? `Admin: ${p.adminAsignado}` : 'Sin admin asignado'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="lista-usuarios-dashboard">
              <h2 className="titulo-seccion">👥 Usuarios registrados ({listaUsuarios.length})</h2>
              <div className="conteo-roles">
                <span className="badge-rol badge-admin" style={{ fontSize: '12px' }}>Admin: {listaUsuarios.filter(u => u.rol === 'Administrador').length}</span>
                <span className="badge-rol badge-parque" style={{ fontSize: '12px' }}>Admin Parque: {listaUsuarios.filter(u => u.rol === 'Administrador de Parque').length}</span>
                <span className="badge-rol badge-visitante" style={{ fontSize: '12px' }}>Visitantes: {listaUsuarios.filter(u => u.rol === 'Visitante' || u.rol === 'Sin rol').length}</span>
              </div>
              <div className="tarjeta">
                <div className="usuarios-grid">
                  {listaUsuarios.map(u => (
                    <div key={u.id} className="usuario-item">
                      <div className="usuario-avatar">{u.nombres.charAt(0).toUpperCase()}</div>
                      <div className="usuario-info">
                        <span className="usuario-nombre">{u.nombres}</span>
                        <span className="usuario-email">{u.correo}</span>
                        <span className={`badge-rol badge-${u.rol === 'Administrador' ? 'admin' : u.rol === 'Administrador de Parque' ? 'parque' : 'visitante'}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                          {u.rol === 'Administrador de Parque' ? 'Admin Parque' : u.rol}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
          <footer className="pie">contacto@birdwatch.com</footer>
        </>
      )}

      {/* ==================== DASHBOARD - ADMINISTRADOR DE PARQUE ==================== */}
      {pagina === 'dashboard' && rolUsuario === 'Administrador de Parque' && !subPagina && (
        <>
          <header className="cabecera">
            <Logo />
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span className="badge-rol badge-parque">Admin de Parque</span>
              <button className="boton boton-rojo" onClick={cerrarSesion}>Cerrar Sesion</button>
            </div>
          </header>
          <main className="contenido">
            <h1 className="titulo-principal">Panel de Administrador de Parque</h1>
            <p style={{ textAlign: 'center', fontSize: '16px', color: '#ffffff', marginBottom: '10px' }}>Bienvenido, <strong>{usuarioNombre}</strong></p>
            {miParque ? (
              <>
                <div className="parque-info-banner">
                  <h2>{miParque.nombre}</h2>
                  <p>{miParque.descripcion}</p>
                  <div className="parque-datos">
                    <span>📍 {miParque.direccion}</span>
                    <span>🕐 {miParque.horario}</span>
                    {miParque.telefono && <span>📞 {miParque.telefono}</span>}
                    {miParque.email && <span>📧 {miParque.email}</span>}
                  </div>
                </div>
                <p className="subtitulo">Gestiona las actividades de tu parque</p>
                <div className="modulos modulos-restringidos">
                  <div className="tarjeta modulo-card" onClick={() => irAModulo('avistamientos')}>
                    <h3>🦜 Avistamientos</h3>
                    <p>Registrar y gestionar avistamientos del parque</p>
                    <button className="boton boton-verde">INGRESAR</button>
                  </div>
                  <div className="tarjeta modulo-card" onClick={() => irAModulo('foro')}>
                    <h3>💬 Foro</h3>
                    <p>Participa y lee las publicaciones del foro</p>
                    <button className="boton boton-verde">INGRESAR</button>
                  </div>
                  <div className="tarjeta modulo-card" onClick={() => irAModulo('usuarios')}>
                    <h3>👥 Usuarios</h3>
                    <p>Ver usuarios registrados del parque</p>
                    <button className="boton boton-verde">INGRESAR</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="tarjeta" style={{ maxWidth: '500px', margin: '30px auto', textAlign: 'center', padding: '40px' }}>
                <h3 style={{ color: '#dc3545', marginBottom: '10px' }}>Sin parque asignado</h3>
                <p style={{ color: '#666' }}>El Administrador principal aun no te ha asignado un parque. Espera a que se asigne uno.</p>
              </div>
            )}
          </main>
          <footer className="pie">contacto@birdwatch.com</footer>
        </>
      )}

      {/* ==================== DASHBOARD - VISITANTE ==================== */}
      {pagina === 'dashboard' && rolUsuario === 'Visitante' && !subPagina && (
        <>
          <header className="cabecera">
            <Logo />
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span className="badge-rol badge-visitante">Visitante</span>
              <button className="boton boton-rojo" onClick={cerrarSesion}>Cerrar Sesion</button>
            </div>
          </header>
          <main className="contenido">
            <h1 className="titulo-principal">Bienvenido, {usuarioNombre}</h1>
            <p className="subtitulo">Explora los avistamientos de aves y participa en el foro</p>
            <div className="modulos modulos-restringidos">
              <div className="tarjeta modulo-card" onClick={() => irAModulo('avistamientos')}>
                <h3>🦜 Avistamientos</h3>
                <p>Consulta los avistamientos de aves registrados</p>
                <button className="boton boton-verde">VER</button>
              </div>
              <div className="tarjeta modulo-card" onClick={() => irAModulo('foro')}>
                <h3>💬 Foro</h3>
                <p>Consulta los reportes disponibles</p>
                <button className="boton boton-verde">VER</button>
              </div>
            </div>
          </main>
          <footer className="pie">contacto@birdwatch.com</footer>
        </>
      )}

      {/* ==================== SUB-PAGINA: PARQUES (solo Admin) ==================== */}
      {pagina === 'dashboard' && subPagina === 'parques' && rolUsuario === 'Administrador' && (
        <>
          <header className="cabecera">
            <Logo />
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span className="badge-rol badge-admin">Administrador</span>
              <button className="boton boton-blanco" onClick={volverAlDashboard}>Inicio</button>
              <button className="boton boton-rojo" onClick={cerrarSesion}>Salir</button>
            </div>
          </header>
          <main className="contenido">
            <h1 className="titulo-principal">🌳 Gestion de Parques</h1>
            <p className="subtitulo">Crea parques y asigna un administrador de parque a cada uno</p>
            {mensaje && <p className="mensaje" style={{ marginBottom: '15px' }}>{mensaje}</p>}
            <div className="tabla-contenedor">
              <h3 style={{ color: '#0F6E3C', marginBottom: '15px' }}>{parqueEditId ? 'Editar Parque' : 'Crear Nuevo Parque'}</h3>
              <form onSubmit={guardarParque}>
                <label>Nombre del Parque *</label>
                <input type="text" className="input" placeholder="Ej: Zoologico Santa Cruz" value={parqueNombre} onChange={(e) => setParqueNombre(e.target.value)} required />
                <label>Descripcion</label>
                <textarea className="input textarea-parque" placeholder="Describe el parque, su mision, lo que ofrece..." value={parqueDescripcion} onChange={(e) => setParqueDescripcion(e.target.value)} rows={3} />
                <label>Direccion</label>
                <input type="text" className="input" placeholder="Ej: Carrera 5 # 10-20" value={parqueDireccion} onChange={(e) => setParqueDireccion(e.target.value)} />
                <label>Horario de Atencion</label>
                <input type="text" className="input" placeholder="Ej: Lunes a Domingo 8:00 AM - 5:00 PM" value={parqueHorario} onChange={(e) => setParqueHorario(e.target.value)} />
                <label>Telefono</label>
                <input type="tel" className="input" placeholder="Ej: 300 123 4567" value={parqueTelefono} onChange={(e) => setParqueTelefono(e.target.value)} />
                <label>Correo del Parque</label>
                <input type="email" className="input" placeholder="Ej: info@zoo.com" value={parqueEmail} onChange={(e) => setParqueEmail(e.target.value)} />
                <label>Admin de Parque (correo del usuario)</label>
                <input type="email" className="input" placeholder="correo del admin de parque" value={parqueAdmin} onChange={(e) => setParqueAdmin(e.target.value)} />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="boton boton-verde boton-ancho">{parqueEditId ? 'ACTUALIZAR' : 'CREAR PARQUE'}</button>
                  {parqueEditId && <button type="button" className="boton boton-rojo boton-ancho" onClick={limpiarFormularioParque}>CANCELAR</button>}
                </div>
              </form>
            </div>
            <div className="tabla-contenedor" style={{ marginTop: '25px' }}>
              <h3 style={{ color: '#0F6E3C', marginBottom: '15px' }}>Parques Existentes ({listaParques.length})</h3>
              {listaParques.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No hay parques creados aun</p>
              ) : (
                <table className="tabla-usuarios">
                  <thead>
                    <tr><th>Nombre</th><th>Direccion</th><th>Horario</th><th>Admin Asignado</th><th>Acciones</th></tr>
                  </thead>
                  <tbody>
                    {listaParques.map(p => (
                      <tr key={p.id}>
                        <td><strong>{p.nombre}</strong></td>
                        <td>{p.direccion || '-'}</td>
                        <td>{p.horario || '-'}</td>
                        <td>
                          {p.adminAsignado ? (
                            <span className="badge-rol badge-parque" style={{ fontSize: '11px', padding: '3px 8px' }}>{p.adminAsignado}</span>
                          ) : (
                            <span style={{ color: '#999', fontSize: '13px' }}>Sin asignar</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                            <button className="boton boton-blanco" style={{ padding: '5px 10px', fontSize: '12px' }} onClick={() => editarParque(p)}>Editar</button>
                            <button className="boton boton-rojo" style={{ padding: '5px 10px', fontSize: '12px' }} onClick={() => eliminarParque(p.id)}>Eliminar</button>
                            <select className="input select-rol" style={{ padding: '4px 8px', fontSize: '11px', marginBottom: 0 }}
                              value={p.adminAsignado || ''} onChange={(e) => asignarAdminParque(p.id, e.target.value)}>
                              <option value="">Asignar admin...</option>
                              {listaUsuarios.filter(u => u.rol === 'Administrador de Parque').map(u => (
                                <option key={u.id} value={u.correo}>{u.nombres} ({u.correo})</option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </main>
          <footer className="pie">contacto@birdwatch.com</footer>
        </>
      )}

      {/* ==================== SUB-PAGINA: CREAR/EDITAR PARQUE ==================== */}
      {pagina === 'dashboard' && subPagina === 'crear-parque' && rolUsuario === 'Administrador' && (
        <>
          <header className="cabecera">
            <Logo />
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span className="badge-rol badge-admin">Administrador</span>
              <button className="boton boton-blanco" onClick={() => { volverAlDashboard(); limpiarFormularioParque(); }}>Inicio</button>
              <button className="boton boton-rojo" onClick={cerrarSesion}>Salir</button>
            </div>
          </header>
          <main className="contenido">
            <h1 className="titulo-principal">{parqueEditId ? '✏️ Editar Parque' : '🌳 Crear Parque'}</h1>
            {mensaje && <p className="mensaje">{mensaje}</p>}
            <div className="tabla-contenedor" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <form onSubmit={guardarParque}>
                <label>Nombre del Parque *</label>
                <input type="text" className="input" placeholder="Nombre del parque" value={parqueNombre} onChange={(e) => setParqueNombre(e.target.value)} required />
                <label>Descripcion</label>
                <textarea className="input textarea-parque" placeholder="Descripcion del parque" value={parqueDescripcion} onChange={(e) => setParqueDescripcion(e.target.value)} rows={3} />
                <label>Direccion</label>
                <input type="text" className="input" placeholder="Direccion" value={parqueDireccion} onChange={(e) => setParqueDireccion(e.target.value)} />
                <label>Horario</label>
                <input type="text" className="input" placeholder="Horario de atencion" value={parqueHorario} onChange={(e) => setParqueHorario(e.target.value)} />
                <label>Telefono</label>
                <input type="tel" className="input" placeholder="Telefono" value={parqueTelefono} onChange={(e) => setParqueTelefono(e.target.value)} />
                <label>Correo</label>
                <input type="email" className="input" placeholder="Correo del parque" value={parqueEmail} onChange={(e) => setParqueEmail(e.target.value)} />
                <label>Admin de Parque (correo)</label>
                <input type="email" className="input" placeholder="Correo del admin de parque" value={parqueAdmin} onChange={(e) => setParqueAdmin(e.target.value)} />
                <button type="submit" className="boton boton-verde boton-ancho">{parqueEditId ? 'ACTUALIZAR' : 'CREAR'}</button>
              </form>
            </div>
          </main>
          <footer className="pie">contacto@birdwatch.com</footer>
        </>
      )}

      {/* ==================== SUB-PAGINA: AVISTAMIENTOS ==================== */}
      {pagina === 'dashboard' && subPagina === 'avistamientos' && (
        <>
          <header className="cabecera">
            <Logo />
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span className={`badge-rol ${badgeClass}`}>{rolUsuario === 'Administrador de Parque' ? 'Admin de Parque' : rolUsuario}</span>
              <button className="boton boton-blanco" onClick={volverAlDashboard}>Inicio</button>
              <button className="boton boton-rojo" onClick={cerrarSesion}>Salir</button>
            </div>
          </header>
          <main className="contenido">
            <h1 className="titulo-principal">🦜 Avistamientos</h1>
            <p className="subtitulo">{rolUsuario === 'Visitante' ? 'Consulta los avistamientos de aves registrados' : 'Registra y gestiona los avistamientos de aves'}</p>
            {mensaje && <p className="mensaje" style={{ marginBottom: '15px' }}>{mensaje}</p>}

            {rolUsuario !== 'Visitante' && (
              <div className="tabla-contenedor" style={{ maxWidth: '700px', margin: '0 auto 25px' }}>
                <h3 style={{ color: '#0F6E3C', marginBottom: '15px' }}>{avistamientoEditId ? '✏️ Editar Avistamiento' : '🆕 Registrar un Ave'}</h3>
                <form onSubmit={guardarAvistamiento}>
                  <label>Nombre del Ave *</label>
                  <input type="text" className="input" placeholder="Ej: Tucán Pico de Arcoíris" value={avistamientoNombre} onChange={(e) => setAvistamientoNombre(e.target.value)} required />
                  <label>Especie</label>
                  <input type="text" className="input" placeholder="Ej: Ramphastos sulfuratus" value={avistamientoEspecie} onChange={(e) => setAvistamientoEspecie(e.target.value)} />
                  <label>Foto del Ave</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="text" className="input" placeholder="Pega una URL de la imagen" value={avistamientoFoto && avistamientoFoto.startsWith('data:') ? '' : avistamientoFoto} onChange={(e) => setAvistamientoFoto(e.target.value)} />
                    <label className="boton boton-blanco" style={{ cursor: 'pointer', margin: 0, whiteSpace: 'nowrap', textAlign: 'center' }}>
                      📁 Subir
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={procesarImagen} />
                    </label>
                  </div>
                  {avistamientoFoto && (
                    <img src={avistamientoFoto} alt="Vista previa" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '10px', marginTop: '10px', border: '1px solid #ddd' }} />
                  )}
                  <label>Parque</label>
                  {rolUsuario === 'Administrador de Parque' ? (
                    <div className="input" style={{ background: '#f0f0f0', color: '#333' }}>{miParque ? miParque.nombre : 'Sin parque asignado'}</div>
                  ) : (
                    <select className="input select-rol" value={avistamientoParqueId} onChange={(e) => setAvistamientoParqueId(e.target.value)}>
                      <option value="">Selecciona un parque</option>
                      {listaParques.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                  )}
                  <label>Fecha del Avistamiento *</label>
                  <input type="date" className="input" value={avistamientoFecha} onChange={(e) => setAvistamientoFecha(e.target.value)} required />
                  <label>Descripcion / Observaciones</label>
                  <textarea className="input textarea-parque" rows={3} placeholder="Describe dónde y cómo fue el avistamiento..." value={avistamientoDescripcion} onChange={(e) => setAvistamientoDescripcion(e.target.value)} />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" className="boton boton-verde boton-ancho">{avistamientoEditId ? 'ACTUALIZAR' : 'REGISTRAR AVE'}</button>
                    {avistamientoEditId && <button type="button" className="boton boton-rojo boton-ancho" onClick={limpiarFormularioAvistamiento}>CANCELAR</button>}
                  </div>
                </form>
              </div>
            )}

            <div className="tabla-contenedor">
              <h3 style={{ color: '#0F6E3C', marginBottom: '15px' }}>Avistamientos registrados ({listaAvistamientos.length})</h3>
              {listaAvistamientos.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>Aun no hay avistamientos registrados</p>
              ) : (
                <table className="tabla-usuarios">
                  <thead>
                    <tr>
                      <th>Ave</th>
                      <th>Especie</th>
                      <th>Parque</th>
                      <th>Fecha</th>
                      <th>Registrado por</th>
                      {rolUsuario !== 'Visitante' && <th>Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {listaAvistamientos.map(av => (
                      <tr key={av.id}>
                        <td>
                          {av.fotoUrl ? (
                            <img src={av.fotoUrl} alt={av.nombreAve} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', marginRight: '8px', verticalAlign: 'middle' }} />
                          ) : '🐦 '}
                          <strong>{av.nombreAve}</strong>
                        </td>
                        <td>{av.especie || '-'}</td>
                        <td>{av.parqueNombre || '-'}</td>
                        <td>{av.fecha || '-'}</td>
                        <td>{av.registradoPor || '-'}</td>
                        {rolUsuario !== 'Visitante' && (
                          <td>
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <button className="boton boton-blanco" style={{ padding: '5px 10px', fontSize: '12px' }} onClick={() => editarAvistamiento(av)}>Editar</button>
                              <button className="boton boton-rojo" style={{ padding: '5px 10px', fontSize: '12px' }} onClick={() => eliminarAvistamiento(av.id)}>Eliminar</button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </main>
          <footer className="pie">contacto@birdwatch.com</footer>
        </>
      )}

      {/* ==================== SUB-PAGINA: FORO ==================== */}
      {pagina === 'dashboard' && subPagina === 'foro' && (
        <>
          <header className="cabecera">
            <Logo />
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span className={`badge-rol ${badgeClass}`}>{rolUsuario === 'Administrador de Parque' ? 'Admin de Parque' : rolUsuario}</span>
              <button className="boton boton-blanco" onClick={volverAlDashboard}>Inicio</button>
              <button className="boton boton-rojo" onClick={cerrarSesion}>Salir</button>
            </div>
          </header>
          <main className="contenido">
            <h1 className="titulo-principal">💬 Foro BIRDWATCH</h1>
            <p className="subtitulo">Comparte tus avistamientos, dudas y experiencias con la comunidad</p>
            {mensaje && <p className="mensaje" style={{ marginBottom: '15px' }}>{mensaje}</p>}

            <div className="tabla-contenedor" style={{ maxWidth: '700px', margin: '0 auto 25px' }}>
              <h3 style={{ color: '#0F6E3C', marginBottom: '15px' }}>🆕 Nueva Publicación</h3>
              <form onSubmit={publicarEnForo}>
                <label>Título *</label>
                <input type="text" className="input" placeholder="Ej: Vi un colibrí en el parque..." value={foroTitulo} onChange={(e) => setForoTitulo(e.target.value)} required />
                <label>Mensaje *</label>
                <textarea className="input textarea-parque" rows={4} placeholder="Cuéntanos qué viste, dónde fue, qué te llamó la atención..." value={foroContenido} onChange={(e) => setForoContenido(e.target.value)} required />
                <button type="submit" className="boton boton-verde boton-ancho">PUBLICAR</button>
              </form>
            </div>

            <div className="tabla-contenedor">
              <h3 style={{ color: '#0F6E3C', marginBottom: '15px' }}>Publicaciones ({listaPublicaciones.length})</h3>
              {listaPublicaciones.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>Aun no hay publicaciones. ¡Sé el primero en escribir!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {listaPublicaciones.map(p => (
                    <div key={p.id} className="tarjeta" style={{ padding: '18px', borderLeft: '4px solid #28a745' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ color: '#0F6E3C', fontSize: '17px' }}>{p.titulo}</strong>
                        {(p.autorCorreo === correoUsuario || rolUsuario === 'Administrador') && (
                          <button className="boton boton-rojo" style={{ padding: '5px 10px', fontSize: '12px' }} onClick={() => eliminarPublicacion(p.id)}>Eliminar</button>
                        )}
                      </div>
                      <p style={{ color: '#333', whiteSpace: 'pre-wrap', marginBottom: '10px' }}>{p.contenido}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                        <span>👤 {p.autor}</span>
                        <span>🕐 {formatearFecha(p.fechaPublicacion)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
          <footer className="pie">contacto@birdwatch.com</footer>
        </>
      )}

      {/* ==================== SUB-PAGINA: USUARIOS ==================== */}
      {pagina === 'dashboard' && subPagina === 'usuarios' && (rolUsuario === 'Administrador' || rolUsuario === 'Administrador de Parque') && (
        <>
          <header className="cabecera">
            <Logo />
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span className={`badge-rol ${badgeClass}`}>{rolUsuario === 'Administrador de Parque' ? 'Admin de Parque' : rolUsuario}</span>
              <button className="boton boton-blanco" onClick={volverAlDashboard}>Inicio</button>
              <button className="boton boton-rojo" onClick={cerrarSesion}>Salir</button>
            </div>
          </header>
          <main className="contenido">
            <h1 className="titulo-principal">👥 Usuarios</h1>
            <p className="subtitulo">{rolUsuario === 'Administrador' ? 'Administra todos los usuarios del sistema' : 'Consulta los usuarios del parque'}</p>
            {mensaje && <p className="mensaje" style={{ marginBottom: '15px' }}>{mensaje}</p>}

            {rolUsuario === 'Administrador' && usuarioEditId && (
              <div className="tabla-contenedor" style={{ maxWidth: '600px', margin: '0 auto 25px' }}>
                <h3 style={{ color: '#0F6E3C', marginBottom: '15px' }}>✏️ Editar Usuario</h3>
                <form onSubmit={guardarUsuario}>
                  <label>Nombres y Apellidos *</label>
                  <input type="text" className="input" value={usuarioEditNombres} onChange={(e) => setUsuarioEditNombres(e.target.value)} required />
                  <label>Correo Electronico *</label>
                  <input type="email" className="input" value={usuarioEditCorreo} onChange={(e) => setUsuarioEditCorreo(e.target.value)} required />
                  <label>Documento</label>
                  <input type="text" className="input" value={usuarioEditDocumento} onChange={(e) => setUsuarioEditDocumento(e.target.value)} />
                  <label>Contacto</label>
                  <input type="tel" className="input" value={usuarioEditContacto} onChange={(e) => setUsuarioEditContacto(e.target.value)} />
                  <label>Direccion</label>
                  <input type="text" className="input" value={usuarioEditDireccion} onChange={(e) => setUsuarioEditDireccion(e.target.value)} />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" className="boton boton-verde boton-ancho">GUARDAR CAMBIOS</button>
                    <button type="button" className="boton boton-rojo boton-ancho" onClick={cerrarEditarUsuario}>CANCELAR</button>
                  </div>
                </form>
              </div>
            )}

            <div className="tabla-contenedor">
              <table className="tabla-usuarios">
                <thead>
                  <tr><th>Nombre</th><th>Correo</th><th>Documento</th><th>Rol</th>
                    {rolUsuario === 'Administrador' && <th>Cambiar rol</th>}
                    {rolUsuario === 'Administrador' && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {listaUsuarios.map(u => (
                    <tr key={u.id}>
                      <td>{u.nombres}</td><td>{u.correo}</td><td>{u.documento}</td>
                      <td><span className={`badge-rol badge-${u.rol === 'Administrador' ? 'admin' : u.rol === 'Administrador de Parque' ? 'parque' : 'visitante'}`} style={{ fontSize: '11px', padding: '3px 10px' }}>{u.rol === 'Administrador de Parque' ? 'Admin Parque' : u.rol}</span></td>
                      {rolUsuario === 'Administrador' && (
                        <td><select className="input select-rol" value={u.rol} onChange={(e) => cambiarRol(u.correo, e.target.value)} style={{ padding: '6px 10px', fontSize: '13px', marginBottom: 0 }}>
                          <option value="Administrador">Administrador</option>
                          <option value="Administrador de Parque">Admin de Parque</option>
                          <option value="Visitante">Visitante</option>
                        </select></td>
                      )}
                      {rolUsuario === 'Administrador' && (
                        <td>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button className="boton boton-blanco" style={{ padding: '5px 10px', fontSize: '12px' }} onClick={() => abrirEditarUsuario(u)}>Editar</button>
                            <button className="boton boton-rojo" style={{ padding: '5px 10px', fontSize: '12px' }} onClick={() => eliminarUsuario(u.id, u.correo)} disabled={u.correo === correoUsuario}>{u.correo === correoUsuario ? 'Tú' : 'Eliminar'}</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
          <footer className="pie">contacto@birdwatch.com</footer>
        </>
      )}
    </div>
  );
}

export default App;
