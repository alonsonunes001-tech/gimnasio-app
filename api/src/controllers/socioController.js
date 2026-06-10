const { Socio, Plan } = require('../models/index');

const getAll = async (req, res) => {
  try {
    const socios = await Socio.findAll({ include: [{ model: Plan, as: 'plan' }] });
    res.json(socios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener socios' });
  }
};
const create = async (req, res) => {
  try {
    const { nombre, rut, email, telefono, planId } = req.body;
    if (!nombre || !email || !rut)
      return res.status(400).json({ error: 'Nombre, RUT y email son requeridos' });
    const socio = await Socio.create({ 
      nombre, rut, email, telefono,
      planId: planId || null
    });
    res.status(201).json(socio);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError')
      return res.status(409).json({ error: 'El email o RUT ya está registrado' });
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
const update = async (req, res) => {
  try {
    const socio = await Socio.findByPk(req.params.id);
    if (!socio) return res.status(404).json({ error: 'Socio no encontrado' });
    const datos = { ...req.body, planId: req.body.planId || null };
    await socio.update(datos);
    res.json(socio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const socio = await Socio.findByPk(req.params.id);
    if (!socio) return res.status(404).json({ error: 'Socio no encontrado' });
    await socio.destroy();
    res.json({ mensaje: 'Socio eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar socio' });
  }
};

module.exports = { getAll, create, update, remove };