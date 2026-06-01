const app = require('./app');
const { sequelize } = require('./src/models/index');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa');
    await sequelize.sync({ force: false });
    console.log('✅ Tablas sincronizadas');
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar:', error);
  }
}

main();