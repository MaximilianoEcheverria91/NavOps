import { useState } from "react";

const usuario = {
  nombre: "Carmen Díaz",
  rol: "Oficial de cubierta",
  legajo: "NAV-008",
  antiguedad: "6 años",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop", // URL de ejemplo
};

export default function ModalEliminarUsuario() {
  const [visible, setVisible] = useState(true);
  const [eliminado, setEliminado] = useState(false);

  const handleEliminar = () => {
    setEliminado(true);
    setTimeout(() => {
      setVisible(false);
    }, 1800);
  };

  const handleCancelar = () => {
    setVisible(false);
  };

  if (!visible) {
    return (
      <div style={styles.page}>
        <p style={styles.cerrado}>
          {eliminado ? "✓ Usuario eliminado correctamente." : "Operación cancelada."}
        </p>
        <button style={styles.reabrir} onClick={() => { setVisible(true); setEliminado(false); }}>
          Reabrir modal
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.overlay} onClick={handleCancelar}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          
          {/* Contenedor principal - Avatar + Info */}
          <div style={styles.headerContent}>
            
            {/* Avatar */}
            <div style={styles.avatarWrap}>
              {usuario.avatar ? (
                <img src={usuario.avatar} alt={usuario.nombre} style={styles.avatarImg} />
              ) : (
                <span style={styles.avatarInitials}>
                  {usuario.nombre.split(" ").map((n) => n[0]).join("")}
                </span>
              )}
            </div>

            {/* Info Usuario - Derecha */}
            <div style={styles.infoContent}>
              <h2 style={styles.nombre}>{usuario.nombre}</h2>
              <p style={styles.rol}>{usuario.rol}</p>

              <div style={styles.meta}>
                <span style={styles.metaItem}>
                  <svg style={styles.metaIcon} viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="5" r="3" stroke="#888" strokeWidth="1.4" />
                    <path d="M2 13c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke="#888" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  Legajo:<strong>{usuario.legajo}</strong>
                </span>
                <span style={styles.metaItem}>
                  <svg style={styles.metaIcon} viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="#888" strokeWidth="1.4" />
                    <path d="M8 5v3.5l2 2" stroke="#888" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {usuario.antiguedad}
                </span>
              </div>
            </div>
          </div>

          <hr style={styles.divider} />

          <p style={styles.pregunta}>
            ¿Estas seguro de que quieres eliminar este Usuario?
          </p>

          <hr style={styles.dividerBottom} />

          {/* Botones */}
          <div style={styles.acciones}>
            <button style={styles.btnCancelar} onClick={handleCancelar}>
              Cancelar
            </button>
            <button style={styles.btnEliminar} onClick={handleEliminar}>
              {eliminado ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#F8FBFD",
    fontFamily: "'Segoe UI', sans-serif",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(183, 210, 224, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  modal: {
    background: "#F8FBFD",
    borderRadius: "18px",
    padding: "2rem 2.25rem 1.5rem",
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 8px 40px rgba(183,210,224,0.55)",
    border: "1px solid #B7D2E0",
    animation: "fadeIn 0.2s ease",
  },
  headerContent: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  avatarWrap: {
    minWidth: 90,
    width: 90,
    height: 90,
    borderRadius: "50%",
    overflow: "hidden",
    border: "3.5px solid #57B8F4",
    background: "#EDF6FD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarInitials: {
    fontSize: 30,
    fontWeight: 600,
    color: "#57B8F4",
  },
  infoContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  nombre: {
    fontSize: 24,
    fontWeight: 600,
    color: "#1a2533",
    margin: "0 0 4px",
    textAlign: "left",
  },
  rol: {
    fontSize: 14,
    color: "#57B8F4",
    margin: "0 0 14px",
    textAlign: "left",
    fontWeight: 500,
  },
  meta: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#6b7a8d",
  },
  metaIcon: {
    width: 15,
    height: 15,
  },
  divider: {
    width: "100%",
    border: "none",
    borderTop: "2px solid #E0E8F0",
    margin: "0 0 20px",
  },
  pregunta: {
    fontSize: 16,
    fontWeight: 600,
    color: "#1a2533",
    textAlign: "center",
    margin: "0 0 20px",
    lineHeight: 1.5,
  },
  dividerBottom: {
    width: "100%",
    border: "none",
    borderTop: "2px solid #E0E8F0",
    margin: "0 0 20px",
  },
  acciones: {
    display: "flex",
    gap: 14,
    width: "100%",
  },
  btnCancelar: {
    flex: 1,
    padding: "12px 0",
    borderRadius: 8,
    border: "none",
    background: "#A8BCC8",
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.15s",
  },
  btnEliminar: {
    flex: 1,
    padding: "12px 0",
    borderRadius: 8,
    border: "none",
    background: "#FF0000",
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.15s, transform 0.1s",
  },
  cerrado: {
    fontSize: 16,
    color: "#4a5568",
    marginBottom: 12,
  },
  reabrir: {
    padding: "8px 20px",
    borderRadius: 8,
    background: "#57B8F4",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
  },
};