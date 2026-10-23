// Entrar e criar conta.

montarCabecalho("entrar");
montarRodape();

const destino = parametro("voltar") || "index.html";
// Evita redirecionar para outro site
const destinoSeguro = /^[a-z]+\.html(\?[\w=&%.-]*)?$/i.test(destino)
	? destino
	: "index.html";

const abaEntrar = document.querySelector("#aba-entrar");
const abaCadastrar = document.querySelector("#aba-cadastrar");
const formEntrar = document.querySelector("#form-entrar");
const formCadastrar = document.querySelector("#form-cadastrar");
const erroEntrar = document.querySelector("#erro");

document.querySelector("#c-bairro").innerHTML = opcoes(
	Dados.bairros(),
	"",
	"Selecione",
);

function mostrarAba(cadastrar) {
	abaEntrar.setAttribute("aria-selected", String(!cadastrar));
	abaCadastrar.setAttribute("aria-selected", String(cadastrar));
	formEntrar.hidden = cadastrar;
	formCadastrar.hidden = !cadastrar;
	erroEntrar.textContent = "";
}
abaEntrar.addEventListener("click", () => mostrarAba(false));
abaCadastrar.addEventListener("click", () => mostrarAba(true));

formEntrar.addEventListener("submit", async (evento) => {
	evento.preventDefault();
	const email = document.querySelector("#e-email").value;
	const senha = document.querySelector("#e-senha").value;
	if (!email || !senha) {
		erroEntrar.textContent = "Informe o e-mail e a senha.";
		return;
	}
	try {
		await Dados.entrar(email, senha);
		location.href = destinoSeguro;
	} catch (e) {
		erroEntrar.textContent = e.message;
	}
});

formCadastrar.addEventListener("submit", async (evento) => {
	evento.preventDefault();
	const dados = {
		nome: document.querySelector("#c-nome").value,
		email: document.querySelector("#c-email").value,
		bairroId: document.querySelector("#c-bairro").value,
		senha: document.querySelector("#c-senha").value,
	};
	const faltando = [];
	if (dados.nome.trim().split(" ").length < 2)
		faltando.push("nome e sobrenome");
	if (!/^\S+@\S+\.\S+$/.test(dados.email)) faltando.push("um e-mail válido");
	if (!dados.bairroId) faltando.push("o bairro");
	if (dados.senha.length < 6)
		faltando.push("uma senha com pelo menos 6 caracteres");
	if (faltando.length) {
		erroEntrar.textContent =
			"Para criar a conta, informe " + faltando.join(", ") + ".";
		return;
	}
	try {
		await Dados.cadastrar(dados);
		location.href = destinoSeguro;
	} catch (e) {
		erroEntrar.textContent = e.message;
	}
});
