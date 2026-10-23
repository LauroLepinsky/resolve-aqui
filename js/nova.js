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

// Mostra reclamações já publicadas da mesma categoria no mesmo bairro,
// para o morador apoiar a existente em vez de registrar uma repetida.
const caixaParecidas = document.querySelector("#parecidas");

function mostrarParecidas() {
	const categoriaId = form.categoria.value;
	const bairroId = form.bairro.value;
	const parecidas =
		categoriaId && bairroId
			? Dados.listarReclamacoes({
					categoriaId,
					bairroId,
					ordem: "apoios",
				}).filter((r) => r.status !== "resolvida")
			: [];

	caixaParecidas.hidden = !parecidas.length;
	if (!parecidas.length) {
		caixaParecidas.innerHTML = "";
		return;
	}

	caixaParecidas.innerHTML = `
    <p><strong>${parecidas.length === 1 ? "Já existe uma reclamação parecida" : `Já existem ${parecidas.length} reclamações parecidas`} neste bairro.</strong>
    Se for o mesmo problema, apoie a reclamação existente: assim o pedido ganha força e não se repete.</p>
    <ul class="parecidas">${parecidas
			.slice(0, 3)
			.map(
				(r) => `
      <li><a href="reclamacao.html?id=${r.id}">${esc(r.titulo)}</a>
        <small>${esc(Dados.rotuloStatus(r.status))}, ${r.apoios} apoios</small></li>`,
			)
			.join("")}
    </ul>`;
}

form.categoria.addEventListener("change", mostrarParecidas);
form.bairro.addEventListener("change", mostrarParecidas);
mostrarParecidas();

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
