import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useRef } from "react";
import Header from "../header/Header";
import "./account.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authFetch } from "../../services/authFetch";
import { AuthContext } from "../../services/authContext/Auth.context";
import { getUserClaims } from "../../services/jwtClaims";

const Account = ({ handleLogout }) => {
  const { token } = useContext(AuthContext);
  let emailFromToken = "";
  if (token) {
    const claims = getUserClaims(token);
    emailFromToken = claims?.email || "";
  }

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    estatura: "",
    peso: "",
    telefono: "",
    correo: emailFromToken,
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (token) {
      authFetch(`/Users/me`)
        .then((res) => res.json())
        .then((data) => {
          setFormData((prev) => ({
            ...prev,
            nombre: data.name || "",
            apellido: "",
            edad: data.age ?? "",
            estatura: data.height ?? "",
            peso: data.weight ?? "",
            telefono: data.phone || "",
            correo: data.email || emailFromToken,
          }));
        })
        .catch(() => {
          toast.error("No se pudo cargar la información del usuario");
        });
    }
      // load avatar from localStorage (temporary storage)
      try {
        const stored = localStorage.getItem('account_avatar');
        if (stored) setAvatar(stored);
      } catch (e) { console.warn('load avatar failed', e); }
  }, [token, emailFromToken]);

    const handleAvatarPick = () => {
      if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleAvatarChange = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        setAvatar(dataUrl);
        try { localStorage.setItem('account_avatar', dataUrl); } catch (e) { console.warn('store avatar failed', e); }
      };
      reader.readAsDataURL(file);
    };

    const handleRemoveAvatar = () => {
      setAvatar(null);
      try { localStorage.removeItem('account_avatar'); } catch (e) { console.warn('remove avatar failed', e); }
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (formData.edad && (isNaN(formData.edad) || Number(formData.edad) <= 0 || Number(formData.edad) > 120))
      errors.push("La edad debe ser un número entre 1 y 120.");
    if (formData.estatura && (isNaN(formData.estatura) || Number(formData.estatura) < 50 || Number(formData.estatura) > 300))
      errors.push("La estatura debe ser un número entre 50 y 300 cm.");
    if (formData.peso && (isNaN(formData.peso) || Number(formData.peso) < 20 || Number(formData.peso) > 400))
      errors.push("El peso debe ser un número entre 20 y 400 kg.");
    if (formData.telefono && !/^\d{6,15}$/.test(formData.telefono))
      errors.push("El teléfono debe contener solo números (6 a 15 dígitos).");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(msg => toast.error(msg));
      return;
    }
    try {
      const res = await authFetch(
        `/Users/me`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.nombre,
            age: formData.edad === "" ? null : Number(formData.edad),
            height: formData.estatura === "" ? null : Number(formData.estatura),
            weight: formData.peso === "" ? null : Number(formData.peso),
            phone: formData.telefono || null
          }),
        }
      );
      if (res.ok) {
        toast.success("Datos guardados correctamente");
      } else {
        const text = await res.text().catch(() => "");
        let msg = text;
        try { msg = JSON.parse(text)?.message || text; } catch { /* plain text */ }
        toast.error(msg || "Error al guardar los datos");
      }
    } catch {
      toast.error("Error de conexión con el servidor");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (
      !passwordData.password ||
      !passwordData.newPassword ||
      !passwordData.confirmNewPassword
    ) {
      toast.error("Complete todos los campos de contraseña");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    try {
      const res = await authFetch(
        `/Users/me/password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: passwordData.password,
            newPassword: passwordData.newPassword,
          }),
        }
      );
      if (res.ok) {
        toast.success("Contraseña actualizada correctamente");
        setPasswordData({
          password: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        const text = await res.text().catch(() => "");
        let msg = text;
        try { msg = JSON.parse(text)?.message || text; } catch { /* plain text */ }
        toast.error(msg || "Error al cambiar la contraseña");
      }
    } catch {
      toast.error("Error de conexión con el servidor");
    }
  };

  return (
    <>
      <Header onLogout={handleLogout} />
      <div className="account-page">
        <div className="account-container">
          <div className="account-grid">
            <div className="profile-panel">
              <div className="avatar-container">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="avatar-img" />
                ) : (
                  <div className="avatar">{(formData.nombre || 'U').charAt(0).toUpperCase()}</div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" style={{display: 'none'}} onChange={handleAvatarChange} />
                <div className="avatar-overlay">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={handleAvatarPick}
                    aria-label="Subir avatar"
                    title="Subir avatar"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={handleRemoveAvatar}
                    aria-label="Eliminar avatar"
                    title="Eliminar avatar"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="profile-name">{`${formData.nombre || ''} ${formData.apellido || ''}`.trim() || 'Usuario'}</div>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="label">Edad</span>
                  <span className="value">{formData.edad || '-'}</span>
                </div>
                <div className="stat-item">
                  <span className="label">Altura</span>
                  <span className="value">{formData.estatura ? `${formData.estatura} cm` : '-'}</span>
                </div>
                <div className="stat-item">
                  <span className="label">Peso</span>
                  <span className="value">{formData.peso ? `${formData.peso} kg` : '-'}</span>
                </div>
              </div>
            </div>

            <div className="form-panel">
                <h3 className="mb-4 account-title">Datos de la Cuenta</h3>
                <Form onSubmit={handleSubmit} className="account-form">
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          placeholder="Ingrese su nombre"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Edad</Form.Label>
                        <Form.Control
                          type="number"
                          name="edad"
                          value={formData.edad}
                          onChange={handleChange}
                          placeholder="Ingrese su edad"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Peso (kg)</Form.Label>
                        <Form.Control
                          type="number"
                          name="peso"
                          value={formData.peso}
                          onChange={handleChange}
                          placeholder="Ingrese su peso"
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Estatura (cm)</Form.Label>
                        <Form.Control
                          type="number"
                          name="estatura"
                          value={formData.estatura}
                          onChange={handleChange}
                          placeholder="Ingrese su estatura"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                          type="text"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          placeholder="Ingrese su teléfono"
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      name="correo"
                      value={formData.correo}
                      readOnly
                    />
                  </Form.Group>
                  <div className="account-actions">
                    <Button className="btn-primary-custom" type="submit">
                      Guardar
                    </Button>
                    <Button className="btn-secondary-custom" type="button" onClick={() => window.location.reload()}>
                      Cancelar
                    </Button>
                  </div>
                </Form>

                {/* Password now opens in a modal to avoid long card height */}
                <div style={{marginTop:12}}>
                  <Button variant="link" className="password-toggle" onClick={() => setShowPasswordModal(true)}>
                    Cambiar contraseña
                  </Button>
                </div>

                <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered contentClassName="modal-dark">
                  <Modal.Header closeButton style={{backgroundColor: 'rgba(20, 22, 25, 0.95)', borderColor: 'rgba(255, 255, 255, 0.18)', color: '#fff'}}>
                    <Modal.Title style={{color: '#fff'}}>Cambiar contraseña</Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{backgroundColor: 'rgba(20, 22, 25, 0.95)', color: '#fff'}}>
                    <Form onSubmit={(e) => { handlePasswordSubmit(e); setShowPasswordModal(false); }}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{color: '#fff'}}>Contraseña actual</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={passwordData.password}
                          onChange={handlePasswordChange}
                          placeholder="Ingrese su contraseña actual"
                          autoComplete="current-password"
                          style={{backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#fff', borderColor: 'rgba(255, 255, 255, 0.2)'}}
                          className="modal-password-input"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label style={{color: '#fff'}}>Nueva contraseña</Form.Label>
                        <Form.Control
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Ingrese la nueva contraseña"
                          autoComplete="new-password"
                          style={{backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#fff', borderColor: 'rgba(255, 255, 255, 0.2)'}}
                          className="modal-password-input"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label style={{color: '#fff'}}>Repetir nueva contraseña</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmNewPassword"
                          value={passwordData.confirmNewPassword}
                          onChange={handlePasswordChange}
                          placeholder="Repita la nueva contraseña"
                          autoComplete="new-password"
                          style={{backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#fff', borderColor: 'rgba(255, 255, 255, 0.2)'}}
                          className="modal-password-input"
                        />
                      </Form.Group>
                      <div className="account-actions">
                        <Button className="btn-primary-custom" type="submit">
                          Cambiar contraseña
                        </Button>
                        <Button className="btn-secondary-custom" type="button" onClick={() => setPasswordData({password:'',newPassword:'',confirmNewPassword:''})}>
                          Limpiar
                        </Button>
                      </div>
                    </Form>
                  </Modal.Body>
                </Modal>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Account;
