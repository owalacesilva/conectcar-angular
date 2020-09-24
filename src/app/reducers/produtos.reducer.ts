import { ActionReducer, Action } from '@ngrx/store';
import { Produto } from '../models/produto.model';

export const CLEAR = 'CLEAR';
export const LOADED = 'LOADED';

function mapMensalidade(produto: Produto) {
  const mens = produto.Tarifas.find(t => t && t.Codigo === 'TRMENSALIDADE')
  if (mens.Por && mens.Por.Valor) {
    produto.MensalidadePor = mens.Por.Valor;
    produto.Mensalidade = mens.Por.Valor;
  }

  if (mens.De && mens.De.Valor) {
    produto.Mensalidade = mens.De.Valor;
  }

  if (mens.De && mens.De.Valor && mens.Por && mens.Por.Valor) {
    produto.MensalidadeDesconto = Math.floor((mens.Por.Valor * 100) / mens.De.Valor);
  }

  const split = String(produto.Mensalidade).split('.');
  if (split.length === 2 && split[1].length === 1) {
    split[1] += '0';
  }
  if (split.length === 1) {
    split.push('00');
  }
  produto.MensalidadeSplit = split;

  if (mens.Por) {
    produto.DescontoPorcentagem = (mens.Por.Valor / 100.0) * mens.De.Valor;
  }

  return produto;
}

function mapBeneficios(produto: Produto) {
  const creditCard = [
    'Catalogo_Produto_PLIVRE_FormasPagamentoMasterCardItaú',
    'Catalogo_Produto_PLIVRE_FormasPagamentoMasterCardBradesco',
    'Catalogo_Produto_PLIVRE_FormasPagamentoVisaItaú',
    'Catalogo_Produto_PURBANO_FormasPagamentoMasterCardItaú',
    'Catalogo_Produto_PURBANO_FormasPagamentoMasterCardBradesco',
    'Catalogo_Produto_PURBANO_FormasPagamentoVisaItaú',
  ];

  produto.BeneficiosNormalizado = produto.Beneficios.filter(b => creditCard.indexOf(b) < 0);
  const rec = produto.BeneficiosNormalizado.find(b => b.indexOf('RecargaAutomati') > -1);
  if (rec && produto.Recargas && produto.Recargas.length) {
    produto.CreditoAutomatico = produto.Recargas[0].ValorAquisicao;
  }

  if (produto.Beneficios.find(b => b.indexOf('RecargaAutomati') > -1)) {
    produto.BeneficiosNormalizado.push('Catalogo_Produto_FormasPagamentoCartaoCredito');
  }

  if (produto.Beneficios.find(b => creditCard.indexOf(b) > -1)) {
    produto.BeneficiosNormalizado.push('Catalogo_Produto_FormasPagamentoCartaoCredito');
  }

  return produto;
}

function mapTarifas(produto: Produto) {
  produto.TarifasNormalizado = produto.Tarifas
    .filter(prod => prod.Codigo.indexOf('TRDESCONTOADICIONAL') > -1 || prod.Codigo.indexOf('TRUSOPEDAGIO') > -1)
    .map(t => t.Por || t.De)
  return produto;
}

const initialState: Produto[] = []

export function ProdutosReducer(state = initialState, action: Action) {
  switch (action.type) {
    case CLEAR:
      return [];

    case LOADED:
      return action.payload
        .map(produto => mapMensalidade(produto))
        .map(produto => mapBeneficios(produto))
        .map(produto => mapTarifas(produto))
    default:
      return state;
  }
}
