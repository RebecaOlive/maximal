var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/usuarios-por-estado", dashboardController.usuariosPorEstado);

router.get("/dados-gerais-usuarios", dashboardController.dadosGeraisUsuarios);

router.get("/kpis-usuario/:idUsuario", dashboardController.kpisUsuario);

module.exports = router;