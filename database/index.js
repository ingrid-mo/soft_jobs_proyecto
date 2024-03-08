const express = require('express');
const app = express();
const cors = require('cors');
const { getUsuarios, deleteUsuarios, verificarCredenciales, createUser } = require('./consultas');
const jwt = require("jsonwebtoken");

const llaveSecreta = "mi_llave_secreta"; 

app.listen(3000, () => {
    console.log("SERVER ON");
});

app.use(cors());
app.use(express.json());

app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await getUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(error.code || 500).send(error);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificarCredenciales(email, password);
        const payload = { email };
        const token = jwt.sign(payload, llaveSecreta);
        res.send(token);
    } catch (error) {
        console.error(error);
        res.status(error.code || 500).send(error);
    }
});

app.delete("/usuario/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const Authorization = req.header("Authorization");
        const token = Authorization.split("Bearer ")[1];
        jwt.verify(token, llaveSecreta); 
        const { email } = jwt.decode(token);
        await deleteUsuarios(id);
        res.send(`El usuario ${email} ha eliminado el usuario de id ${id}`);
    } catch (error) {
        console.error(error);
        res.status(error.code || 500).send(error);
    }
});

app.post('/registrarse', async (req, res) => {
    try {
        const { nombre, apellido, email, password } = req.body; 
        await createUser({ nombre, apellido, email, password }); 
        const payload = { email };
        const token = jwt.sign(payload, llaveSecreta);
        res.send(token);
    } catch (error) {
        console.error(error);
        res.status(error.code || 500).send(error);
    }
});
