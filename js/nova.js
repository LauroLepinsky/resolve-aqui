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

form.addEventListener("submit", (evento) => {
	evento.preventDefault();
	const valores = {
		categoriaId: form.categoria.value,
		bairroId: form.bairro.value,
		titulo: form.titulo.value,
		endereco: form.endereco.value,
		descricao: form.descricao.value,
		foto: fotoReduzida,
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
