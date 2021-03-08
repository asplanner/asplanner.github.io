import PlannerView from "./PlannerView.js";

export default class Arquetipos {
	view = new PlannerView();

	run(arq) {
		this.cleanArqBonus();
		this[arq.toLowerCase()]();

		this.atualizaBonus();
	}

	cleanArqBonus() {
		$('input[id^="ip-arq"]').val('0');
		$('#ip-choice').val('');
	}

	atualizaBonus() {
		this.view.clearBonusTier();
		this.view.calculaBonusTier();		
	}

	treoir() {
		$('#txt-vantagem').text(`Habilidade de invocação - Draugr: invoca um Draugr de Madeira Sagrada Flamejante para combate. Seus braços são como lâminas incandescentes de madeira e eles podem utilizar todas as habilidades de fogo que seu invocador possuir, além de serem imunes ao fogo e à Luz (e 5 pontos mais fracos a elementos antagonistas).\n- Observação: Os Atributos Físicos do Draugr são todos iguais e espelham a Energia atual do Treoir; a quantidade de Draugrs invocados por vez é limitada pelo Tier atual do personagem: Tier 1 só pode invocar 1 Draugr, Tier 2 pode invocar até 2 Draugrs, assim sucessivamente.`);
		$('#txt-desvantagem').text('-5 em Força.');
		$('#txt-requerimento').text('Ser um humano pertencente ao clã Treoir, sob as ordens da Rainha Branca e residente da Cidade de Leradr; ter Natureza Luz.');

		let oldVal = parseInt($('#ip-arq-str').val());
		$('#ip-arq-str').val( this.view.addSinal(oldVal - 5));
	}

	laidir() {
		$('#txt-vantagem').text(`permite ao personagem elevar seus Atributos Físicos, com exceção de Energia, ao distribuir o valor do seu Level de Personagem em Força, Agilidade e/ou Destreza.\n- Observação: o tempo do aumento é definido pelo Tier do personagem; Tier 1 terá o aumento por uma rodada, Tier 2 terá o aumento por duas rodadas, assim sucessivamente; quando a habilidade expirar, o personagem não poderá reutilizar esse aprimoramento pela mesma quantidade de rodadas em que ela ficou ativa.`);
		$('#txt-desvantagem').text('-5 em Energia.');
		$('#txt-requerimento').text('Ser um humano pertencente ao clã Laidir, sob as ordens da Rainha Vermelha e residente da Cidade dos Homens; ter Natureza Sombra.');

		let oldVal = parseInt($('#ip-arq-ene').val());
		$('#ip-arq-ene').val( this.view.addSinal(oldVal - 5));
	}

	animalesco() {
		swal.fire({
			title: 'Escolha',
			icon: 'info',
			html: `Por favor, escolha um atributo para receber +2 de bonus:
			<br>
			<button type="button" id="ch-str-up" class="swal2-confirm swal2-styled" style="display: inline-block;" onclick="swal.closeModal(); return false;">Força</button>
			<button type="button" id="ch-agi-up" class="swal2-confirm swal2-styled" style="display: inline-block;" onclick="swal.closeModal(); return false;">Agilidade</button>
			<button type="button" id="ch-dex-up" class="swal2-confirm swal2-styled" style="display: inline-block;" onclick="swal.closeModal(); return false;">Destreza</button>`,
			willClose: function() {
				swal.fire({
					title: 'Escolha',
					icon: 'info',
					html: `Por favor, escolha um atributo para receber -3 de bonus:
					<br>
					<button type="button" id="ch-str-down" class="swal2-confirm swal2-styled" style="display: inline-block;" onclick="swal.closeModal(); return false;">Força</button>
					<button type="button" id="ch-agi-down" class="swal2-confirm swal2-styled" style="display: inline-block;" onclick="swal.closeModal(); return false;">Agilidade</button>
					<button type="button" id="ch-dex-down" class="swal2-confirm swal2-styled" style="display: inline-block;" onclick="swal.closeModal(); return false;">Destreza</button>`,
					showCancelButton: false,
					showConfirmButton: false,
					showCloseButton: true
				});
			},
			showCancelButton: false,
			showConfirmButton: false,
			showCloseButton: true
		});

		$(document).on('click', '#ch-str-up', () => { $('#ip-arq-str').val(this.view.addSinal(2)); this.atualizaBonus(); });
		$(document).on('click', '#ch-agi-up', () => { $('#ip-arq-agi').val(this.view.addSinal(2)); this.atualizaBonus(); });
		$(document).on('click', '#ch-dex-up', () => { $('#ip-arq-dex').val(this.view.addSinal(2)); this.atualizaBonus(); });

		$(document).on('click', '#ch-str-down', () => { $('#ip-arq-str').val(this.view.addSinal(-3)); this.atualizaBonus(); });
		$(document).on('click', '#ch-agi-down', () => { $('#ip-arq-agi').val(this.view.addSinal(-3)); this.atualizaBonus(); });
		$(document).on('click', '#ch-dex-down', () => { $('#ip-arq-dex').val(this.view.addSinal(-3)); this.atualizaBonus(); });

		$('#txt-vantagem').text('poder se transformar num animal completo se for sangue puro ou numa forma híbrida se for mestiço e também fazer tudo o que o animal escolhido faz enquanto na forma animal; aves voarão, sapos saltarão, predadores terão garras, presas e sentidos aguçados.\n- Observação: O jogador deve escolher qual animal seu personagem será e ele só poderá se transformar, através desta habilidade, no animal escolhido.');
		$('#txt-desvantagem').text('-3 em um Atributo Físico à escolha do jogador, com exceção de Energia.');
		$('#txt-requerimento').text('ser um animal ou um híbrido de animal.');
	}

