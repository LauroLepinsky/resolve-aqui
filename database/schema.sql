-- Resolve Aqui: modelo do banco de dados relacional
-- Compatível com PostgreSQL. No protótipo, estas tabelas são simuladas
-- no localStorage do navegador (ver js/data.js).
CREATE TABLE bairro (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE
);
CREATE TABLE categoria (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(60) NOT NULL UNIQUE
);
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    senha_hash CHAR(64) NOT NULL,
    -- SHA-256 no protótipo; usar bcrypt/argon2 em produção
    bairro_id INT NOT NULL REFERENCES bairro(id),
    perfil VARCHAR(10) NOT NULL DEFAULT 'municipe' CHECK (perfil IN ('municipe', 'gestor')),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE reclamacao (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuario(id),
    categoria_id INT NOT NULL REFERENCES categoria(id),
    bairro_id INT NOT NULL REFERENCES bairro(id),
    titulo VARCHAR(80) NOT NULL,
    descricao VARCHAR(1000) NOT NULL,
    endereco VARCHAR(120) NOT NULL,
    foto_url VARCHAR(255),
    -- no protótipo, a foto fica no próprio navegador
    -- 'pendente' e 'recusada' são anteriores à publicação: só aparecem
    -- para o autor e para a ouvidoria
    status VARCHAR(12) NOT NULL DEFAULT 'pendente' CHECK (
        status IN (
            'pendente',
            'recusada',
            'aberta',
            'em_analise',
            'em_execucao',
            'resolvida'
        )
    ),
    motivo_recusa VARCHAR(80),
    detalhe_recusa VARCHAR(300),
    validado_por INT REFERENCES usuario(id),
    validado_em TIMESTAMP,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        status <> 'recusada'
        OR motivo_recusa IS NOT NULL
    )
);
CREATE TABLE comentario (
    id SERIAL PRIMARY KEY,
    reclamacao_id INT NOT NULL REFERENCES reclamacao(id) ON DELETE CASCADE,
    usuario_id INT NOT NULL REFERENCES usuario(id),
    texto VARCHAR(500) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Cada munícipe pode apoiar uma reclamação apenas uma vez
CREATE TABLE apoio (
    reclamacao_id INT NOT NULL REFERENCES reclamacao(id) ON DELETE CASCADE,
    usuario_id INT NOT NULL REFERENCES usuario(id),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (reclamacao_id, usuario_id)
);
-- Registro de cada mudança de status, exibido como linha do tempo
CREATE TABLE historico_status (
    id SERIAL PRIMARY KEY,
    reclamacao_id INT NOT NULL REFERENCES reclamacao(id) ON DELETE CASCADE,
    status VARCHAR(12) NOT NULL,
    observacao VARCHAR(300),
    -- explicação da ouvidoria para os moradores
    usuario_id INT REFERENCES usuario(id),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_reclamacao_bairro ON reclamacao(bairro_id);
CREATE INDEX idx_reclamacao_categoria ON reclamacao(categoria_id);
CREATE INDEX idx_reclamacao_status ON reclamacao(status);
-- ---------- Dados iniciais ----------
INSERT INTO categoria (nome)
VALUES ('Buraco na via'),
    ('Iluminação pública'),
    ('Coleta de lixo'),
    ('Calçada danificada'),
    ('Esgoto e bueiros'),
    ('Mato alto e terrenos'),
    ('Sinalização de trânsito'),
    ('Outros');
-- Bairros de Itapetininga conforme a base de CEPs dos Correios
INSERT INTO bairro (nome)
VALUES ('Área Rural de Itapetininga'),
    ('Bairro Biscoito Duro'),
    ('Bairro do Moquem'),
    ('Bairro do Porto'),
    ('Bairro do Porto Velho'),
    ('Bairro do Quaresma'),
    ('Bairro do Retiro'),
    ('Bairro Ponte Alta'),
    ('Bairro Turvo dos Rodrigues'),
    ('Cambuí'),
    ('Canta Galo'),
    ('Capão Alto'),
    ('Central Parque 4-L'),
    ('Centro'),
    ('Chácara Barro Branco'),
    ('Chácaras Alvorada'),
    ('Chapada Grande'),
    ('Chapadinha'),
    ('Conceição'),
    ('Conjunto Habitacional Itapetininga F3'),
    ('Conjunto Habitacional Nisshinbo do Brasil'),
    ('Curuça I'),
    ('Curuça II'),
    ('Curuça III'),
    ('Estância Conceição'),
    ('Faxinal do Rio Acima'),
    ('Jardim Alvorada'),
    ('Jardim Bela Vista'),
    ('Jardim Brasil'),
    ('Jardim Casa Grande'),
    ('Jardim Colombo'),
    ('Jardim Cruzeiro do Sul'),
    ('Jardim das Flores'),
    ('Jardim das Laranjeiras'),
    ('Jardim das Palmas'),
    ('Jardim das Rosas'),
    ('Jardim Florestal'),
    ('Jardim Fogaça'),
    ('Jardim Itália'),
    ('Jardim Leonel'),
    ('Jardim Marabá'),
    ('Jardim Maria Luiza'),
    ('Jardim Maricota'),
    ('Jardim Mesquita'),
    ('Jardim Monte Santo'),
    ('Jardim Moraes Rosa'),
    ('Jardim Nova Aliança'),
    ('Jardim Nova Era'),
    ('Jardim Novo Aeroporto'),
    ('Jardim Paulista'),
    ('Jardim Santa Inêz'),
    ('Jardim São Camilo'),
    ('Jardim São Sebastião'),
    ('Jardim Shangri-lá'),
    ('Jardim Vieira de Moraes'),
    ('Jardim Yara'),
    ('Loteamento Gramado I'),
    ('Loteamento Gramado II'),
    ('Loteamento Jardim Esperança'),
    ('Loteamento Residencial Golden Ville'),
    ('Loteamento Residencial Lisboa'),
    ('Loteamento Residencial Nascentes'),
    ('Loteamento Residencial Reserva das Paineiras'),
    ('Loteamento Residencial Spazio Verde I'),
    ('Loteamento Residencial Spazio Verde II'),
    ('Loteamento Residencial Tivolli'),
    ('Mato Seco'),
    ('Morada do Sol'),
    ('Parque Atenas do Sul'),
    ('Parque da Lagoa'),
    ('Parque Itapê'),
    ('Parque São Bento'),
    ('Pinhal'),
    ('Portal da Figueira'),
    ('Portal dos Pinheiros I'),
    ('Portal dos Pinheiros II'),
    ('Portal dos Pinheiros III'),
    ('Rechan'),
    ('Residencial Flor de Lis'),
    ('Residencial Lago dos Ipês'),
    ('Residencial Morada dos Ipês'),
    ('Residencial Reserva da Mata'),
    ('Residencial Villaggio di Capri'),
    ('Retiro Santana'),
    ('Rio Acima'),
    ('Sabiaúna'),
    ('Terras de Santo Antônio'),
    ('Therezinha Piedade'),
    ('Tupy'),
    ('Vale San Fernando'),
    ('Varginha'),
    ('Vida Nova Itapetininga'),
    ('Vila Aliança'),
    ('Vila Alves'),
    ('Vila Aparecida'),
    ('Vila Apolo'),
    ('Vila Arruda'),
    ('Vila Asem'),
    ('Vila Aurora'),
    ('Vila Ayres'),
    ('Vila Barth'),
    ('Vila Belo Horizonte'),
    ('Vila Camarão'),
    ('Vila Carolina'),
    ('Vila Carvalho'),
    ('Vila Célia'),
    ('Vila Cubatão'),
    ('Vila Deyse'),
    ('Vila dos Bandeirantes'),
    ('Vila Eldorado'),
    ('Vila Esplanada'),
    ('Vila Francisca'),
    ('Vila Garrido'),
    ('Vila Ginez'),
    ('Vila Godói'),
    ('Vila Grace'),
    ('Vila Hungria'),
    ('Vila Itapetininga'),
    ('Vila José Salem'),
    ('Vila Judite'),
    ('Vila Kalil Halak'),
    ('Vila La Brunetti'),
    ('Vila Leonor'),
    ('Vila Luiz Antônio'),
    ('Vila Macia'),
    ('Vila Maciel'),
    ('Vila Maria'),
    ('Vila Maria Isabel'),
    ('Vila Mazarino'),
    ('Vila Mazzei'),
    ('Vila Monteiro'),
    ('Vila Nastri'),
    ('Vila Nova'),
    ('Vila Nova Itapetininga'),
    ('Vila Novo Horizonte'),
    ('Vila Olho D''Agua'),
    ('Vila Oliveira'),
    ('Vila Orestes'),
    ('Vila Palmeira'),
    ('Vila Piedade'),
    ('Vila Popular'),
    ('Vila Prado'),
    ('Vila Prestes'),
    ('Vila Progresso'),
    ('Vila Recreio'),
    ('Vila Regina'),
    ('Vila Reis'),
    ('Vila Rica'),
    ('Vila Rio Branco'),
    ('Vila Rocha'),
    ('Vila Rosa'),
    ('Vila Rubens'),
    ('Vila Salém'),
    ('Vila Santa Isabel'),
    ('Vila Santana'),
    ('Vila São Gonçalo'),
    ('Vila São José'),
    ('Vila São Pedro'),
    ('Vila Serafim'),
    ('Vila Sonia'),
    ('Vila Sottemo'),
    ('Vila Vendramini'),
    ('Vila Visaltino Gomes');
-- ---------- Consultas usadas pela aplicação ----------
-- Lista pública com total de apoios e comentários, filtrável por bairro
-- SELECT r.id, r.titulo, r.status, c.nome AS categoria, b.nome AS bairro, r.criado_em,
--        (SELECT COUNT(*) FROM apoio a WHERE a.reclamacao_id = r.id)      AS apoios,
--        (SELECT COUNT(*) FROM comentario m WHERE m.reclamacao_id = r.id) AS comentarios
--   FROM reclamacao r
--   JOIN categoria c ON c.id = r.categoria_id
--   JOIN bairro b    ON b.id = r.bairro_id
--  WHERE r.status NOT IN ('pendente', 'recusada')
--    AND (:bairro_id IS NULL OR r.bairro_id = :bairro_id)
--  ORDER BY r.criado_em DESC;
-- Fila de validação da ouvidoria
-- SELECT * FROM reclamacao WHERE status = 'pendente' ORDER BY criado_em;
-- Reclamações por bairro (painel)
-- SELECT b.nome, COUNT(r.id) AS total
--   FROM bairro b LEFT JOIN reclamacao r ON r.bairro_id = b.id
--  GROUP BY b.nome ORDER BY total DESC;