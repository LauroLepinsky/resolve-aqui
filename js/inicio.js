// Página inicial: lista pública de reclamações com filtros.

montarCabecalho("inicio");
montarRodape();

const campos = {
	busca: document.querySelector("#f-busca"),
	bairro: document.querySelector("#f-bairro"),
	categoria: document.querySelector("#f-categoria"),
	status: document.querySelector("#f-status"),
	ordem: document.querySelector("#f-ordem"),
};

campos.bairro.innerHTML = opcoes(
	Dados.bairros(),
	parametro("bairro"),
	"Todos os bairros",
);
campos.categoria.innerHTML = opcoes(
	Dados.categorias(),
	parametro("categoria"),
	"Todas as categorias",
);
campos.status.innerHTML =
	'<option value="">Todas</option>' +
	Object.entries(Dados.status())
		.map(([chave, s]) => `<option value="${chave}">${s.rotulo}</option>`)
		.join("");

function desenhar() {
	const lista = Dados.listarReclamacoes({
		busca: campos.busca.value,
		bairroId: campos.bairro.value,
		categoriaId: campos.categoria.value,
		status: campos.status.value,
		ordem: campos.ordem.value,
	});

	const total = lista.length;
	document.querySelector("#contagem").textContent =
		total === 1
			? "1 reclamação encontrada"
			: `${total} reclamações encontradas`;

	const ul = document.querySelector("#lista");
	if (!total) {
		ul.innerHTML = `<li class="vazio">Nenhuma reclamação com esses filtros.
      Se você encontrou um problema que ainda não foi registrado, <a href="nova.html">registre agora</a>.</li>`;
		return;
	}

	ul.innerHTML = lista
		.map(
			(r) => `
    <li class="item" data-status="${r.status}">
      <div>
        <h2 class="item__titulo"><a href="reclamacao.html?id=${r.id}">${esc(r.titulo)}</a></h2>
        <div class="item__meta">
          ${seloStatus(r.status)}
          <span>${esc(Dados.categoria(r.categoriaId).nome)}</span>
          <span>${esc(Dados.bairro(r.bairroId).nome)}</span>
          <span>${tempoRelativo(r.criadoEm)}</span>
          <span>${r.comentarios} ${r.comentarios === 1 ? "comentário" : "comentários"}</span>
          ${r.foto ? "<span>Com foto</span>" : ""}
        </div>
      </div>
      <div class="contador" aria-label="${r.apoios} apoios">
        <span class="losango" aria-hidden="true"><span class="losango__numero">${r.apoios}</span></span>
        <span class="contador__rotulo" aria-hidden="true">apoios</span>
      </div>
    </li>`,
		)
		.join("");
}

Object.values(campos).forEach((c) => c.addEventListener("input", desenhar));
document
	.querySelector("#filtros")
	.addEventListener("submit", (e) => e.preventDefault());
desenhar();
