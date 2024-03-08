const express = require('express');
const app = express();
const cors = require('cors');
const { getEventos, deleteEvento, verificarCredenciales } = require('./consultas');

const jwt = require("jsonwebtoken");



const token = jwt.sign(payload, llaveSecreta);

app.listen(3000, () => {
    console.log("SERVER ON");
});

app.use(cors());
app.use(express.json());

app.get("/eventos", async (req, res) => {
    try {
        const eventos = await getEventos();
        res.json(eventos);
    } catch (error) {
        res.status(error.code || 500).send(error);
    }
});


app.post("/login", async (req, res) => {
    try {
        const { email, password, rol, lenguaje } = req.body;
        await verificarCredenciales(email, password , rol, lenguaje);
        const payload = { email }; 
        const llaveSecreta = "mi_llave_secreta"; 
        const token = jwt.sign(payload, llaveSecreta);
        res.send(token);
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(error);
    }
});
app.delete("/eventos/:id", async (req, res) => {
    try {
    const { id } = req.params
    const Authorization = req.header("Authorization")
     token = Authorization.split("Bearer ")[1]
    jwt.verify(token, "az_AZ")
const { email } = jwt.decode(token)
await deleteEvento(id)
res.send(`El usuario ${email} ha eliminado el evento de id ${id}`)

    console.log(token)
    } catch (error) {
    res.status(error.code || 500).send(error)
    }
    })
    