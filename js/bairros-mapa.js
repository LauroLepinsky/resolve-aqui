// Posição aproximada (latitude, longitude) do centro de cada bairro de Itapetininga.
// Obtida com o Nominatim (OpenStreetMap): pelo nome do bairro ou, quando o nome
// não foi encontrado, pelo ponto do meio entre ruas do bairro listadas na base
// de CEPs dos Correios (ViaCEP). Bairros sem posição abrem o mapa no centro da cidade.

// Bairros sem posição conhecida (10). Não foram encontrados no Nominatim
// nem pelo nome nem pelas ruas do ViaCEP. Ao serem escolhidos, o mapa abre
// no centro da cidade com um aviso para o morador aproximar manualmente.
//   1: Área Rural de Itapetininga (abre com o município inteiro, zoom 11)
//  11: Canta Galo
//  36: Jardim das Rosas
//  47: Jardim Nova Aliança
//  59: Loteamento Jardim Esperança
//  86: Sabiaúna
//  88: Therezinha Piedade
// 121: Vila Kalil Halak
// 123: Vila Leonor
// 139: Vila Palmeira
//
// Para incluir um deles, acrescente uma linha no formato
//   id: [latitude, longitude], // Nome do bairro
// (por exemplo, copiando as coordenadas do Google Maps: clique com o botão
// direito no centro do bairro e clique no primeiro item do menu, que copia
// a latitude e a longitude).

