// Fila de validação: a ouvidoria aprova ou recusa as reclamações novas.

montarCabecalho("validacao");
montarRodape();

const usuarioValidacao = Dados.usuarioAtual();
const fila = document.querySelector("#fila");

function desenharFila() {
	if (!usuarioValidacao || usuarioValidacao.perfil !== "gestor") {
		fila.innerHTML = `<div class="nota"><p>Esta página é exclusiva da Ouvidoria.
      <a href="entrar.html?voltar=validacao.html">Entre com a conta da Ouvidoria</a> para validar reclamações.</p></div>`;
		return;
	}

	const pendentes = Dados.listarPendentes();
	if (!pendentes.length) {
		fila.innerHTML =
			'<p class="vazio">Nenhuma reclamação aguardando validação.</p>';
		return;
	}

	fila.innerHTML = `
    <p class="contagem" aria-live="polite">${pendentes.length === 1 ? "1 reclamação aguardando" : `${pendentes.length} reclamações aguardando`}, das mais antigas para as mais recentes.</p>
    <ul class="fila">${pendentes
			.map(
				(r) => `
      <li class="cartao">
        <h2><a href="reclamacao.html?id=${r.id}">${esc(r.titulo)}</a></h2>
        <div class="item__meta">
          <span>${esc(Dados.categoria(r.categoriaId).nome)}</span>
          <span>${esc(Dados.bairro(r.bairroId).nome)}</span>
          <span>Enviada por ${esc(r.autor.nome)} ${tempoRelativo(r.criadoEm)}</span>
        </div>
        <p class="endereco" style="margin:.75rem 0 0"><strong>Local:</strong> ${esc(r.endereco)}
          ${r.latitude != null ? `<a href="${linkMapaExterno(r.latitude, r.longitude)}" target="_blank" rel="noopener">ver no mapa</a>` : ""}</p>
        <p class="descricao">${esc(r.descricao)}</p>
        ${r.foto ? `<figure class="foto"><img src="${esc(r.foto)}" alt="Foto enviada por ${esc(r.autor.nome)}"></figure>` : ""}
        ${htmlValidacao(r)}
      </li>`,
			)
			.join("")}
    </ul>`;

	ligarValidacao(fila, (mensagem) => {
		desenharFila();
		montarCabecalho("validacao");
		avisar(mensagem);
	});
}

desenharFila();
