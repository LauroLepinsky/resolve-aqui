// Camada de dados do protótipo.
// Os dados ficam no localStorage do navegador, simulando o banco de dados
// descrito em database/schema.sql. Cada "tabela" é uma lista de objetos.

const DB_KEY = "resolveaqui_db_v3";
const SESSION_KEY = "resolveaqui_sessao";

const CATEGORIAS = [
	{ id: 1, nome: "Buraco na via" },
	{ id: 2, nome: "Iluminação pública" },
	{ id: 3, nome: "Coleta de lixo" },
	{ id: 4, nome: "Calçada danificada" },
	{ id: 5, nome: "Esgoto e bueiros" },
	{ id: 6, nome: "Mato alto e terrenos" },
	{ id: 7, nome: "Sinalização de trânsito" },
	{ id: 8, nome: "Outros" },
];

// Bairros de Itapetininga conforme a base de CEPs dos Correios (cepsbrasil.com.br).
const BAIRROS = [
	{ id: 1, nome: "Área Rural de Itapetininga" },
	{ id: 2, nome: "Bairro Biscoito Duro" },
	{ id: 3, nome: "Bairro do Moquem" },
	{ id: 4, nome: "Bairro do Porto" },
	{ id: 5, nome: "Bairro do Porto Velho" },
	{ id: 6, nome: "Bairro do Quaresma" },
	{ id: 7, nome: "Bairro do Retiro" },
	{ id: 8, nome: "Bairro Ponte Alta" },
	{ id: 9, nome: "Bairro Turvo dos Rodrigues" },
	{ id: 10, nome: "Cambuí" },
	{ id: 11, nome: "Canta Galo" },
	{ id: 12, nome: "Capão Alto" },
	{ id: 13, nome: "Central Parque 4-L" },
	{ id: 14, nome: "Centro" },
	{ id: 15, nome: "Chácara Barro Branco" },
	{ id: 16, nome: "Chácaras Alvorada" },
	{ id: 17, nome: "Chapada Grande" },
	{ id: 18, nome: "Chapadinha" },
	{ id: 19, nome: "Conceição" },
	{ id: 20, nome: "Conjunto Habitacional Itapetininga F3" },
	{ id: 21, nome: "Conjunto Habitacional Nisshinbo do Brasil" },
	{ id: 22, nome: "Curuça I" },
	{ id: 23, nome: "Curuça II" },
	{ id: 24, nome: "Curuça III" },
	{ id: 25, nome: "Estância Conceição" },
	{ id: 26, nome: "Faxinal do Rio Acima" },
	{ id: 27, nome: "Jardim Alvorada" },
	{ id: 28, nome: "Jardim Bela Vista" },
	{ id: 29, nome: "Jardim Brasil" },
	{ id: 30, nome: "Jardim Casa Grande" },
	{ id: 31, nome: "Jardim Colombo" },
	{ id: 32, nome: "Jardim Cruzeiro do Sul" },
	{ id: 33, nome: "Jardim das Flores" },
	{ id: 34, nome: "Jardim das Laranjeiras" },
	{ id: 35, nome: "Jardim das Palmas" },
	{ id: 36, nome: "Jardim das Rosas" },
	{ id: 37, nome: "Jardim Florestal" },
	{ id: 38, nome: "Jardim Fogaça" },
	{ id: 39, nome: "Jardim Itália" },
	{ id: 40, nome: "Jardim Leonel" },
	{ id: 41, nome: "Jardim Marabá" },
	{ id: 42, nome: "Jardim Maria Luiza" },
	{ id: 43, nome: "Jardim Maricota" },
	{ id: 44, nome: "Jardim Mesquita" },
	{ id: 45, nome: "Jardim Monte Santo" },
	{ id: 46, nome: "Jardim Moraes Rosa" },
	{ id: 47, nome: "Jardim Nova Aliança" },
	{ id: 48, nome: "Jardim Nova Era" },
	{ id: 49, nome: "Jardim Novo Aeroporto" },
	{ id: 50, nome: "Jardim Paulista" },
	{ id: 51, nome: "Jardim Santa Inêz" },
	{ id: 52, nome: "Jardim São Camilo" },
	{ id: 53, nome: "Jardim São Sebastião" },
	{ id: 54, nome: "Jardim Shangri-lá" },
	{ id: 55, nome: "Jardim Vieira de Moraes" },
	{ id: 56, nome: "Jardim Yara" },
	{ id: 57, nome: "Loteamento Gramado I" },
	{ id: 58, nome: "Loteamento Gramado II" },
	{ id: 59, nome: "Loteamento Jardim Esperança" },
	{ id: 60, nome: "Loteamento Residencial Golden Ville" },
	{ id: 61, nome: "Loteamento Residencial Lisboa" },
	{ id: 62, nome: "Loteamento Residencial Nascentes" },
	{ id: 63, nome: "Loteamento Residencial Reserva das Paineiras" },
	{ id: 64, nome: "Loteamento Residencial Spazio Verde I" },
	{ id: 65, nome: "Loteamento Residencial Spazio Verde II" },
	{ id: 66, nome: "Loteamento Residencial Tivolli" },
	{ id: 67, nome: "Mato Seco" },
	{ id: 68, nome: "Morada do Sol" },
	{ id: 69, nome: "Parque Atenas do Sul" },
	{ id: 70, nome: "Parque da Lagoa" },
	{ id: 71, nome: "Parque Itapê" },
	{ id: 72, nome: "Parque São Bento" },
	{ id: 73, nome: "Pinhal" },
	{ id: 74, nome: "Portal da Figueira" },
	{ id: 75, nome: "Portal dos Pinheiros I" },
	{ id: 76, nome: "Portal dos Pinheiros II" },
	{ id: 77, nome: "Portal dos Pinheiros III" },
	{ id: 78, nome: "Rechan" },
	{ id: 79, nome: "Residencial Flor de Lis" },
	{ id: 80, nome: "Residencial Lago dos Ipês" },
	{ id: 81, nome: "Residencial Morada dos Ipês" },
	{ id: 82, nome: "Residencial Reserva da Mata" },
	{ id: 83, nome: "Residencial Villaggio di Capri" },
	{ id: 84, nome: "Retiro Santana" },
	{ id: 85, nome: "Rio Acima" },
	{ id: 86, nome: "Sabiaúna" },
	{ id: 87, nome: "Terras de Santo Antônio" },
	{ id: 88, nome: "Therezinha Piedade" },
	{ id: 89, nome: "Tupy" },
	{ id: 90, nome: "Vale San Fernando" },
	{ id: 91, nome: "Varginha" },
	{ id: 92, nome: "Vida Nova Itapetininga" },
	{ id: 93, nome: "Vila Aliança" },
	{ id: 94, nome: "Vila Alves" },
	{ id: 95, nome: "Vila Aparecida" },
	{ id: 96, nome: "Vila Apolo" },
	{ id: 97, nome: "Vila Arruda" },
	{ id: 98, nome: "Vila Asem" },
	{ id: 99, nome: "Vila Aurora" },
	{ id: 100, nome: "Vila Ayres" },
	{ id: 101, nome: "Vila Barth" },
	{ id: 102, nome: "Vila Belo Horizonte" },
	{ id: 103, nome: "Vila Camarão" },
	{ id: 104, nome: "Vila Carolina" },
	{ id: 105, nome: "Vila Carvalho" },
	{ id: 106, nome: "Vila Célia" },
	{ id: 107, nome: "Vila Cubatão" },
	{ id: 108, nome: "Vila Deyse" },
	{ id: 109, nome: "Vila dos Bandeirantes" },
	{ id: 110, nome: "Vila Eldorado" },
	{ id: 111, nome: "Vila Esplanada" },
	{ id: 112, nome: "Vila Francisca" },
	{ id: 113, nome: "Vila Garrido" },
	{ id: 114, nome: "Vila Ginez" },
	{ id: 115, nome: "Vila Godói" },
	{ id: 116, nome: "Vila Grace" },
	{ id: 117, nome: "Vila Hungria" },
	{ id: 118, nome: "Vila Itapetininga" },
	{ id: 119, nome: "Vila José Salem" },
	{ id: 120, nome: "Vila Judite" },
	{ id: 121, nome: "Vila Kalil Halak" },
	{ id: 122, nome: "Vila La Brunetti" },
	{ id: 123, nome: "Vila Leonor" },
	{ id: 124, nome: "Vila Luiz Antônio" },
	{ id: 125, nome: "Vila Macia" },
	{ id: 126, nome: "Vila Maciel" },
	{ id: 127, nome: "Vila Maria" },
	{ id: 128, nome: "Vila Maria Isabel" },
	{ id: 129, nome: "Vila Mazarino" },
	{ id: 130, nome: "Vila Mazzei" },
	{ id: 131, nome: "Vila Monteiro" },
	{ id: 132, nome: "Vila Nastri" },
	{ id: 133, nome: "Vila Nova" },
	{ id: 134, nome: "Vila Nova Itapetininga" },
	{ id: 135, nome: "Vila Novo Horizonte" },
	{ id: 136, nome: "Vila Olho D'Agua" },
	{ id: 137, nome: "Vila Oliveira" },
	{ id: 138, nome: "Vila Orestes" },
	{ id: 139, nome: "Vila Palmeira" },
	{ id: 140, nome: "Vila Piedade" },
	{ id: 141, nome: "Vila Popular" },
	{ id: 142, nome: "Vila Prado" },
	{ id: 143, nome: "Vila Prestes" },
	{ id: 144, nome: "Vila Progresso" },
	{ id: 145, nome: "Vila Recreio" },
	{ id: 146, nome: "Vila Regina" },
	{ id: 147, nome: "Vila Reis" },
	{ id: 148, nome: "Vila Rica" },
	{ id: 149, nome: "Vila Rio Branco" },
	{ id: 150, nome: "Vila Rocha" },
	{ id: 151, nome: "Vila Rosa" },
	{ id: 152, nome: "Vila Rubens" },
	{ id: 153, nome: "Vila Salém" },
	{ id: 154, nome: "Vila Santa Isabel" },
	{ id: 155, nome: "Vila Santana" },
	{ id: 156, nome: "Vila São Gonçalo" },
	{ id: 157, nome: "Vila São José" },
	{ id: 158, nome: "Vila São Pedro" },
	{ id: 159, nome: "Vila Serafim" },
	{ id: 160, nome: "Vila Sonia" },
	{ id: 161, nome: "Vila Sottemo" },
	{ id: 162, nome: "Vila Vendramini" },
	{ id: 163, nome: "Vila Visaltino Gomes" },
];