	bestial() {
		swal.fire({
			title: 'Escolha',
			icon: 'info',
			html: `Por favor, escolha um atributo para receber +3 de bonus(os outros dois recebem -2):
			<br>
			<button type="button" id="ch-str-up-bestial" class="swal2-confirm swal2-styled" style="display: inline-block;" onclick="swal.closeModal(); return false;">Força</button>
			<button type="button" id="ch-agi-up-bestial" class="swal2-confirm swal2-styled" style="display: inline-block;" onclick="swal.closeModal(); return false;">Agilidade</button>
			<button type="button" id="ch-dex-up-bestial" class="swal2-confirm swal2-styled" style="display: inline-block;" onclick="swal.closeModal(); return false;">Destreza</button>`,
			showCancelButton: false,
			showConfirmButton: false,
			showCloseButton: true
		});

		$(document).on('click', '#ch-str-up-bestial', () => { 
			$('#ip-arq-str').val(this.view.addSinal(3));
			$('#ip-arq-dex').val(this.view.addSinal(-2));
			$('#ip-arq-agi').val(this.view.addSinal(-2));
			this.atualizaBonus();
		});

		$(document).on('click', '#ch-agi-up-bestial', () => { 
			$('#ip-arq-agi').val(this.view.addSinal(3));
			$('#ip-arq-dex').val(this.view.addSinal(-2));
			$('#ip-arq-str').val(this.view.addSinal(-2));
			this.atualizaBonus();
		});

		$(document).on('click', '#ch-dex-up-bestial', () => { 
			$('#ip-arq-dex').val(this.view.addSinal(3));
			$('#ip-arq-str').val(this.view.addSinal(-2));
			$('#ip-arq-agi').val(this.view.addSinal(-2));
			this.atualizaBonus();
		});

		$('#txt-vantagem').text(`+3 em um Atributo Físico à escolha do jogador, com exceção de Energia;\nGarras, presas e/ou características específicas do monstro em questão.\nHabilidade - Sentidos Aguçados: a besta tem seu olfato, sua audição e sua visão 3x superiores às dos humanos.\n- Observação: Tato e paladar se mantêm regulares.`);
		$('#txt-desvantagem').text('-2 em dois Atributos Físicos à escolha do jogador, com exceção de Energia; hostilidade por sociedades humanas.');
		$('#txt-requerimento').text('ser uma besta ou um monstro.');
	}

	mistico() {
		swal.fire({
			title: 'Escolha',
			icon: 'info',
			html: `Por favor, escolha entre priorizar atributos ou slots de habilidade:
			<br>
			<button type="button" id="ch-attr" class="swal2-confirm swal2-styled" style="display: inline-block;" onclick="swal.closeModal(); return false;">Atributos</button>
			<button type="button" id="ch-slots" class="swal2-confirm swal2-styled" style="display: inline-block;" onclick="swal.closeModal(); return false;">Slots de Habilidade</button>`,
			showCancelButton: false,
			showConfirmButton: false,
			showCloseButton: true
		});

		$(document).on('click', '#ch-attr', () => { $('#ip-choice').val('attr'); this.view.atualizaAtributos(); });
		$(document).on('click', '#ch-slots', () => { $('#ip-choice').val('slot'); this.view.atualizaAtributos(); });
		
		$('#txt-vantagem').text('O jogador deve escolher se ele quer priorizar Level de Personagem ou Slot de Habilidade: os valores do que for comprado em prioridade custarão 50% do seu valor (valores quebrados serão arredondados para cima).');
		$('#txt-desvantagem').text('Os valores do que for comprado sem prioridade terão 150% do seu valor (valores quebrados serão arredondados para baixo).');
		$('#txt-requerimento').text('ser um ser místico.');
	}

