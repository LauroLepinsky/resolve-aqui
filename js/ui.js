// Funções de interface compartilhadas entre as páginas.

function esc(texto) {
	return String(texto ?? "").replace(
		/[&<>"']/g,
		(ch) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				ch
			],
	);
}

function tempoRelativo(iso) {
	const seg = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
	if (seg < 60) return "agora mesmo";
	const min = Math.floor(seg / 60);
	if (min < 60) return `há ${min} min`;
	const h = Math.floor(min / 60);
	if (h < 24) return `há ${h} h`;
	const d = Math.floor(h / 24);
	if (d === 1) return "ontem";
	if (d < 30) return `há ${d} dias`;
	return new Date(iso).toLocaleDateString("pt-BR");
}

function dataCompleta(iso) {
	return new Date(iso).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

function seloStatus(status) {
	return `<span class="selo selo--${status}">${esc(Dados.rotuloStatus(status))}</span>`;
}

function iniciais(nome) {
	return nome
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((p) => p[0].toUpperCase())
		.join("");
}

function parametro(nome) {
	return new URLSearchParams(location.search).get(nome);
}

function opcoes(lista, selecionado, vazio) {
	const inicio = vazio ? `<option value="">${esc(vazio)}</option>` : "";
	return (
		inicio +
		lista
			.map(
				(item) =>
					`<option value="${item.id}" ${String(item.id) === String(selecionado) ? "selected" : ""}>${esc(item.nome)}</option>`,
			)
			.join("")
	);
}

function avisar(mensagem, tipo = "ok") {
	let el = document.querySelector(".aviso");
	if (!el) {
		el = document.createElement("div");
		el.className = "aviso";
		el.setAttribute("role", "status");
		document.body.appendChild(el);
	}
	el.textContent = mensagem;
	el.dataset.tipo = tipo;
	el.classList.add("aviso--visivel");
	clearTimeout(el._timer);
	el._timer = setTimeout(() => el.classList.remove("aviso--visivel"), 3200);
}

// Link da fila de validação, com o número de reclamações esperando
function linkValidacao(paginaAtual) {
	const n = Dados.contarPendentes();
	return `<a href="validacao.html" ${paginaAtual === "validacao" ? 'aria-current="page"' : ""}>Validação${n ? ` <span class="contador-nav" aria-label="${n} aguardando">${n}</span>` : ""}</a>`;
}

// Cabeçalho em forma de placa de rua, igual em todas as páginas.
function montarCabecalho(paginaAtual) {
	const usuario = Dados.usuarioAtual();
	const link = (href, texto, chave) =>
		`<a href="${href}" ${paginaAtual === chave ? 'aria-current="page"' : ""}>${texto}</a>`;

	const conta = usuario
		? `<span class="topo__usuario" title="${esc(usuario.email)}">
         <span class="avatar" aria-hidden="true">${esc(iniciais(usuario.nome))}</span>
         <span class="topo__nome">${esc(usuario.nome.split(" ")[0])}${usuario.perfil === "gestor" ? " (Ouvidoria)" : ""}</span>
       </span>
       <button type="button" class="botao-link" id="btn-sair">Sair</button>`
		: link("entrar.html", "Entrar", "entrar");

	document.querySelector("#topo").innerHTML = `
    <div class="topo__placa">
      <a href="index.html" class="placa" aria-label="Resolve Aqui, página inicial">
        <span class="placa__nome">Resolve Aqui</span>
        <span class="placa__cidade">Itapetininga, SP</span>
      </a>
      <nav class="topo__nav" aria-label="Principal">
        ${link("index.html", "Reclamações", "inicio")}
        ${link("painel.html", "Painel", "painel")}
        ${usuario && usuario.perfil === "gestor" ? linkValidacao(paginaAtual) : ""}
        ${conta}
      </nav>
    </div>`;

	const sair = document.querySelector("#btn-sair");
	if (sair)
		sair.addEventListener("click", () => {
			Dados.sair();
			location.href = "index.html";
		});
}

// Botões de aprovar e recusar, usados na fila de validação e na página da reclamação.
function htmlValidacao(r) {
	return `
    <div class="acoes" data-validacao="${r.id}">
      <button type="button" class="botao" data-acao="aprovar">Aprovar e publicar</button>
      <button type="button" class="botao botao--perigo" data-acao="mostrar-recusa">Recusar</button>
    </div>
    <form class="recusa" data-recusa="${r.id}" hidden novalidate>
      <div class="campo">
        <label for="motivo-${r.id}">Motivo da recusa</label>
        <select id="motivo-${r.id}" required>
          <option value="">Selecione o motivo</option>
          ${Dados.motivosRecusa()
						.map((m) => `<option>${esc(m)}</option>`)
						.join("")}
        </select>
      </div>
      <div class="campo">
        <label for="detalhe-${r.id}">Explicação para o munícipe (opcional)</label>
        <textarea id="detalhe-${r.id}" maxlength="300" style="min-height:4.5rem"></textarea>
        <span class="dica">O autor verá o motivo e esta explicação.</span>
      </div>
      <button type="submit" class="botao botao--perigo">Confirmar recusa</button>
    </form>`;
}

function ligarValidacao(raiz, aoConcluir) {
	raiz.querySelectorAll("[data-validacao]").forEach((acoes) => {
		const id = acoes.dataset.validacao;
		const form = raiz.querySelector(`[data-recusa="${id}"]`);
		acoes
			.querySelector('[data-acao="aprovar"]')
			.addEventListener("click", () => {
				Dados.aprovar(id);
				aoConcluir("Reclamação aprovada e publicada.");
			});
		acoes
			.querySelector('[data-acao="mostrar-recusa"]')
			.addEventListener("click", () => {
				form.hidden = false;
				form.querySelector("select").focus();
			});
		form.addEventListener("submit", (evento) => {
			evento.preventDefault();
			const motivo = form.querySelector("select").value;
			if (!motivo) {
				avisar("Escolha o motivo da recusa.", "erro");
				return;
			}
			Dados.recusar(id, motivo, form.querySelector("textarea").value);
			aoConcluir("Reclamação recusada. O autor verá o motivo.");
		});
	});
}

function montarRodape() {
	const el = document.querySelector("#rodape");
	if (!el) return;
	el.innerHTML = `
    <p>Protótipo acadêmico desenvolvido na disciplina Engenharia de Software III, Fatec Itapetininga. Os dados ficam salvos apenas neste navegador.</p>
    <button type="button" class="botao-link" id="btn-restaurar">Restaurar dados de demonstração</button>`;
	el.querySelector("#btn-restaurar").addEventListener("click", () => {
		if (
			confirm(
				"Apagar tudo o que foi criado neste navegador e voltar aos dados de exemplo?",
			)
		) {
			Dados.restaurarDemonstracao();
			location.href = "index.html";
		}
	});
}