const STATUS = {
	aberta: { rotulo: "Aberta", ordem: 1 },
	em_analise: { rotulo: "Em análise", ordem: 2 },
	em_execucao: { rotulo: "Em execução", ordem: 3 },
	resolvida: { rotulo: "Resolvida", ordem: 4 },
};

// Situações anteriores à publicação: toda reclamação nova passa pela
// validação da ouvidoria antes de aparecer para os outros moradores.
const STATUS_VALIDACAO = {
	pendente: { rotulo: "Aguardando validação" },
	recusada: { rotulo: "Recusada" },
};

const MOTIVOS_RECUSA = [
	"Reclamação duplicada",
	"Fora da competência da prefeitura",
	"Informações insuficientes para localizar o problema",
	"Linguagem ofensiva ou dados pessoais de terceiros",
];

const ehPublica = (r) => r.status in STATUS;

// Senhas dos usuários de demonstração (hash SHA-256 de "demo1234").
const HASH_DEMO =
	"0ead2060b65992dca4769af601a1b3a35ef38cfad2c2c465bb160ea764157c5d";

function diasAtras(dias, horas = 0) {
	const d = new Date();
	d.setDate(d.getDate() - dias);
	d.setHours(d.getHours() - horas);
	return d.toISOString();
}

function dadosIniciais() {
	return {
		proximoId: { usuario: 4, reclamacao: 10, comentario: 9, historico: 16 },
		usuarios: [
			{
				id: 1,
				nome: "Maria Aparecida Souza",
				email: "maria@demo.com",
				senha: HASH_DEMO,
				bairroId: 133,
				perfil: "municipe",
				criadoEm: diasAtras(40),
			},
			{
				id: 2,
				nome: "José Carlos Lima",
				email: "jose@demo.com",
				senha: HASH_DEMO,
				bairroId: 14,
				perfil: "municipe",
				criadoEm: diasAtras(25),
			},
			{
				id: 3,
				nome: "Ouvidoria Municipal",
				email: "gestor@demo.com",
				senha: HASH_DEMO,
				bairroId: 14,
				perfil: "gestor",
				criadoEm: diasAtras(60),
			},
		],
		reclamacoes: [
			{
				id: 1,
				usuarioId: 1,
				categoriaId: 1,
				bairroId: 133,
				titulo: "Buraco grande na Rua Procópio Augusto Ferreira",
				descricao:
					"Buraco de quase um metro em frente ao número 230. Dois carros já furaram o pneu nesta semana e à noite não dá para ver.",
				endereco: "Rua Procópio Augusto Ferreira, 230",
				status: "em_analise",
				criadoEm: diasAtras(12),
			},
			{
				id: 2,
				usuarioId: 2,
				categoriaId: 2,
				bairroId: 14,
				titulo: "Poste apagado há três semanas",
				descricao:
					"O poste da esquina da praça com a Rua Campos Salles está apagado. A rua fica totalmente escura e os moradores evitam passar por ali depois das 19h.",
				endereco: "Praça Duque de Caxias, esquina com a Rua Campos Salles",
				status: "aberta",
				criadoEm: diasAtras(9),
			},
			{
				id: 3,
				usuarioId: 1,
				categoriaId: 3,
				bairroId: 133,
				titulo: "Coleta de lixo não passou na terça",
				descricao:
					"O caminhão não passou na última terça e os sacos estão acumulando na calçada, atraindo cachorros.",
				endereco: "Rua Caetano Ianaconi, altura do 50",
				status: "resolvida",
				criadoEm: diasAtras(20),
			},
			{
				id: 4,
				usuarioId: 2,
				categoriaId: 4,
				bairroId: 149,
				titulo: "Calçada quebrada perto do ponto de ônibus",
				descricao:
					"Raízes de árvore levantaram a calçada ao lado do ponto de ônibus. Crianças e idosos tropeçam com frequência.",
				endereco:
					"Avenida Padre Dr. Antônio Brunetti, junto ao ponto de ônibus",
				status: "em_execucao",
				criadoEm: diasAtras(15),
			},
			{
				id: 5,
				usuarioId: 1,
				categoriaId: 6,
				bairroId: 39,
				titulo: "Terreno abandonado com mato alto",
				descricao:
					"Terreno vazio no meio do quarteirão com mato acima de um metro e entulho. Já apareceram escorpiões nas casas vizinhas.",
				endereco: "Rua Xavantes, lote vazio",
				status: "aberta",
				criadoEm: diasAtras(3),
			},
			{
				id: 6,
				usuarioId: 2,
				categoriaId: 5,
				bairroId: 14,
				titulo: "Bueiro entupido alaga a rua",
				descricao:
					"Sempre que chove o bueiro transborda e a água invade a calçada e a entrada das lojas.",
				endereco: "Rua Saldanha Marinho, perto da Rua Monsenhor Soares",
				status: "aberta",
				criadoEm: diasAtras(1, 5),
			},
			{
				id: 7,
				usuarioId: 2,
				categoriaId: 7,
				bairroId: 14,
				titulo: "Semáforo desligado na Rua Campos Salles",
				descricao:
					"O semáforo do cruzamento está desligado desde ontem à tarde. Os carros passam sem parar e é difícil atravessar a pé.",
				endereco: "Rua Campos Salles, cruzamento com a Rua Saldanha Marinho",
				status: "pendente",
				criadoEm: diasAtras(0, 6),
			},
			{
				id: 8,
				usuarioId: 1,
				categoriaId: 2,
				bairroId: 133,
				titulo: "Lâmpada do poste piscando a noite toda",
				descricao:
					"A lâmpada do poste em frente ao número 100 fica acendendo e apagando a noite inteira. Parece que vai queimar de vez.",
				endereco: "Rua Procópio Augusto Ferreira, em frente ao número 100",
				status: "pendente",
				criadoEm: diasAtras(0, 2),
			},
			{
				id: 9,
				usuarioId: 1,
				categoriaId: 1,
				bairroId: 133,
				titulo: "Buraco na Procópio continua aumentando",
				descricao:
					"O buraco em frente ao 230 está cada vez maior. Já virou uma cratera.",
				endereco: "Rua Procópio Augusto Ferreira, 230",
				status: "recusada",
				motivoRecusa: "Reclamação duplicada",
				detalheRecusa:
					'Este problema já está registrado em "Buraco grande na Rua Procópio Augusto Ferreira". Apoie a reclamação existente para reforçar o pedido.',
				validadoPor: 3,
				validadoEm: diasAtras(4),
				criadoEm: diasAtras(5),
			},
		],
		comentarios: [
			{
				id: 1,
				reclamacaoId: 1,
				usuarioId: 2,
				texto: "Passo por ali todo dia, está cada vez maior.",
				criadoEm: diasAtras(10),
			},
			{
				id: 2,
				reclamacaoId: 1,
				usuarioId: 3,
				texto: "A equipe de obras fará vistoria no local até sexta-feira.",
				criadoEm: diasAtras(8),
			},
			{
				id: 3,
				reclamacaoId: 2,
				usuarioId: 1,
				texto:
					"Na minha rua aconteceu o mesmo, demoraram um mês para trocar a lâmpada.",
				criadoEm: diasAtras(7),
			},
			{
				id: 4,
				reclamacaoId: 3,
				usuarioId: 3,
				texto: "Coleta normalizada. A rota foi ajustada.",
				criadoEm: diasAtras(17),
			},
			{
				id: 5,
				reclamacaoId: 3,
				usuarioId: 1,
				texto: "Confirmo, voltou a passar. Obrigada.",
				criadoEm: diasAtras(16),
			},
			{
				id: 6,
				reclamacaoId: 4,
				usuarioId: 1,
				texto: "Minha mãe caiu nesse trecho mês passado.",
				criadoEm: diasAtras(13),
			},
			{
				id: 7,
				reclamacaoId: 5,
				usuarioId: 2,
				texto: "Também vi escorpião na minha garagem.",
				criadoEm: diasAtras(2),
			},
			{
				id: 8,
				reclamacaoId: 6,
				usuarioId: 1,
				texto: "Isso acontece há anos nessa rua.",
				criadoEm: diasAtras(1),
			},
		],
		apoios: [
			{ reclamacaoId: 1, usuarioId: 2 },
			{ reclamacaoId: 2, usuarioId: 1 },
			{ reclamacaoId: 4, usuarioId: 1 },
			{ reclamacaoId: 5, usuarioId: 2 },
			{ reclamacaoId: 6, usuarioId: 1 },
			{ reclamacaoId: 6, usuarioId: 2 },
		],
		// Apoios de outros munícipes que não estão cadastrados no protótipo,
		// usados apenas para deixar a demonstração mais realista.
		apoiosExternos: { 1: 31, 2: 18, 3: 9, 4: 24, 5: 12, 6: 40 },
		historico: [
			{ id: 1, reclamacaoId: 1, status: "aberta", criadoEm: diasAtras(12) },
			{ id: 2, reclamacaoId: 1, status: "em_analise", criadoEm: diasAtras(8) },
			{ id: 3, reclamacaoId: 2, status: "aberta", criadoEm: diasAtras(9) },
			{ id: 4, reclamacaoId: 3, status: "aberta", criadoEm: diasAtras(20) },
			{ id: 5, reclamacaoId: 3, status: "em_analise", criadoEm: diasAtras(19) },
			{ id: 6, reclamacaoId: 3, status: "resolvida", criadoEm: diasAtras(17) },
			{ id: 7, reclamacaoId: 4, status: "aberta", criadoEm: diasAtras(15) },
			{ id: 8, reclamacaoId: 4, status: "em_analise", criadoEm: diasAtras(11) },
			{ id: 9, reclamacaoId: 4, status: "em_execucao", criadoEm: diasAtras(4) },
			{ id: 10, reclamacaoId: 5, status: "aberta", criadoEm: diasAtras(3) },
			{ id: 11, reclamacaoId: 6, status: "aberta", criadoEm: diasAtras(1, 5) },
			{
				id: 12,
				reclamacaoId: 7,
				status: "pendente",
				criadoEm: diasAtras(0, 6),
			},
			{
				id: 13,
				reclamacaoId: 8,
				status: "pendente",
				criadoEm: diasAtras(0, 2),
			},
			{ id: 14, reclamacaoId: 9, status: "pendente", criadoEm: diasAtras(5) },
			{
				id: 15,
				reclamacaoId: 9,
				status: "recusada",
				usuarioId: 3,
				criadoEm: diasAtras(4),
			},
		],
	};
}

