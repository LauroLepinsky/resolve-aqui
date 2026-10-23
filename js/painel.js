// Painel público com números gerais das reclamações.

montarCabecalho("painel");
montarRodape();

const todas = Dados.listarReclamacoes();
const porStatus = (chave) => todas.filter((r) => r.status === chave).length;
const totalApoios = todas.reduce((soma, r) => soma + r.apoios, 0);
const taxa = todas.length
	? Math.round((porStatus("resolvida") / todas.length) * 100)
	: 0;

function barras(itens, chave, link) {
	const contagens = itens
		.map((item) => ({
			...item,
			total: todas.filter((r) => r[chave] === item.id).length,
		}))
		.filter((item) => item.total > 0)
		.sort((a, b) => b.total - a.total);
	const maior = Math.max(1, ...contagens.map((c) => c.total));
	return `<ul class="barras">${contagens
		.map(
			(c) => `
    <li>
      <a href="index.html?${link}=${c.id}">${esc(c.nome)}</a>
      <span class="barras__trilho" aria-hidden="true"><span class="barras__valor" style="width:${(c.total / maior) * 100}%;display:block"></span></span>
      <span>${c.total}</span>
    </li>`,
		)
		.join("")}</ul>`;
}

const maisApoiadas = [...todas].sort((a, b) => b.apoios - a.apoios).slice(0, 3);

document.querySelector("#painel").innerHTML = `
  <dl class="numeros">
    <div><dt>Reclamações registradas</dt><dd>${todas.length}</dd></div>
    <div><dt>Aguardando resposta</dt><dd>${porStatus("aberta")}</dd></div>
    <div><dt>Resolvidas</dt><dd>${porStatus("resolvida")} <small style="font-size:1rem">(${taxa}%)</small></dd></div>
    <div><dt>Apoios recebidos</dt><dd>${totalApoios}</dd></div>
  </dl>

  <h2>Reclamações por bairro</h2>
  ${barras(Dados.bairros(), "bairroId", "bairro")}

  <h2>Reclamações por categoria</h2>
  ${barras(Dados.categorias(), "categoriaId", "categoria")}

  <h2>Mais apoiadas</h2>
  <ul class="lista">${maisApoiadas
		.map(
			(r) => `
    <li class="item" data-status="${r.status}">
      <div>
        <h3 class="item__titulo"><a href="reclamacao.html?id=${r.id}">${esc(r.titulo)}</a></h3>
        <div class="item__meta">${seloStatus(r.status)}<span>${esc(Dados.bairro(r.bairroId).nome)}</span></div>
      </div>
      <div class="contador" aria-label="${r.apoios} apoios">
        <span class="losango" aria-hidden="true"><span class="losango__numero">${r.apoios}</span></span>
        <span class="contador__rotulo" aria-hidden="true">apoios</span>
      </div>
    </li>`,
		)
		.join("")}</ul>`;
