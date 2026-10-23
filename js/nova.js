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

// ---------- Foto: reduz para no máximo 1024 px e converte para JPEG ----------
const campoFoto = document.querySelector("#foto");
const previa = document.querySelector("#foto-previa");
let fotoReduzida = null;

function reduzirImagem(arquivo, ladoMaximo = 1024, qualidade = 0.7) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(arquivo);
		const img = new Image();
		img.onload = () => {
			const escala = Math.min(1, ladoMaximo / Math.max(img.width, img.height));
			const canvas = document.createElement("canvas");
			canvas.width = Math.round(img.width * escala);
			canvas.height = Math.round(img.height * escala);
			canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
			URL.revokeObjectURL(url);
			resolve(canvas.toDataURL("image/jpeg", qualidade));
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error("Arquivo de imagem inválido."));
		};
		img.src = url;
	});
}

campoFoto.addEventListener("change", async () => {
	const arquivo = campoFoto.files[0];
	if (!arquivo) return;
	if (!arquivo.type.startsWith("image/")) {
		avisar("Escolha um arquivo de imagem.", "erro");
		campoFoto.value = "";
		return;
	}
	try {
		fotoReduzida = await reduzirImagem(arquivo);
		previa.querySelector("img").src = fotoReduzida;
		previa.hidden = false;
	} catch (e) {
		fotoReduzida = null;
		campoFoto.value = "";
		avisar("Não foi possível abrir essa imagem. Tente outra.", "erro");
	}
});

document.querySelector("#foto-remover").addEventListener("click", () => {
	fotoReduzida = null;
	campoFoto.value = "";
	previa.hidden = true;
	campoFoto.focus();
});

// ---------- Mapa: marcação opcional do local ----------
let pontoMarcado = null;
const PREFIXO_LOCAL = "Local marcado no mapa: ";

// Troca (ou remove) só a linha do local, preservando o que o morador escreveu
function atualizarLinhaLocal(texto) {
	const semLocal = form.descricao.value
		.split("\n")
		.filter((linha) => !linha.startsWith(PREFIXO_LOCAL))
		.join("\n")
		.trimEnd();
	const novo = !texto
		? semLocal
		: semLocal
			? `${semLocal}\n${PREFIXO_LOCAL}${texto}`
			: PREFIXO_LOCAL + texto;
	if (novo.length > 1000) {
		avisar(
			"A descrição passaria de 1000 caracteres. Encurte o texto para incluir o local.",
			"erro",
		);
		return;
	}
	form.descricao.value = novo;
}

// Busca o endereço aproximado do ponto no Nominatim (OpenStreetMap)
async function enderecoDoPonto(lat, lng) {
	const coordenadas = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
	try {
		const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=pt-BR`;
		const resposta = await fetch(url);
		if (!resposta.ok) return coordenadas;
		const dados = await resposta.json();
		const a = dados.address || {};
		const rua = [a.road, a.house_number].filter(Boolean).join(", ");
		const bairro = a.suburb || a.neighbourhood || a.quarter || "";
		const texto = [rua, bairro].filter(Boolean).join(" - ");
		return texto ? `${texto} (aproximado)` : coordenadas;
	} catch (e) {
		return coordenadas;
	}
}

if (mapaDisponivel()) {
	document.querySelector("#campo-mapa").hidden = false;
	const mapa = criarMapa("mapa-nova");
	// ---------- Centraliza o mapa no bairro escolhido ----------
	const avisoMapa = document.querySelector("#aviso-mapa");

	function irParaBairro() {
		const id = Number(form.bairro.value);
		if (!id) return;
		const posicao = POSICAO_BAIRROS[id];
		if (posicao) {
			// Vai até o bairro mantendo o zoom atual (no mínimo 15)
			mapa.setView(posicao, Math.max(mapa.getZoom(), 15));
			avisoMapa.hidden = true;
		} else {
			// Bairro sem posição conhecida: mostra a cidade e pede para aproximar
			mapa.setView(CENTRO_ITAPETININGA, id === 1 ? 11 : 13);
			avisoMapa.hidden = false;
		}
	}

	form.bairro.addEventListener("change", irParaBairro);
	irParaBairro();

	const remover = document.querySelector("#mapa-remover");
	let marcador = null;
	let pedidoAtual = 0; // ignora respostas antigas se a pessoa clicar várias vezes

	mapa.on("click", async (e) => {
		pontoMarcado = e.latlng;
		if (marcador) marcador.setLatLng(e.latlng);
		else marcador = L.marker(e.latlng).addTo(mapa);
		remover.hidden = false;

		const pedido = ++pedidoAtual;
		atualizarLinhaLocal("buscando endereço...");
		const texto = await enderecoDoPonto(e.latlng.lat, e.latlng.lng);
		if (pedido === pedidoAtual && pontoMarcado) atualizarLinhaLocal(texto);
	});

	remover.addEventListener("click", () => {
		if (marcador) {
			mapa.removeLayer(marcador);
			marcador = null;
		}
		pontoMarcado = null;
		pedidoAtual++;
		atualizarLinhaLocal(null);
		remover.hidden = true;
	});
}

form.addEventListener("submit", (evento) => {
	evento.preventDefault();
	const valores = {
		categoriaId: form.categoria.value,
		bairroId: form.bairro.value,
		titulo: form.titulo.value,
		endereco: form.endereco.value,
		descricao: form.descricao.value,
		foto: fotoReduzida,
		latitude: pontoMarcado ? pontoMarcado.lat : null,
		longitude: pontoMarcado ? pontoMarcado.lng : null,
	};

	const faltando = [];
	if (!valores.categoriaId) faltando.push("a categoria");
	if (!valores.bairroId) faltando.push("o bairro");
	if (valores.titulo.trim().length < 5)
		faltando.push("um título com pelo menos 5 caracteres");
	if (!valores.endereco.trim())
		faltando.push("o endereço ou ponto de referência");
	const textoProprio = valores.descricao
		.split("\n")
		.filter((l) => !l.startsWith(PREFIXO_LOCAL))
		.join("\n");
	if (textoProprio.trim().length < 20)
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