	undead() {
		$('#txt-vantagem').text('o personagem não detém as mesmas necessidades básicas humanas pra sobreviver, como respirar ou descansar; o undead também pode ter outras características específicas que devem ser indicadas pelo jogador na hora da criação do personagem.');
		$('#txt-desvantagem').text('única forma de regenerar danos é através de necromancia; não pode comprar habilidades físicas; hostilidade pela sociedade humana.');
		$('#txt-requerimento').text('ser um morto-vivo. Não ter Natureza Luz.');
	}

	reborn() {
		$('#txt-vantagem').text(`o personagem não detém as mesmas necessidades básicas humanas pra sobreviver, como respirar ou descansar.\n- Observação: as necessidades básicas podem mudar de acordo com o tipo de undead. O jogador deve anunciar quais são as características específicas do seu personagem na hora de escolher este arquétipo, para que seja calculada a desvantagem.\nAlimentação: quando o personagem se alimenta, durante as próximas 24h a eficiência de suas habilidades aumenta em 5 níveis.\n- Observação: não pode ser alimento convencional; vampiros se alimentarão de sangue humano, ghouls se alimentarão de carne humana.`);
		$('#txt-desvantagem').text('-1 em todos os Atributos Físicos durante o dia ou se expostos à Luz Sagrada para cada característica não-humana; hostilidade pela sociedade humana caso sejam descobertos como Reborns.');
		$('#txt-requerimento').text('ser um personagem renascido, como um vampiro. Não ter Natureza Luz.');
	}

	elemental() {
		swal.fire({
			title: 'Escolha',
			icon: 'info',
			html: `Por favor, escolha seu elemento:
			<br>
			<button type="button" class="swal2-confirm swal2-styled elemental-btn" style="display: inline-block;" onclick="swal.closeModal(); return false;" elemento="Fogo">Fogo</button>
			<button type="button" class="swal2-confirm swal2-styled elemental-btn" style="display: inline-block;" onclick="swal.closeModal(); return false;" elemento="Água">Água</button>
			<button type="button" class="swal2-confirm swal2-styled elemental-btn" style="display: inline-block;" onclick="swal.closeModal(); return false;" elemento="Terra">Terra</button>
			<br>
			<button type="button" class="swal2-confirm swal2-styled elemental-btn" style="display: inline-block;" onclick="swal.closeModal(); return false;" elemento="Ar">Ar</button>
			<button type="button" class="swal2-confirm swal2-styled elemental-btn" style="display: inline-block;" onclick="swal.closeModal(); return false;" elemento="Eletricidade">Eletricidade</button>
			<button type="button" class="swal2-confirm swal2-styled elemental-btn" style="display: inline-block;" onclick="swal.closeModal(); return false;" elemento="Gelo">Gelo</button>`,
			showCancelButton: false,
			showConfirmButton: false,
			showCloseButton: true
		});

		$(document).on('click', '.elemental-btn', function() {
			let elemento = $(this).attr('elemento');
			$('#txt-vantagem').text($('#txt-vantagem').text() + '\n\nElemento selecionado: ' + elemento);
		});

		$('#txt-vantagem').text('Imunidade ao próprio elemento; Especialização Elemental - [Elemento].');
		$('#txt-desvantagem').text('-5 de resistência contra elementos antagonistas.');
		$('#txt-requerimento').text('ser um ser elemental.');
	}

	espiritual() {
		$('#txt-vantagem').text('Pertence à Segunda Camada da Realidade, a Camada Espiritual; Corpo celeste: o corpo de um ser espiritual não detém órgãos nem nenhuma das necessidades básicas dos humanos para viver;\nSexto sentido: o personagem espiritual, quando está na Segunda Camada, pode se deixar ser visto e ouvido por quem ele quiser da Primeira Camada e, quando na Primeira Camada, pode ver e ouvir tudo o que se passa na Segunda Camada.');
		$('#txt-desvantagem').text('O espírito não pode fazer travessia alguma para o Plano Material, necessitando de um hospedeiro vivo para interagir diretamente com o mundo dos vivos.');
		$('#txt-requerimento').text('ser um ser espiritual.');
	}

