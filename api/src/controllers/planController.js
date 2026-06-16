const { Plan } = require('../models/index');

const getAll = async (req, res) => {
  try {
    const planes = await Plan.findAll();
    res.json(planes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener planes' });
  }
};

const create = async (req, res) => {
  try {
    const { nombre, descripcion, precio, duracionDias } = req.body;
    if (!nombre || !precio || !duracionDias)
      return res.status(400).json({ error: 'Nombre, precio y duracionDias son requeridos' });
    const plan = await Plan.create({ nombre, descripcion, precio, duracionDias });
    res.status(201).json(plan);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
const update = async (req, res) => {
  try {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan no encontrado' });
    await plan.update(req.body);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar plan' });
  }
};

const remove = async (req, res) => {
  try {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan no encontrado' });
    await plan.destroy();
    res.json({ mensaje: 'Plan eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar plan' });
  }
};

module.exports = { getAll, create, update, remove };