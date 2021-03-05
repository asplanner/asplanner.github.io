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
		let attrs = this.getAttr(true);

		$('#ip-b-str').attr('title', `Arquétipo: ${$('#ip-arq-str').val()}, Tier: ${$('#ip-tier-str').val()}, Treinamento: ${$('#ip-tre-str').val()}, Total: ${attrs.str}`);
		$('#ip-b-agi').attr('title', `Arquétipo: ${$('#ip-arq-agi').val()}, Tier: ${$('#ip-tier-agi').val()}, Treinamento: ${$('#ip-tre-agi').val()}, Total: ${attrs.agi}`);
		$('#ip-b-dex').attr('title', `Arquétipo: ${$('#ip-arq-dex').val()}, Tier: ${$('#ip-tier-dex').val()}, Treinamento: ${$('#ip-tre-dex').val()}, Total: ${attrs.dex}`);
		$('#ip-b-ene').attr('title', `Arquétipo: ${$('#ip-arq-ene').val()}, Tier: ${$('#ip-tier-ene').val()}, Treinamento: ${$('#ip-tre-ene').val()}, Total: ${attrs.ene}`);
		$('#ip-b-slots').attr('title', `Treinamento: ${$('#ip-tre-slots').val()}`);
	}

	atualizaAtributos() {
		if(!this.getTier7Restriction()) {
			let attrs = this.getAttr();
			let level = attrs.str + attrs.agi + attrs.dex + attrs.ene;
			let choice = $('#ip-choice').val();
			let mod = [undefined, undefined];
			if(choice && choice == 'attr') mod = ['+', '-'];
			if(choice && choice == 'slot') mod = ['-', '+'];

			let pontosUsados = this.calculaAtributos(level, mod[0]) + this.calculaAtributos(parseInt($('#ip-slots').val()), mod[1]);

			$('#ip-exp-usada').val(pontosUsados)
			$('#ip-exp-final').val(parseInt($('#ip-exp-inicial').val()) - pontosUsados);
			$('#ip-level').val(level);
			if($('#ip-exp-final').val() < 0) swal.fire('Pontos insuficientes!');
		}
	}

	atualizaBonus() {
		if(!this.getTier7Restriction()){
			$('#ip-b-str').val(this.addSinal(parseInt($("#ip-arq-str").val()) + parseInt($("#ip-tier-str").val()) + parseInt($("#ip-tre-str").val())));
			$('#ip-b-agi').val(this.addSinal(parseInt($("#ip-arq-agi").val()) + parseInt($("#ip-tier-agi").val()) + parseInt($("#ip-tre-agi").val())));
			$('#ip-b-dex').val(this.addSinal(parseInt($("#ip-arq-dex").val()) + parseInt($("#ip-tier-dex").val()) + parseInt($("#ip-tre-dex").val())));
			$('#ip-b-ene').val(this.addSinal(parseInt($("#ip-arq-ene").val()) + parseInt($("#ip-tier-ene").val()) + parseInt($("#ip-tre-ene").val())));
			$('#ip-b-slots').val(this.addSinal(parseInt($("#ip-tre-slots").val())));

			this.updateTooltips();
		}
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
		let highest = this.getMaxAttr(true);
		let bonus = 0;
		let tier = Math.floor(highest / 10) + 1
		let tierBonus = [0, 0, 2, 5, 9, 14, 20, 27, 35, 44, 54]

		bonus = this.addSinal(tierBonus[tier]);

		$('input[id^="ip-tier"]').val(bonus);
		$('#ip-tier').val(tier);
		this.recalculaBonusTier();
	}

	recalculaBonusTier() {
		// recalculando após aplicar os bonus de tier, necessário infelizmente.
		let highest = this.getMaxAttr(true);
		let bonus = 0;
		let tier = Math.floor(highest / 10) + 1
		let tierBonus = [0, 0, 2, 5, 9, 14, 20, 27, 35, 44, 54]

		bonus = this.addSinal(tierBonus[tier]);

		$('input[id^="ip-tier"]').val(bonus);
		$('#ip-tier').val(tier);
		this.atualizaBonus();
	}

	addTreinamento(botao) {
		let idTreina = '#' + $(botao).attr('t');
		let oldVal = parseInt($(idTreina).val())
		$(idTreina).val( this.addSinal(++oldVal) );
		this.atualizaBonus();
	}

	addSinal(number) {
		return number <= 0 ? number : '+' + number; 
	}

	getAttr(total) {
		let bonus = this.getBonus();

		let atributos = {
			'str': parseInt($('#ip-str').val()) || 0,
			'agi': parseInt($('#ip-agi').val()) || 0,
			'dex': parseInt($('#ip-dex').val()) || 0,
			'ene': parseInt($('#ip-ene').val()) || 0
		}

		if(total) {
			atributos.str += bonus.str;
			atributos.agi += bonus.agi;
			atributos.dex += bonus.dex;
			atributos.ene += bonus.ene;
		}

		return atributos;
	}

	getMaxAttr(total) {
		let attrs = this.getAttr(total);
		return Math.max(attrs.str, attrs.agi, attrs.dex, attrs.ene);
	}

	getBonus() {
		return {
			'str': parseInt($('#ip-arq-str').val()) + parseInt($('#ip-tier-str').val()) + parseInt($('#ip-tre-str').val()),
			'agi': parseInt($('#ip-arq-agi').val()) + parseInt($('#ip-tier-agi').val()) + parseInt($('#ip-tre-agi').val()),
			'dex': parseInt($('#ip-arq-dex').val()) + parseInt($('#ip-tier-dex').val()) + parseInt($('#ip-tre-dex').val()),
			'ene': parseInt($('#ip-arq-ene').val()) + parseInt($('#ip-tier-ene').val()) + parseInt($('#ip-tre-ene').val())
		}
	}

	getTier7Restriction() {
		let max = this.getMaxAttr(true);
		let base = this.getAttr(true);
		let bonus = this.getBonus();

		// restringe de forma que um atributo só possa passar de 59 quando todos os outros atributos estiverem em 59
		if(max > 59 && (base.str < 59 || base.agi < 59 || base.dex < 59 || base.ene < 59)) {
			if(base.str > 59) { $('#ip-str').val(59 - bonus.str); }
			if(base.agi > 59) { $('#ip-agi').val(59 - bonus.agi); }
			if(base.dex > 59) { $('#ip-dex').val(59 - bonus.dex); }
			if(base.ene > 59) { $('#ip-ene').val(59 - bonus.ene); }
			swal.fire('', 'Não é possível subir um atributo acima de 59 até que todos os outros estejam em 59!', 'error');
			return true;
		} else {
			return false;
		}
	}

	arquetiposOnClick() {
		let arquetipo = $(this).val();
		let arquetipos = new Arquetipos();

		arquetipos.run(arquetipo);
	}
}
