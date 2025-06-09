export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
export const validatePassword = (password) => {
  if (password.trim() === "") return "La contraseña está vacía";
  if (password.length < 6)
    return "La contraseña debe tener al menos 6 caracteres";
  if (!/[A-Z]/.test(password)) return "Debe tener al menos una letra mayúscula";
  if (!/[a-z]/.test(password)) return "Debe tener al menos una letra minúscula";
  if (!/\d/.test(password)) return "Debe tener al menos un número";
  return "";
};