const POSICAO_BAIRROS = {
	// 1: sem posição conhecida (Área Rural de Itapetininga)
	2: [-23.84234, -48.20747], // Bairro Biscoito Duro
	3: [-23.56499, -48.18168], // Bairro do Moquem
	4: [-23.63184, -48.12272], // Bairro do Porto
	5: [-23.618, -48.08789], // Bairro do Porto Velho
	6: [-23.56848, -48.07857], // Bairro do Quaresma
	7: [-23.78672, -48.31926], // Bairro do Retiro
	8: [-23.58918, -48.09148], // Bairro Ponte Alta
	9: [-23.81658, -48.25797], // Bairro Turvo dos Rodrigues
	10: [-23.6038, -48.06861], // Cambuí
	// 11: sem posição conhecida (Canta Galo)
	12: [-23.53839, -48.05416], // Capão Alto
	13: [-23.6006, -48.05733], // Central Parque 4-L
	14: [-23.58949, -48.04745], // Centro
	15: [-23.57036, -48.07828], // Chácara Barro Branco
	16: [-23.57584, -47.98667], // Chácaras Alvorada
	17: [-23.57827, -47.97152], // Chapada Grande
	18: [-23.6298, -48.03773], // Chapadinha
	19: [-23.68179, -48.1078], // Conceição
	20: [-23.56663, -48.02607], // Conjunto Habitacional Itapetininga F3
	21: [-23.56725, -48.02678], // Conjunto Habitacional Nisshinbo do Brasil
	22: [-23.60629, -48.14758], // Curuça I
	23: [-23.60629, -48.14758], // Curuça II
	24: [-23.60629, -48.14758], // Curuça III
	25: [-23.62333, -48.04694], // Estância Conceição
	26: [-23.75276, -47.91621], // Faxinal do Rio Acima
	27: [-23.59267, -48.06298], // Jardim Alvorada
	28: [-23.6113, -48.07994], // Jardim Bela Vista
	29: [-23.57772, -48.02145], // Jardim Brasil
	30: [-23.57045, -48.0424], // Jardim Casa Grande
	31: [-23.62194, -48.06867], // Jardim Colombo
	32: [-23.57164, -47.99083], // Jardim Cruzeiro do Sul
	33: [-23.5554, -48.04534], // Jardim das Flores
	34: [-23.59703, -48.0567], // Jardim das Laranjeiras
	35: [-23.59512, -48.01009], // Jardim das Palmas
	// 36: sem posição conhecida (Jardim das Rosas)
	37: [-23.58759, -48.02706], // Jardim Florestal
	38: [-23.58513, -48.01721], // Jardim Fogaça
	39: [-23.58971, -48.03386], // Jardim Itália
	40: [-23.58552, -48.07901], // Jardim Leonel
	41: [-23.56993, -48.01856], // Jardim Marabá
	42: [-23.5879, -48.06211], // Jardim Maria Luiza
	43: [-23.58276, -48.02315], // Jardim Maricota
	44: [-23.57375, -48.02461], // Jardim Mesquita
	45: [-23.58341, -47.94762], // Jardim Monte Santo
	46: [-23.57014, -48.03849], // Jardim Moraes Rosa
	// 47: sem posição conhecida (Jardim Nova Aliança)
	48: [-23.57887, -48.00277], // Jardim Nova Era
	49: [-23.58785, -47.99866], // Jardim Novo Aeroporto
	50: [-23.58124, -48.02869], // Jardim Paulista
	51: [-23.57741, -48.05224], // Jardim Santa Inêz
	52: [-23.56293, -48.05019], // Jardim São Camilo
	53: [-23.56928, -48.04438], // Jardim São Sebastião
	54: [-23.59257, -48.07155], // Jardim Shangri-lá
	55: [-23.57044, -48.027], // Jardim Vieira de Moraes
	56: [-23.57984, -48.01777], // Jardim Yara
	57: [-23.58013, -48.00591], // Loteamento Gramado I
	58: [-23.58013, -48.00591], // Loteamento Gramado II
	// 59: sem posição conhecida (Loteamento Jardim Esperança)
	60: [-23.56592, -48.01071], // Loteamento Residencial Golden Ville
	61: [-23.59137, -48.07115], // Loteamento Residencial Lisboa
	62: [-23.57191, -48.0762], // Loteamento Residencial Nascentes
	63: [-23.57558, -48.01396], // Loteamento Residencial Reserva das Paineiras
	64: [-23.62449, -48.07101], // Loteamento Residencial Spazio Verde I
	65: [-23.62449, -48.07101], // Loteamento Residencial Spazio Verde II
	66: [-23.57909, -47.99877], // Loteamento Residencial Tivolli
	67: [-23.5348, -48.01845], // Mato Seco
	68: [-23.58871, -48.01613], // Morada do Sol
	69: [-23.59547, -48.0661], // Parque Atenas do Sul
	70: [-23.57942, -48.03255], // Parque da Lagoa
	71: [-23.5628, -48.07585], // Parque Itapê
	72: [-23.60974, -48.06941], // Parque São Bento
	73: [-23.58072, -48.12158], // Pinhal
	74: [-23.55919, -48.00287], // Portal da Figueira
	75: [-23.56677, -48.0202], // Portal dos Pinheiros I
	76: [-23.56301, -48.02279], // Portal dos Pinheiros II
	77: [-23.56036, -48.02723], // Portal dos Pinheiros III
	78: [-23.59801, -48.31714], // Rechan
	79: [-23.59068, -48.07777], // Residencial Flor de Lis
	80: [-23.56162, -48.01743], // Residencial Lago dos Ipês
	81: [-23.56675, -48.02853], // Residencial Morada dos Ipês
	82: [-23.58045, -48.08863], // Residencial Reserva da Mata
	83: [-23.62383, -48.05293], // Residencial Villaggio di Capri
	84: [-23.62035, -48.04451], // Retiro Santana
	85: [-23.75276, -47.91621], // Rio Acima
	// 86: sem posição conhecida (Sabiaúna)
	87: [-23.56946, -48.0162], // Terras de Santo Antônio
	// 88: sem posição conhecida (Therezinha Piedade)
	89: [-23.54357, -48.2151], // Tupy
	90: [-23.61027, -48.02718], // Vale San Fernando
	91: [-23.72791, -48.1998], // Varginha
	92: [-23.61066, -48.0337], // Vida Nova Itapetininga
	93: [-23.59495, -48.05486], // Vila Aliança
	94: [-23.59136, -48.07392], // Vila Alves
	95: [-23.58369, -48.03395], // Vila Aparecida
	96: [-23.61811, -48.04338], // Vila Apolo
	97: [-23.57171, -48.03494], // Vila Arruda
	98: [-23.59336, -48.02044], // Vila Asem
	99: [-23.57504, -48.03494], // Vila Aurora
	100: [-23.56701, -48.03285], // Vila Ayres
	101: [-23.59998, -48.05092], // Vila Barth
	102: [-23.55891, -48.03761], // Vila Belo Horizonte
	103: [-23.60529, -48.05361], // Vila Camarão
	104: [-23.60208, -48.06461], // Vila Carolina
	105: [-23.56751, -48.04091], // Vila Carvalho
	106: [-23.56436, -48.02064], // Vila Célia
	107: [-23.59314, -48.05356], // Vila Cubatão
	108: [-23.58564, -48.05677], // Vila Deyse
	109: [-23.59533, -48.07386], // Vila dos Bandeirantes
	110: [-23.58992, -48.02036], // Vila Eldorado
	111: [-23.59092, -48.07264], // Vila Esplanada
	112: [-23.59626, -48.05592], // Vila Francisca
	113: [-23.5879, -48.06211], // Vila Garrido
	114: [-23.59218, -48.05562], // Vila Ginez
	115: [-23.57983, -48.04988], // Vila Godói
	116: [-23.57972, -48.03573], // Vila Grace
	117: [-23.58296, -48.07034], // Vila Hungria
	118: [-23.60165, -48.00163], // Vila Itapetininga
	119: [-23.57791, -48.04926], // Vila José Salem
	120: [-23.57934, -48.03162], // Vila Judite
	// 121: sem posição conhecida (Vila Kalil Halak)
	122: [-23.60632, -48.04603], // Vila La Brunetti
	// 123: sem posição conhecida (Vila Leonor)
	124: [-23.57014, -48.02532], // Vila Luiz Antônio
	125: [-23.57137, -48.02799], // Vila Macia
	126: [-23.59602, -48.06155], // Vila Maciel
	127: [-23.59406, -48.04341], // Vila Maria
	128: [-23.57854, -48.05481], // Vila Maria Isabel
	129: [-23.57014, -48.07943], // Vila Mazarino
	130: [-23.57282, -48.07984], // Vila Mazzei
	131: [-23.58716, -48.02963], // Vila Monteiro
	132: [-23.61373, -48.06109], // Vila Nastri
	133: [-23.59349, -48.04019], // Vila Nova
	134: [-23.59556, -48.03638], // Vila Nova Itapetininga
	135: [-23.57654, -48.02394], // Vila Novo Horizonte
	136: [-23.57856, -48.04229], // Vila Olho D'Agua
	137: [-23.57742, -48.06049], // Vila Oliveira
	138: [-23.57777, -48.04428], // Vila Orestes
	// 139: sem posição conhecida (Vila Palmeira)
	140: [-23.58267, -48.05746], // Vila Piedade
	141: [-23.55415, -48.01444], // Vila Popular
	142: [-23.56477, -48.02978], // Vila Prado
	143: [-23.57562, -48.03992], // Vila Prestes
	144: [-23.57474, -48.01697], // Vila Progresso
	145: [-23.5724, -48.00935], // Vila Recreio
	146: [-23.58287, -48.07446], // Vila Regina
	147: [-23.57202, -48.04064], // Vila Reis
	148: [-23.5904, -48.01574], // Vila Rica
	149: [-23.58933, -48.06823], // Vila Rio Branco
	150: [-23.57924, -48.04206], // Vila Rocha
	151: [-23.59249, -48.04623], // Vila Rosa
	152: [-23.59465, -48.06071], // Vila Rubens
	153: [-23.57846, -48.04481], // Vila Salém
	154: [-23.58806, -48.07312], // Vila Santa Isabel
	155: [-23.58326, -48.05006], // Vila Santana
	156: [-23.62745, -48.05186], // Vila São Gonçalo
	157: [-23.60156, -48.04626], // Vila São José
	158: [-23.58117, -48.03761], // Vila São Pedro
	159: [-23.60079, -48.04255], // Vila Serafim
	160: [-23.59007, -48.0755], // Vila Sonia
	161: [-23.61848, -48.0888], // Vila Sottemo
	162: [-23.57428, -48.03199], // Vila Vendramini
	163: [-23.58338, -48.02356], // Vila Visaltino Gomes
};