function carregar() {
	let db = null;
	try {
		db = JSON.parse(localStorage.getItem(DB_KEY));
	} catch (e) {
		db = null;
	}
	if (!db) {
		db = dadosIniciais();
		salvar(db);
	}
	return db;
}

function salvar(db) {
	try {
		localStorage.setItem(DB_KEY, JSON.stringify(db));
	} catch (e) {
		/* armazenamento indisponível */
	}
}

async function hashSenha(senha) {
	const dados = new TextEncoder().encode(senha);
	const buf = await crypto.subtle.digest("SHA-256", dados);
	return Array.from(new Uint8Array(buf))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

const Dados = {
	categorias: () => CATEGORIAS,
	bairros: () => BAIRROS,
	status: () => STATUS,
	motivosRecusa: () => MOTIVOS_RECUSA,
	rotuloStatus: (chave) =>
		(STATUS[chave] || STATUS_VALIDACAO[chave] || { rotulo: chave }).rotulo,
	ehPublica,
	categoria: (id) => CATEGORIAS.find((c) => c.id === Number(id)),
	bairro: (id) => BAIRROS.find((b) => b.id === Number(id)),

	// ---------- Sessão ----------
	usuarioAtual() {
		let id = null;
		try {
			id = Number(localStorage.getItem(SESSION_KEY));
		} catch (e) {
			id = null;
		}
		if (!id) return null;
		return carregar().usuarios.find((u) => u.id === id) || null;
	},
	sair() {
		try {
			localStorage.removeItem(SESSION_KEY);
		} catch (e) {}
	},

	async entrar(email, senha) {
		const db = carregar();
		const u = db.usuarios.find(
			(x) => x.email.toLowerCase() === email.trim().toLowerCase(),
		);
		if (!u || u.senha !== (await hashSenha(senha))) {
			throw new Error(
				"E-mail ou senha incorretos. Confira os dados e tente de novo.",
			);
		}
		try {
			localStorage.setItem(SESSION_KEY, String(u.id));
		} catch (e) {}
		return u;
	},

	async cadastrar({ nome, email, senha, bairroId }) {
		const db = carregar();
		if (
			db.usuarios.some(
				(u) => u.email.toLowerCase() === email.trim().toLowerCase(),
			)
		) {
			throw new Error(
				"Já existe uma conta com este e-mail. Use a opção Entrar.",
			);
		}
		const u = {
			id: db.proximoId.usuario++,
			nome: nome.trim(),
			email: email.trim().toLowerCase(),
			senha: await hashSenha(senha),
			bairroId: Number(bairroId),
			perfil: "municipe",
			criadoEm: new Date().toISOString(),
		};
		db.usuarios.push(u);
		salvar(db);
		try {
			localStorage.setItem(SESSION_KEY, String(u.id));
		} catch (e) {}
		return u;
	},

	usuario(id) {
		return carregar().usuarios.find((u) => u.id === Number(id));
	},

	// ---------- Reclamações ----------
	totalApoios(db, reclamacaoId) {
		return (
			db.apoios.filter((a) => a.reclamacaoId === reclamacaoId).length +
			(db.apoiosExternos[reclamacaoId] || 0)
		);
	},

	listarReclamacoes({ bairroId, categoriaId, status, busca, ordem } = {}) {
		const db = carregar();
		// Só as reclamações já validadas pela ouvidoria aparecem para o público
		let lista = db.reclamacoes.filter(ehPublica).map((r) => ({
			...r,
			apoios: this.totalApoios(db, r.id),
			comentarios: db.comentarios.filter((c) => c.reclamacaoId === r.id).length,
		}));
		if (bairroId) lista = lista.filter((r) => r.bairroId === Number(bairroId));
		if (categoriaId)
			lista = lista.filter((r) => r.categoriaId === Number(categoriaId));
		if (status) lista = lista.filter((r) => r.status === status);
		if (busca) {
			const t = busca.trim().toLowerCase();
			lista = lista.filter((r) =>
				(r.titulo + " " + r.descricao + " " + r.endereco)
					.toLowerCase()
					.includes(t),
			);
		}
		if (ordem === "apoios") lista.sort((a, b) => b.apoios - a.apoios);
		else lista.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
		return lista;
	},

	reclamacao(id) {
		const db = carregar();
		const r = db.reclamacoes.find((x) => x.id === Number(id));
		if (!r) return null;
		const usuario = this.usuarioAtual();
		// Antes da validação, só o autor e a ouvidoria podem ver a reclamação
		const podeVer =
			ehPublica(r) ||
			(usuario && (usuario.id === r.usuarioId || usuario.perfil === "gestor"));
		if (!podeVer) return null;
		return {
			...r,
			autor: db.usuarios.find((u) => u.id === r.usuarioId),
			apoios: this.totalApoios(db, r.id),
			apoiadaPorMim:
				!!usuario &&
				db.apoios.some(
					(a) => a.reclamacaoId === r.id && a.usuarioId === usuario.id,
				),
			comentarios: db.comentarios
				.filter((c) => c.reclamacaoId === r.id)
				.sort((a, b) => a.criadoEm.localeCompare(b.criadoEm))
				.map((c) => ({
					...c,
					autor: db.usuarios.find((u) => u.id === c.usuarioId),
				})),
			historico: db.historico
				.filter((h) => h.reclamacaoId === r.id)
				.sort((a, b) => a.criadoEm.localeCompare(b.criadoEm)),
		};
	},

	criarReclamacao({ categoriaId, bairroId, titulo, descricao, endereco }) {
		const usuario = this.usuarioAtual();
		if (!usuario)
			throw new Error("Entre na sua conta para registrar uma reclamação.");
		const db = carregar();
		const agora = new Date().toISOString();
		const r = {
			id: db.proximoId.reclamacao++,
			usuarioId: usuario.id,
			categoriaId: Number(categoriaId),
			bairroId: Number(bairroId),
			titulo: titulo.trim(),
			descricao: descricao.trim(),
			endereco: endereco.trim(),
			status: "pendente",
			criadoEm: agora,
		};
		db.reclamacoes.push(r);
		db.historico.push({
			id: db.proximoId.historico++,
			reclamacaoId: r.id,
			status: "pendente",
			criadoEm: agora,
		});
		salvar(db);
		return r;
	},

	alternarApoio(reclamacaoId) {
		const usuario = this.usuarioAtual();
		if (!usuario)
			throw new Error("Entre na sua conta para apoiar reclamações.");
		const db = carregar();
		const id = Number(reclamacaoId);
		if (!db.reclamacoes.some((r) => r.id === id && ehPublica(r)))
			throw new Error("Esta reclamação ainda não foi publicada.");
		const i = db.apoios.findIndex(
			(a) => a.reclamacaoId === id && a.usuarioId === usuario.id,
		);
		if (i >= 0) db.apoios.splice(i, 1);
		else db.apoios.push({ reclamacaoId: id, usuarioId: usuario.id });
		salvar(db);
		return i < 0;
	},

	comentar(reclamacaoId, texto) {
		const usuario = this.usuarioAtual();
		if (!usuario) throw new Error("Entre na sua conta para comentar.");
		const db = carregar();
		if (
			!db.reclamacoes.some((r) => r.id === Number(reclamacaoId) && ehPublica(r))
		)
			throw new Error("Esta reclamação ainda não foi publicada.");
		db.comentarios.push({
			id: db.proximoId.comentario++,
			reclamacaoId: Number(reclamacaoId),
			usuarioId: usuario.id,
			texto: texto.trim(),
			criadoEm: new Date().toISOString(),
		});
		salvar(db);
	},

	alterarStatus(reclamacaoId, status) {
		const usuario = this.usuarioAtual();
		if (!usuario || usuario.perfil !== "gestor")
			throw new Error("Somente a ouvidoria pode alterar o status.");
		const db = carregar();
		const r = db.reclamacoes.find((x) => x.id === Number(reclamacaoId));
		if (!r || !ehPublica(r) || !(status in STATUS))
			throw new Error("Situação inválida para esta reclamação.");
		r.status = status;
		db.historico.push({
			id: db.proximoId.historico++,
			reclamacaoId: r.id,
			status,
			usuarioId: usuario.id,
			criadoEm: new Date().toISOString(),
		});
		salvar(db);
	},

	// Todas as reclamações do usuário conectado, inclusive as não publicadas
	minhasReclamacoes() {
		const usuario = this.usuarioAtual();
		if (!usuario) return [];
		const db = carregar();
		return db.reclamacoes
			.filter((r) => r.usuarioId === usuario.id)
			.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
			.map((r) => ({
				...r,
				apoios: this.totalApoios(db, r.id),
				comentarios: db.comentarios.filter((c) => c.reclamacaoId === r.id)
					.length,
			}));
	},

	// ---------- Validação pela ouvidoria ----------
	exigirGestor() {
		const usuario = this.usuarioAtual();
		if (!usuario || usuario.perfil !== "gestor")
			throw new Error("Somente a ouvidoria pode validar reclamações.");
		return usuario;
	},

	contarPendentes() {
		return carregar().reclamacoes.filter((r) => r.status === "pendente").length;
	},

	listarPendentes() {
		this.exigirGestor();
		const db = carregar();
		return db.reclamacoes
			.filter((r) => r.status === "pendente")
			.sort((a, b) => a.criadoEm.localeCompare(b.criadoEm))
			.map((r) => ({
				...r,
				autor: db.usuarios.find((u) => u.id === r.usuarioId),
			}));
	},

	aprovar(reclamacaoId) {
		const gestor = this.exigirGestor();
		const db = carregar();
		const r = db.reclamacoes.find((x) => x.id === Number(reclamacaoId));
		if (!r || r.status !== "pendente")
			throw new Error("Esta reclamação não está aguardando validação.");
		const agora = new Date().toISOString();
		r.status = "aberta";
		r.validadoPor = gestor.id;
		r.validadoEm = agora;
		db.historico.push({
			id: db.proximoId.historico++,
			reclamacaoId: r.id,
			status: "aberta",
			usuarioId: gestor.id,
			criadoEm: agora,
		});
		salvar(db);
	},

	recusar(reclamacaoId, motivo, detalhe = "") {
		const gestor = this.exigirGestor();
		if (!MOTIVOS_RECUSA.includes(motivo))
			throw new Error("Escolha o motivo da recusa.");
		const db = carregar();
		const r = db.reclamacoes.find((x) => x.id === Number(reclamacaoId));
		if (!r || r.status !== "pendente")
			throw new Error("Esta reclamação não está aguardando validação.");
		const agora = new Date().toISOString();
		r.status = "recusada";
		r.motivoRecusa = motivo;
		r.detalheRecusa = detalhe.trim();
		r.validadoPor = gestor.id;
		r.validadoEm = agora;
		db.historico.push({
			id: db.proximoId.historico++,
			reclamacaoId: r.id,
			status: "recusada",
			usuarioId: gestor.id,
			criadoEm: agora,
		});
		salvar(db);
	},

	restaurarDemonstracao() {
		salvar(dadosIniciais());
		this.sair();
	},
};
