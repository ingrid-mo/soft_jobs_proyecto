const { Pool } = require('pg');
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'vida_sana',
    allowExitOnIdle: true
});

const getUsuarios = async () => {
    const { rows: usuarios } = await pool.query("SELECT * FROM usuarios");
    return usuarios;
};

const deleteUsuarios = async (id) => {
    const consulta = "DELETE FROM usuarios WHERE id = $1";
    const values = [id];
    const { rowCount } = await pool.query(consulta, values);
    if (!rowCount) throw { code: 404, message: "Usuario no encontrado" };
};

const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1";
    const values = [email];
    const { rows } = await pool.query(consulta, values);
    const user = rows[0];
    if (!user) throw { code: 404, message: "Usuario no encontrado" };
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw { code: 401, message: "Credenciales inválidas" };
};

const createUser = async ({ nombre, apellido, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const SQLquery = {
        text: "INSERT INTO usuarios (nombre, apellido, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
        values: [nombre, apellido, email, hashedPassword],
    };
    const response = await pool.query(SQLquery);
    return response.rows[0];
};

module.exports = { getUsuarios, deleteUsuarios, verificarCredenciales, createUser };S