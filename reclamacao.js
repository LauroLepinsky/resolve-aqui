// Detalhe de uma reclamação: apoio público, comentários e acompanhamento do status.

montarCabecalho('reclamacao');
montarRodape();

const idReclamacao = parametro('id');
const area = document.querySelector('#detalhe');

function desenharDetalhe() {
  const r = Dados.reclamacao(idReclamacao);
  if (!r) {
    area.innerHTML = `<h1>Reclamação não encontrada</h1>
      <p>Ela pode ter sido removida ou o link está incompleto. <a href="index.html">Ver todas as reclamações</a>.</p>`;
    return;
  }
  document.title = `${r.titulo} | Resolve Aqui`;
  const usuario = Dados.usuarioAtual();
  const ordemAtual = Dados.status()[r.status].ordem;

  // Data em que cada etapa foi alcançada, a partir do histórico
  const quando = {};
  r.historico.forEach(h => { quando[h.status] = h.criadoEm; });

  const etapas = Object.entries(Dados.status()).map(([chave, s]) => {
    const classe = s.ordem < ordemAtual ? 'feito' : s.ordem === ordemAtual ? 'feito atual' : '';
    return `<li class="${classe}">
      <strong>${s.rotulo}</strong>
      ${quando[chave] && s.ordem <= ordemAtual ? new Date(quando[chave]).toLocaleDateString('pt-BR') : 'Aguardando'}
    </li>`;
  }).join('');

  const painelGestor = usuario && usuario.perfil === 'gestor' ? `
    <form class="gestor" id="form-status">
      <div class="campo">
        <label for="novo-status">Atualizar situação (ouvidoria)</label>
        <select id="novo-status">
          ${Object.entries(Dados.status()).map(([chave, s]) =>
            `<option value="${chave}" ${chave === r.status ? 'selected' : ''}>${s.rotulo}</option>`).join('')}
        </select>
      </div>
      <button class="botao" type="submit">Salvar situação</button>
    </form>` : '';

  const comentarios = r.comentarios.length
    ? r.comentarios.map(c => `
      <li class="comentario ${c.autor.perfil === 'gestor' ? 'comentario--gestor' : ''}">
        <span class="avatar" aria-hidden="true">${esc(iniciais(c.autor.nome))}</span>
        <div>
          <span class="comentario__autor">${esc(c.autor.nome)}${c.autor.perfil === 'gestor' ? '<span class="etiqueta-gestor">Resposta oficial</span>' : ''}<small>${tempoRelativo(c.criadoEm)}</small></span>
          <p>${esc(c.texto)}</p>
        </div>
      </li>`).join('')
    : '<li class="vazio">Ninguém comentou ainda. Se você também enfrenta esse problema, conte como ele afeta você.</li>';

  const formComentario = usuario
    ? `<form id="form-comentario" class="formulario" novalidate>
        <div class="campo">
          <label for="texto-comentario">Seu comentário</label>
          <textarea id="texto-comentario" maxlength="500" style="min-height:5rem" required></textarea>
        </div>
        <button class="botao" type="submit">Publicar comentário</button>
      </form>`
    : `<p><a href="entrar.html?voltar=${encodeURIComponent('reclamacao.html?id=' + r.id)}">Entre na sua conta</a> para comentar ou apoiar esta reclamação.</p>`;

  area.innerHTML = `
    <div class="detalhe__cabecalho">
      <div>
        ${seloStatus(r.status)}
        <h1 style="margin-top:.5rem">${esc(r.titulo)}</h1>
        <div class="detalhe__meta">
          <span>${esc(Dados.categoria(r.categoriaId).nome)}</span>
          <span>${esc(Dados.bairro(r.bairroId).nome)}</span>
          <span>Registrada por ${esc(r.autor.nome)} em ${dataCompleta(r.criadoEm)}</span>
        </div>
      </div>
      <button type="button" class="apoiar" id="btn-apoiar" aria-pressed="${r.apoiadaPorMim}">
        <span class="losango"><span class="losango__numero">${r.apoios}</span></span>
        <span class="apoiar__texto">${r.apoiadaPorMim ? 'Você apoia' : 'Apoiar'}</span>
      </button>
    </div>

    <section class="secao">
      <p class="endereco"><strong>Local:</strong> ${esc(r.endereco)}</p>
      <p class="descricao">${esc(r.descricao)}</p>
    </section>

    <section class="secao" aria-labelledby="t-andamento">
      <h2 id="t-andamento">Andamento</h2>
      <ol class="trajeto">${etapas}</ol>
      ${painelGestor}
    </section>

    <section class="secao" aria-labelledby="t-comentarios">
      <h2 id="t-comentarios">Comentários (${r.comentarios.length})</h2>
      <ul class="comentarios">${comentarios}</ul>
      ${formComentario}
    </section>`;

  document.querySelector('#btn-apoiar').addEventListener('click', () => {
    try {
      const apoiou = Dados.alternarApoio(r.id);
      desenharDetalhe();
      const botao = document.querySelector('#btn-apoiar');
      if (apoiou) botao.classList.add('pulso');
      botao.focus();
      avisar(apoiou ? 'Apoio registrado. Obrigado por reforçar esta reclamação.' : 'Apoio retirado.');
    } catch (e) {
      location.href = `entrar.html?voltar=${encodeURIComponent('reclamacao.html?id=' + r.id)}`;
    }
  });

  const fc = document.querySelector('#form-comentario');
  if (fc) fc.addEventListener('submit', evento => {
    evento.preventDefault();
    const texto = fc.querySelector('textarea').value;
    if (texto.trim().length < 3) { avisar('Escreva um comentário com pelo menos 3 caracteres.', 'erro'); return; }
    Dados.comentar(r.id, texto);
    desenharDetalhe();
    avisar('Comentário publicado.');
  });

  const fs = document.querySelector('#form-status');
  if (fs) fs.addEventListener('submit', evento => {
    evento.preventDefault();
    const novo = fs.querySelector('select').value;
    if (novo === r.status) { avisar('A situação escolhida já é a atual.'); return; }
    Dados.alterarStatus(r.id, novo);
    desenharDetalhe();
    avisar(`Situação atualizada para ${Dados.status()[novo].rotulo}.`);
  });
}

desenharDetalhe();
if (parametro('nova')) avisar('Reclamação publicada. Compartilhe o link com seus vizinhos para reunir apoios.');
