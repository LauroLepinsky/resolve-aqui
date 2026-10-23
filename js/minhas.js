// Reclamações do usuário conectado, em qualquer situação.

const usuarioMinhas = Dados.usuarioAtual();
if (!usuarioMinhas) location.replace("entrar.html?voltar=minhas.html");

montarCabecalho("minhas");
montarRodape();

const areaMinhas = document.querySelector("#minhas");
const lista = Dados.minhasReclamacoes();

if (!lista.length) {
	areaMinhas.innerHTML = `<p class="vazio">Você ainda não enviou nenhuma reclamação.
    <a href="nova.html">Registrar a primeira</a>.</p>`;
} else {
	const conta = (chave) => lista.filter((r) => r.status === chave).length;
	const publicadas = lista.filter((r) => Dados.ehPublica(r)).length;

	areaMinhas.innerHTML = `
    <dl class="numeros">
      <div><dt>Enviadas</dt><dd>${lista.length}</dd></div>
      <div><dt>Aguardando validação</dt><dd>${conta("pendente")}</dd></div>
      <div><dt>Publicadas</dt><dd>${publicadas}</dd></div>
      <div><dt>Recusadas</dt><dd>${conta("recusada")}</dd></div>
    </dl>
    <ul class="lista">${lista
			.map(
				(r) => `
      <li class="item" data-status="${r.status}">
        <div>
          <h2 class="item__titulo"><a href="reclamacao.html?id=${r.id}">${esc(r.titulo)}</a></h2>
          <div class="item__meta">
            ${seloStatus(r.status)}
            <span>${esc(Dados.categoria(r.categoriaId).nome)}</span>
            <span>${esc(Dados.bairro(r.bairroId).nome)}</span>
            <span>Enviada ${tempoRelativo(r.criadoEm)}</span>
          </div>
          ${r.status === "recusada" ? `<p class="item__motivo"><strong>Motivo da recusa:</strong> ${esc(r.motivoRecusa)}</p>` : ""}
        </div>
        ${
					Dados.ehPublica(r)
						? `
        <div class="contador" aria-label="${r.apoios} apoios">
          <span class="losango" aria-hidden="true"><span class="losango__numero">${r.apoios}</span></span>
          <span class="contador__rotulo" aria-hidden="true">apoios</span>
        </div>`
						: ""
				}
      </li>`,
			)
			.join("")}
    </ul>
    <p style="margin-top:1.5rem"><a class="botao" href="nova.html">Registrar outra reclamação</a></p>`;
}
