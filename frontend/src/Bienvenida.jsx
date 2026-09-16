import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Bienvenida() {
  const [usuario, setUsuario] = useState(null);
  const [modulos, setModulos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener datos del usuario que inició sesión
    const correoGuardado = localStorage.getItem('correoUsuario');
    if (!correoGuardado) {
      navigate('/'); // Si no hay sesión, volver al inicio
      return;
    }

    // Pedir datos al servidor
    fetch('http://localhost:5001/api/verificar-sesion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: correoGuardado })
    })
    .then(res => res.json())
    .then(datos => {
      if (datos.ok) {
        setUsuario(datos.usuario);
        setModulos(datos.modulos);
      } else {
        navigate('/');
      }
    });
  }, [navigate]);

  // Cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem('correoUsuario');
    navigate('/');
  };

  if (!usuario) return <div style={{padding:'2rem'}}>Cargando...</div>;

  return (
    <div style={{padding:'2rem', maxWidth:'1000px', margin:'0 auto'}}>
      
      {/* Encabezado */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'3rem'}}>
        <div>
          <h1>¡Bienvenido, {usuario.nombres}! 🦜</h1>
          <p>Selecciona un módulo para comenzar</p>
        </div>
        <button 
          onClick={cerrarSesion}
          style={{padding:'0.6rem 1.2rem', background:'#dc3545', color:'white', border:'none', borderRadius:'8px', cursor:'pointer'}}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Tarjetas de Módulos */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2rem'}}>
        {modulos.map(modulo => (
          <div 
            key={modulo.id}
            style={{
              padding:'2rem',
              background:'#f0f8ff',
              borderRadius:'12px',
              textAlign:'center',
              cursor:'pointer',
              boxShadow:'0 4px 8px rgba(0,0,0,0.1)',
              transition:'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h2 style={{fontSize:'1.5rem', marginBottom:'1rem'}}>{modulo.nombre}</h2>
            <p style={{color:'#555', marginBottom:'1.5rem'}}>{modulo.descripcion}</p>
            <button 
              style={{
                padding:'0.7rem 1.5rem',
                background:'#28a745',
                color:'white',
                border:'none',
                borderRadius:'8px',
                fontSize:'1rem',
                cursor:'pointer'
              }}
            >
              INGRESAR →
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Bienvenida;