CREATE DATABASE maximal;

USE maximal;

CREATE TABLE usuario(
	idUsuario INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(45),
	email VARCHAR(50),
	senha VARCHAR(12),
    perfil VARCHAR(255),
    fkRegiao INT,
    FOREIGN KEY fkLocalizacao (fkLocalizacao)
    REFERENCES localizacao (idLocalizacao)
);

CREATE TABLE hospital (
	idHospital INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(45),
	descricao VARCHAR(100),
	fkRegiao INT,
    FOREIGN KEY fkLocalizacao (fkLocalizacao)
    REFERENCES localizacao (idLocalizacao)
);

CREATE TABLE localizacao (
	idLocalizacao INT PRIMARY KEY AUTO_INCREMENT,
	cidade VARCHAR(45),
	estado VARCHAR(45),
    regiao VARCHAR(45)
);

CREATE TABLE classificacao (
	idClassificacao INT PRIMARY KEY AUTO_INCREMENT,
	tipo VARCHAR(10),
    CONSTRAINT chk_tipo
		CHECK ( tipo('ajuda', 'adocao', 'doacao', 'aleatorio'))
);

CREATE TABLE publicacao (
	idPublicacao INT,
	descricao TEXT,
	imagem VARCHAR(255),
	dataHora DATETIME DEFAULT CURRENT_TIMESTAMP,
    fkUsuario INT,
    fkClassificacao INT,
    FOREIGN KEY fkClassificacao(fkClassificacao)
    REFERENCES classificacao (idClassificacao),
    FOREIGN KEY fkUsuario(fkUsuario)
    REFERENCES usuario (idUsuario)
);

CREATE TABLE comentario (
	idComentario INT,
    texto VARCHAR(120),
    dataHora DATETIME DEFAULT CURRENT_TIMESTAMP,
    fkPublicacao INT,
    fkSecundario INT,
    fkUsuario INT,
    FOREIGN KEY fkPublicacao(fkPublicacao)
    REFERENCES publicacao (idPublicacao),
	FOREIGN KEY fkUsuario(fkUsuario)
    REFERENCES usuario (idUsuario),
	FOREIGN KEY fkSecundario(fkSecundario)
    REFERENCES comentario (fkSecundario),
    PRIMARY KEY pkComposta (idComentario, fkUsuario, fkPublicacao)
);