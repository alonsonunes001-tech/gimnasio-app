const { Clase } = require('../models/index');

const getAll = async (req, res) => {
  try {
    const { dia } = req.query;
    const where = dia ? { dia } : {};
    const clases = await Clase.findAll({ where });
    res.json(clases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { nombre, instructor, horario, capacidad, dia } = req.body;
    if (!nombre || !instructor || !horario || !capacidad || !dia)
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    const clase = await Clase.create({ nombre, instructor, horario, capacidad, dia });
    res.status(201).json(clase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const clase = await Clase.findByPk(req.params.id);
    if (!clase) return res.status(404).json({ error: 'Clase no encontrada' });
    await clase.update(req.body);
    res.json(clase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const clase = await Clase.findByPk(req.params.id);
    if (!clase) return res.status(404).json({ error: 'Clase no encontrada' });
    await clase.destroy();
    res.json({ mensaje: 'Clase eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const inscribir = async (req, res) => {
  try {
    const clase = await Clase.findByPk(req.params.id);
    if (!clase) return res.status(404).json({ error: 'Clase no encontrada' });

    if (clase.inscritos >= clase.capacidad)
      return res.status(409).json({ error: 'Cupo lleno, no se puede inscribir' });

    await clase.update({ inscritos: clase.inscritos + 1 });
    res.json({ mensaje: 'Inscripción exitosa', inscritos: clase.inscritos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, create, update, remove, inscribir };