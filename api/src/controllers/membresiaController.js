const { Membresia, Socio } = require('../models/index');

const getBySocio = async (req, res) => {
  try {
    const membresias = await Membresia.findAll({ where: { socioId: req.params.socioId } });
    res.json(membresias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { socioId, tipo, fechaInicio, fechaVencimiento, precio } = req.body;
    if (!socioId || !tipo || !fechaInicio || !fechaVencimiento || !precio)
      return res.status(400).json({ error: 'Todos los campos son requeridos' });

    const socio = await Socio.findByPk(socioId);
    if (!socio) return res.status(404).json({ error: 'Socio no encontrado' });

    const membresia = await Membresia.create({ socioId, tipo, fechaInicio, fechaVencimiento, precio });
    res.status(201).json(membresia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verificarVigencia = async (req, res) => {
  try {
    const { socioId } = req.params;
    const hoy = new Date().toISOString().split('T')[0];
    const membresia = await Membresia.findOne({
      where: { socioId, activo: true },
      order: [['fechaVencimiento', 'DESC']]
    });

    if (!membresia)
      return res.status(422).json({ error: 'El socio no tiene membresía activa' });

    if (membresia.fechaVencimiento < hoy)
      return res.status(422).json({ error: 'La membresía está vencida', vencimiento: membresia.fechaVencimiento });

    res.json({ vigente: true, vencimiento: membresia.fechaVencimiento });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getBySocio, create, verificarVigencia };