	cyberpunk() {
		swal.fire({
			title: 'Escolha',
			icon: 'info',
			html: `Por favor, informe quantos itens tencologicos usará neste personagem:
			<br>
			<button type="button" qtd="1" class="swal2-confirm swal2-styled ch-tecnologico" style="display: inline-block;" onclick="swal.closeModal(); return false;">Um</button>
			<button type="button" qtd="2" class="swal2-confirm swal2-styled ch-tecnologico" style="display: inline-block;" onclick="swal.closeModal(); return false;">Dois</button>
			<button type="button" qtd="3" class="swal2-confirm swal2-styled ch-tecnologico" style="display: inline-block;" onclick="swal.closeModal(); return false;">Três</button>`,
			showCancelButton: false,
			showConfirmButton: false,
			showCloseButton: true
		});

		let self = this;

		$(document).on('click', '.ch-tecnologico', function() {
			let qtd = parseInt($(this).attr('qtd'));

			$('#ip-arq-ene').val(self.view.addSinal(-3 * qtd));
			self.atualizaBonus();
		})

		$('#txt-vantagem').text('Até três itens iniciais à escolha do jogador que podem ser de uma tecnologia mais avançada que a steampunk (século XIX).');
		$('#txt-desvantagem').text('-03 em Energia para cada item tecnológico.');
		$('#txt-requerimento').text('ser um Estrangeiro; alguém que veio de outro Universo e não pertence inicialmente à All Spark.');
	}

	dragao() {
		if(parseInt($('#ip-exp-inicial').val()) < 150) {
			$('#sl-arquetipo').val('');
			swal.fire('Atenção!', 'É necessário possuir 150 ou mais pontos totais para este tipo de arquétipo')
			return;
		}

		$('#txt-vantagem').text('+10 em todos os Atributos Físicos; fala o Apodon; vôo; escamas resistentes como aço; garras, presas, asas e 20 metros de altura;\nChama dracônica (vermelha ou azul): o dragão consegue disparar chamas de sua boca.\n- Observação: Chamas vermelhas queimam mais forte que chamas comuns; chamas azuis extraem o calor do alvo e congelam.');
		$('#txt-desvantagem').text('não fala a língua comum humana, sua tentativa de fala é entendida como um rugido feroz pelos humanos; hostilidade pelas sociedades humanas.');
		$('#txt-requerimento').text('ser um dragão; ficha inicial deve conter um mínimo de 150 pontos totais.', 'error');

		$('#ip-arq-str').val(parseInt(this.view.addSinal($('#ip-arq-str').val()) + 10));
		$('#ip-arq-agi').val(parseInt(this.view.addSinal($('#ip-arq-agi').val()) + 10));
		$('#ip-arq-dex').val(parseInt(this.view.addSinal($('#ip-arq-dex').val()) + 10));
		$('#ip-arq-ene').val(parseInt(this.view.addSinal($('#ip-arq-ene').val()) + 10));
	}

	divindade() {
		if(parseInt($('#ip-exp-inicial').val()) < 500) {
			$('#sl-arquetipo').val('');
			swal.fire('Atenção!', 'É necessário possuir 500 ou mais pontos totais para este tipo de arquétipo', 'error');
			return;
		}

		$('#txt-vantagem').text('+10 em todos os Atributos Físicos.\nFace Conceitual: o personagem é a Face de um Conceito à escolha do jogador e pode manipulá-lo dentro da Realidade.');
		$('#txt-desvantagem').text('nenhuma');
		$('#txt-requerimento').text('ser uma deidade; ficha inicial deve conter um mínimo de 500 pontos totais.');

		$('#ip-arq-str').val(parseInt(this.view.addSinal($('#ip-arq-str').val()) + 10));
		$('#ip-arq-agi').val(parseInt(this.view.addSinal($('#ip-arq-agi').val()) + 10));
		$('#ip-arq-dex').val(parseInt(this.view.addSinal($('#ip-arq-dex').val()) + 10));
		$('#ip-arq-ene').val(parseInt(this.view.addSinal($('#ip-arq-ene').val()) + 10));
	}

	basico() {
		$('#txt-vantagem').text('+5 pontos totais na criação da ficha, acumulando 35.');
		$('#txt-desvantagem').text('Nenhuma.');
		$('#txt-requerimento').text('Nenhum.');

		swal.fire('Atenção!', 'Por favor, ajuste seus pontos iniciais para 35 caso já não tenha feito', 'info')
	}
}