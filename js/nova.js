// Registro de nova reclamação.

montarCabecalho("nova");
montarRodape();

const usuarioNova = Dados.usuarioAtual();
if (!usuarioNova) {
	location.replace("entrar.html?voltar=nova.html");
}

const form = document.querySelector("#form-reclamacao");
const erro = document.querySelector("#erro");

form.categoria.innerHTML = opcoes(
	Dados.categorias(),
	"",
	"Selecione a categoria",
);
form.bairro.innerHTML = opcoes(
	Dados.bairros(),
	usuarioNova ? usuarioNova.bairroId : "",
	"Selecione o bairro",
);

form.addEventListener("submit", (evento) => {
	evento.preventDefault();
	const valores = {
		categoriaId: form.categoria.value,
		bairroId: form.bairro.value,
		titulo: form.titulo.value,
		endereco: form.endereco.value,
		descricao: form.descricao.value,
	};

	const faltando = [];
	if (!valores.categoriaId) faltando.push("a categoria");
	if (!valores.bairroId) faltando.push("o bairro");
	if (valores.titulo.trim().length < 5)
		faltando.push("um título com pelo menos 5 caracteres");
	if (!valores.endereco.trim())
		faltando.push("o endereço ou ponto de referência");
	if (valores.descricao.trim().length < 20)
		faltando.push("uma descrição com pelo menos 20 caracteres");

	if (faltando.length) {
		erro.textContent = "Para enviar, informe " + faltando.join(", ") + ".";
		erro.scrollIntoView({ block: "center" });
		return;
	}

	try {
		const r = Dados.criarReclamacao(valores);
		location.href = `reclamacao.html?id=${r.id}&nova=1`;
	} catch (e) {
		erro.textContent = e.message;
	}
});
