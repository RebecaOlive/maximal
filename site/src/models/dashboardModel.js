var database = require("../database/config")

function getUsuariosPorEstado() {
  console.log("Acessando o model para obter usuários por estado...");
  var instrucaoSql = `
      SELECT l.estado AS nome_estado,
        COUNT(u.idUsuario) AS total_usuarios
        FROM usuario AS u
        JOIN localizacao AS l ON u.fkLocalizacao = l.idLocalizacao
        GROUP BY l.estado;
  `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

//quantidade de usuários
function getDadosGeraisUsuarios() {
  console.log("Acessando o model para obter dados gerais de usuários...");
  var instrucaoSqlUsuariosPorRegiao = `
      SELECT l.regiao AS nome_regiao,
          COUNT(u.idUsuario) AS total_usuarios_regiao
          FROM
          usuario AS u
          JOIN localizacao AS l ON u.fkLocalizacao = l.idLocalizacao
      GROUP BY
          l.regiao;
  `;

  var instrucaoSqlTotalGeralUsuarios = `
      SELECT COUNT(idUsuario) AS total_geral_usuarios FROM usuario;
  `;

  // Retorna uma Promise que resolve com os resultados de ambas as consultas
  return Promise.all([
      database.executar(instrucaoSqlUsuariosPorRegiao),
      database.executar(instrucaoSqlTotalGeralUsuarios)
  ]);
}


function getKpisUsuario(idUsuario) {
  console.log("Acessando o model para obter KPIs do usuário:", idUsuario);
  var instrucaoSqlUserInfo = `
      SELECT
          u.fkLocalizacao,
          l.estado,
          l.regiao
          FROM usuario AS u
        JOIN localizacao AS l ON u.fkLocalizacao = l.idLocalizacao
      WHERE u.idUsuario = ${idUsuario};
  `;

  return database.executar(instrucaoSqlUserInfo)
      .then(userInfo => {
          if (userInfo.length === 0) {
              return Promise.reject("Usuário não encontrado.");
          }

          var { fkLocalizacao, estado, regiao } = userInfo[0];

          var instrucaoSqlDadosRegiao = `
              SELECT
                  (SELECT COUNT(u2.idUsuario) FROM usuario u2 JOIN localizacao l2 ON u2.fkLocalizacao = l2.idLocalizacao WHERE l2.regiao = '${regiao}') AS usuarios_na_minha_regiao,
                  (SELECT COUNT(idUsuario) FROM usuario) AS total_geral_usuarios;
          `;

          var instrucaoSqlTotalHospitais = `
              SELECT COUNT(h.idHospital) AS total_hospitais_no_estado
                FROM hospital AS h
                JOIN localizacao AS l ON h.fkLocalizacao = l.idLocalizacao
                WHERE l.estado = '${estado}';
          `;

          return Promise.all([
              database.executar(instrucaoSqlDadosRegiao),
              database.executar(instrucaoSqlTotalHospitais)
          ]).then(([dadosRegiaoResult, totalHospitaisResult]) => {
              var usuariosNaMinhaRegiao = dadosRegiaoResult[0].usuarios_na_minha_regiao;
              var totalGeralUsuarios = dadosRegiaoResult[0].total_geral_usuarios;
              var porcentagemRegiao = totalGeralUsuarios > 0 ? (usuariosNaMinhaRegiao / totalGeralUsuarios) * 100 : 0;

              return {
                  porcentagemRegiao: porcentagemRegiao.toFixed(2),
                  totalHospitaisNoEstado: totalHospitaisResult[0].total_hospitais_no_estado
              };
          });
      });
}

module.exports = {
  getUsuariosPorEstado,
  getDadosGeraisUsuarios,
  getKpisUsuario
};
