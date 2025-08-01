var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");


//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/usuarios-por-estado", function (req, res) {
    dashboardController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

module.exports = router;