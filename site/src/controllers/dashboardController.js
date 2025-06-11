var dashboardModel = require('../models/dashboardModel');

function usuariosPorEstado(req, res) {
    dashboardModel.getUsuariosPorEstado()
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum usuário por estado encontrado!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar usuários por estado: ", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || { message: "Erro interno do servidor." });
        });
}

function dadosGeraisUsuarios(req, res) {
    dashboardModel.getDadosGeraisUsuarios()
        .then(function ([usuariosPorRegiaoResult, totalGeralUsuariosResult]) {
            if (usuariosPorRegiaoResult.length > 0 || totalGeralUsuariosResult.length > 0) { 
                res.status(200).json({
                    usuariosPorRegiao: usuariosPorRegiaoResult,
                    totalGeralUsuarios: totalGeralUsuariosResult[0] ? totalGeralUsuariosResult[0].total_geral_usuarios : 0
                });
            } else {
                res.status(204).send("Nenhum dado geral de usuários encontrado!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar dados gerais de usuários: ", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || { message: "Erro interno do servidor." });
        });
}


function kpisUsuario(req, res) {
    const idUsuario = req.params.idUsuario; 

    dashboardModel.getKpisUsuario(idUsuario)
        .then(function (resultado) {
            if (resultado) { 
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum KPI para o usuário encontrado ou usuário não existe!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar KPIs do usuário: ", erro); 
            res.status(500).json({ message: "Erro ao buscar KPIs do usuário.", error: erro });
        });
}

//funcões chamadas
module.exports = {
    usuariosPorEstado,
    dadosGeraisUsuarios,
    kpisUsuario
};