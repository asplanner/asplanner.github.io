import Arquetipos from "./Arquetipos.js";

export default class PlannerView {

	init() {
		this.setElementActions();
		this.startBootstrapPlugins()
	}

	setElementActions() {
		let self = this;

		$('.baseAttr,#ip-exp-inicial').change(() => this.atualizaAtributos());
		$('.treina').click(function() { self.addTreinamento(this) });
		$('#sl-arquetipo').change(this.arquetiposOnClick);
	}

	startBootstrapPlugins() {
		// tooltips
		$(function () {
		  $('[data-toggle="tooltip"]').tooltip()
		})
	}

	updateTooltips() {
		$('#ip-b-str').attr('title', `Arquétipo: ${$('#ip-arq-str').val()}, Tier: ${$('#ip-tier-str').val()}, Treinamento: ${$('#ip-tre-str').val()}`);
		$('#ip-b-agi').attr('title', `Arquétipo: ${$('#ip-arq-agi').val()}, Tier: ${$('#ip-tier-agi').val()}, Treinamento: ${$('#ip-tre-agi').val()}`);
		$('#ip-b-dex').attr('title', `Arquétipo: ${$('#ip-arq-dex').val()}, Tier: ${$('#ip-tier-dex').val()}, Treinamento: ${$('#ip-tre-dex').val()}`);
		$('#ip-b-ene').attr('title', `Arquétipo: ${$('#ip-arq-ene').val()}, Tier: ${$('#ip-tier-ene').val()}, Treinamento: ${$('#ip-tre-ene').val()}`);
		$('#ip-b-slots').attr('title', `Treinamento: ${$('#ip-tre-slots').val()}`);
	}

	atualizaAtributos() {
		let attrs = this.getAttr();
		let level = attrs.str + attrs.agi + attrs.dex + attrs.ene;
		let choice = $('#ip-choice').val();
		let mod = [undefined, undefined];
		if(choice && choice == 'attr') mod = ['+', '-'];
		if(choice && choice == 'slot') mod = ['-', '+'];

		let pontosUsados = this.calculaAtributos(level, mod[0]) + this.calculaAtributos(parseInt($('#ip-slots').val()), mod[1]);

		$('#ip-exp-usada').val(pontosUsados)
		$('#ip-exp-final').val(parseInt($('#ip-exp-inicial').val()) - pontosUsados);
		if($('#ip-exp-final').val() < 0) swal.fire('Pontos insuficientes!');
	}

	atualizaBonus() {
		$('#ip-b-str').val(this.addSinal(parseInt($("#ip-arq-str").val()) + parseInt($("#ip-tier-str").val()) + parseInt($("#ip-tre-str").val())));
		$('#ip-b-agi').val(this.addSinal(parseInt($("#ip-arq-agi").val()) + parseInt($("#ip-tier-agi").val()) + parseInt($("#ip-tre-agi").val())));
		$('#ip-b-dex').val(this.addSinal(parseInt($("#ip-arq-dex").val()) + parseInt($("#ip-tier-dex").val()) + parseInt($("#ip-tre-dex").val())));
		$('#ip-b-ene').val(this.addSinal(parseInt($("#ip-arq-ene").val()) + parseInt($("#ip-tier-ene").val()) + parseInt($("#ip-tre-ene").val())));
		$('#ip-b-slots').val(this.addSinal(parseInt($("#ip-tre-slots").val())));

		this.updateTooltips();
	}

	calculaAtributos(lv, mist) {
	    // mist == '+' ? vantagem
	    // mist == '-' ? desvantagem
	    // mist == undefined ? neutro

	    let pontos = 0;
	    let levelAtual = 0;

	    for (let i = 0; i < lv; i++) {
	        ++levelAtual
	        if(mist == "+") pontos += Math.ceil(levelAtual * 0.5);
	        if(mist == "-") pontos += Math.floor(levelAtual * 1.5);
	        if(!mist) pontos += levelAtual;
	    }

	    this.calculaBonusTier();
	    
	    return pontos;
	}

	calculaBonusTier() {
		let highest = this.getMaxAttr();
		let bonus = 0;

		if(highest >= 10) bonus += 2 // tier 2
		if(highest >= 20) bonus += 3 // tier 3
		if(highest >= 30) bonus += 4 // tier 4
		if(highest >= 40) bonus += 5 // tier 5
		if(highest >= 50) bonus += 6 // tier 6
		if(highest >= 60) bonus += 7 // tier 7
		if(highest >= 70) bonus += 8 // tier 8
		if(highest >= 80) bonus += 9 // tier 9
		if(highest >= 90) bonus += 10 // tier 10

		$('input[id^="ip-tier"]').val(bonus);
		this.atualizaBonus();
	}

	addTreinamento(botao) {
		let idTreina = '#' + $(botao).attr('t');
		let oldVal = parseInt($(idTreina).val())
		$(idTreina).val( ++oldVal );
		this.atualizaBonus();
	}

	addSinal(number) {
		return number <= 0 ? number : '+' + number; 
	}

	getAttr() {
		return {
			'str': parseInt($('#ip-str').val()) || 0,
			'agi': parseInt($('#ip-agi').val()) || 0,
			'dex': parseInt($('#ip-dex').val()) || 0,
			'ene': parseInt($('#ip-ene').val()) || 0
		}
	}

	getMaxAttr() {
		let attrs = this.getAttr();
		return Math.max(attrs.str, attrs.agi, attrs.dex, attrs.ene);
	}

	arquetiposOnClick() {
		let arquetipo = $(this).val();
		let arquetipos = new Arquetipos();

		arquetipos.run(arquetipo);
	}
}
