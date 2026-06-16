const validarSocio = (req, res, next) => {
  const { nombre, rut, email } = req.body;
  const errores = [];

  if (!nombre || nombre.trim().length < 2)
    errores.push('El nombre debe tener al menos 2 caracteres');

  if (!rut || !/^\d{7,8}-[\dkK]$/.test(rut))
    errores.push('RUT inválido (formato: 12345678-9)');

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errores.push('Email inválido');

  if (errores.length > 0)
    return res.status(400).json({ error: 'Datos inválidos', detalles: errores });

  next();
};

const validarClase = (req, res, next) => {
  const { nombre, instructor, horario, capacidad, dia } = req.body;
  const errores = [];

  if (!nombre || nombre.trim().length < 2)
    errores.push('El nombre debe tener al menos 2 caracteres');

  if (!instructor || instructor.trim().length < 2)
    errores.push('El instructor debe tener al menos 2 caracteres');

  if (!horario) errores.push('El horario es requerido');
  if (!dia) errores.push('El día es requerido');

  if (!capacidad || isNaN(capacidad) || Number(capacidad) < 1)
    errores.push('La capacidad debe ser un número mayor a 0');

  if (errores.length > 0)
    return res.status(400).json({ error: 'Datos inválidos', detalles: errores });

  next();
};

const validarAuth = (req, res, next) => {
  const { email, password } = req.body;
  const errores = [];

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errores.push('Email inválido');

  if (!password || password.length < 6)
    errores.push('La contraseña debe tener al menos 6 caracteres');

  if (errores.length > 0)
    return res.status(400).json({ error: 'Datos inválidos', detalles: errores });

  next();
};

module.exports = { validarSocio, validarClase, validarAuth };