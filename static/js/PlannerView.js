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
		$('.treina-down').click(function() { self.removeTreinamento(this) });
		$('#sl-arquetipo').change(this.arquetiposOnClick);
	}

	startBootstrapPlugins() {
		// tooltips
		$(function () {
		  $('[data-toggle="tooltip"]').tooltip()
		})
	}

	arquetiposOnClick() {
		let arquetipo = $(this).val();
		let arquetipos = new Arquetipos();

		arquetipos.run(arquetipo);
	}

	atualizaTooltips() {
		let attrs = this.getAttr(true);

		$('#ip-b-str').attr('title', `Arquétipo: ${$('#ip-arq-str').val()}, Tier: ${$('#ip-tier-str').val()}, Treinamento: ${$('#ip-tre-str').val()}, Total: ${attrs.str}`);
		$('#ip-b-agi').attr('title', `Arquétipo: ${$('#ip-arq-agi').val()}, Tier: ${$('#ip-tier-agi').val()}, Treinamento: ${$('#ip-tre-agi').val()}, Total: ${attrs.agi}`);
		$('#ip-b-dex').attr('title', `Arquétipo: ${$('#ip-arq-dex').val()}, Tier: ${$('#ip-tier-dex').val()}, Treinamento: ${$('#ip-tre-dex').val()}, Total: ${attrs.dex}`);
		$('#ip-b-ene').attr('title', `Arquétipo: ${$('#ip-arq-ene').val()}, Tier: ${$('#ip-tier-ene').val()}, Treinamento: ${$('#ip-tre-ene').val()}, Total: ${attrs.ene}`);
		$('#ip-b-slots').attr('title', `Treinamento: ${$('#ip-tre-slots').val()}`);
	}

	atualizaAtributos() {
		this.set99Limit();
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
		$('#ip-b-str').val(this.addSinal(parseInt($("#ip-arq-str").val()) + parseInt($("#ip-tier-str").val()) + parseInt($("#ip-tre-str").val())));
		$('#ip-b-agi').val(this.addSinal(parseInt($("#ip-arq-agi").val()) + parseInt($("#ip-tier-agi").val()) + parseInt($("#ip-tre-agi").val())));
		$('#ip-b-dex').val(this.addSinal(parseInt($("#ip-arq-dex").val()) + parseInt($("#ip-tier-dex").val()) + parseInt($("#ip-tre-dex").val())));
		$('#ip-b-ene').val(this.addSinal(parseInt($("#ip-arq-ene").val()) + parseInt($("#ip-tier-ene").val()) + parseInt($("#ip-tre-ene").val())));
		$('#ip-b-slots').val(this.addSinal(parseInt($("#ip-tre-slots").val())));

		if(this.getTier7Restriction()) this.atualizaAtributos();

		this.atualizaTooltips();
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

	    this.clearBonusTier(); // necessário para casos de redução de atributos
	    this.calculaBonusTier();
	    
	    return pontos;
	}

	calculaBonusTier() {
		let highest = this.getMaxAttr(true);
		let tier = Math.floor(highest / 10) + 1
		tier = tier > 10 ? 10 : tier;
		$('#ip-tier').val(tier);
		let tierBonus = [0, 0, 2, 5, 9, 14, 20, 20, 20, 20, 20]

		let bonus = this.addSinal(tierBonus[tier]);

		if($('#ip-tier-dex').val() != bonus) {
			$('input[id^="ip-tier"]').val(bonus);
			this.calculaBonusTier(); // recalculando com os novos bonus
		}
		this.atualizaBonus();
	}

	clearBonusTier() {
		$('#ip-tier-str,#ip-tier-agi,#ip-tier-dex,#ip-tier-ene').val('0');
	}

	addTreinamento(botao) {
		let idTreina = '#' + $(botao).attr('t');
		let oldVal = parseInt($(idTreina).val())
		$(idTreina).val( this.addSinal(++oldVal) );
		this.clearBonusTier();
		this.calculaBonusTier();
		this.set99Limit();
	}

	removeTreinamento(botao) {
		let idTreina = '#' + $(botao).attr('t');
		let oldVal = parseInt($(idTreina).val())
		$(idTreina).val( this.addSinal(--oldVal) );
		this.clearBonusTier();
		this.calculaBonusTier();
		this.set99Limit();
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
		let attr = this.getAttr(true);
		let bonus = this.getBonus();

		// restringe de forma que um atributo só possa passar de 59 quando todos os outros atributos estiverem em 59
		if(max > 59 && (attr.str < 59 || attr.agi < 59 || attr.dex < 59 || attr.ene < 59)) {
			if(attr.str > 59) { $('#ip-str').val(59 - bonus.str); }
			if(attr.agi > 59) { $('#ip-agi').val(59 - bonus.agi); }
			if(attr.dex > 59) { $('#ip-dex').val(59 - bonus.dex); }
			if(attr.ene > 59) { $('#ip-ene').val(59 - bonus.ene); }
			swal.fire('', 'Não é possível subir um atributo acima de 59 até que todos os outros estejam em 59!', 'error');
			return true;
		} else {
			return false;
		}
	}

	set99Limit() {
		let max = this.getMaxAttr(true);
		let attr = this.getAttr(true);
		let bonus = this.getBonus();

		// restringe de forma que um atributo não passe do 99
		if(max > 99) {
			if(attr.str > 99) { $('#ip-str').val(99 - bonus.str); }
			if(attr.agi > 99) { $('#ip-agi').val(99 - bonus.agi); }
			if(attr.dex > 99) { $('#ip-dex').val(99 - bonus.dex); }
			if(attr.ene > 99) { $('#ip-ene').val(99 - bonus.ene); }
			swal.fire('', 'Não é possível subir um atributo acima de 99!', 'error');
			this.atualizaAtributos();
		}
	}

	// para usar depois
	saveFile(filename, data) {
	    var blob = new Blob([data], {type: 'text/plain'});
	    if(window.navigator.msSaveOrOpenBlob) {
	        window.navigator.msSaveBlob(blob, filename);
	    }
	    else{
	        var elem = window.document.createElement('a');
	        elem.href = window.URL.createObjectURL(blob);
	        elem.download = filename;        
	        document.body.appendChild(elem);
	        elem.click();        
	        document.body.removeChild(elem);
	    }
	}
}
