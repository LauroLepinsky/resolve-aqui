// Funções de interface compartilhadas entre as páginas.

function esc(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));
}

function tempoRelativo(iso) {
  const seg = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seg < 60) return 'agora mesmo';
  const min = Math.floor(seg / 60);
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'ontem';
  if (d < 30) return `há ${d} dias`;
  return new Date(iso).toLocaleDateString('pt-BR');
}

function dataCompleta(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function seloStatus(status) {
  const s = Dados.status()[status];
  return `<span class="selo selo--${status}">${esc(s ? s.rotulo : status)}</span>`;
}

function iniciais(nome) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
}

function parametro(nome) {
  return new URLSearchParams(location.search).get(nome);
}

function opcoes(lista, selecionado, vazio) {
  const inicio = vazio ? `<option value="">${esc(vazio)}</option>` : '';
  return inicio + lista.map(item =>
    `<option value="${item.id}" ${String(item.id) === String(selecionado) ? 'selected' : ''}>${esc(item.nome)}</option>`
  ).join('');
}

function avisar(mensagem, tipo = 'ok') {
  let el = document.querySelector('.aviso');
  if (!el) {
    el = document.createElement('div');
    el.className = 'aviso';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.textContent = mensagem;
  el.dataset.tipo = tipo;
  el.classList.add('aviso--visivel');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('aviso--visivel'), 3200);
}

// Cabeçalho em forma de placa de rua, igual em todas as páginas.
function montarCabecalho(paginaAtual) {
  const usuario = Dados.usuarioAtual();
  const link = (href, texto, chave) =>
    `<a href="${href}" ${paginaAtual === chave ? 'aria-current="page"' : ''}>${texto}</a>`;

  const conta = usuario
    ? `<span class="topo__usuario" title="${esc(usuario.email)}">
         <span class="avatar" aria-hidden="true">${esc(iniciais(usuario.nome))}</span>
         <span class="topo__nome">${esc(usuario.nome.split(' ')[0])}${usuario.perfil === 'gestor' ? ' (Ouvidoria)' : ''}</span>
       </span>
       <button type="button" class="botao-link" id="btn-sair">Sair</button>`
    : link('entrar.html', 'Entrar', 'entrar');

  document.querySelector('#topo').innerHTML = `
    <div class="topo__placa">
      <a href="index.html" class="placa" aria-label="Resolve Aqui, página inicial">
        <span class="placa__nome">Resolve Aqui</span>
        <span class="placa__cidade">Itapetininga, SP</span>
      </a>
      <nav class="topo__nav" aria-label="Principal">
        ${link('index.html', 'Reclamações', 'inicio')}
        ${link('painel.html', 'Painel', 'painel')}
        ${conta}
      </nav>
    </div>`;

  const sair = document.querySelector('#btn-sair');
  if (sair) sair.addEventListener('click', () => { Dados.sair(); location.href = 'index.html'; });
}

function montarRodape() {
  const el = document.querySelector('#rodape');
  if (!el) return;
  el.innerHTML = `
    <p>Protótipo acadêmico desenvolvido na disciplina Engenharia de Software III, Fatec Itapetininga. Os dados ficam salvos apenas neste navegador.</p>
    <button type="button" class="botao-link" id="btn-restaurar">Restaurar dados de demonstração</button>`;
  el.querySelector('#btn-restaurar').addEventListener('click', () => {
    if (confirm('Apagar tudo o que foi criado neste navegador e voltar aos dados de exemplo?')) {
      Dados.restaurarDemonstracao();
      location.href = 'index.html';
    }
  });
}
