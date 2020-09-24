const ProdutosMock = {
  'Id': 2,
  'Tipo': 'Plano',
  'Titulo': 'Plano Urbano',
  'Descricao': 'Pedagio controlado e estacionamento a vontade pra voce que vive na cidade e quer mais comodidade',
  'Servicos': [
    {
      'Codigo': 'taxaDeUso',
      'Descricao': 'Taxa de uso',
      'Valores': [
        9.90
      ],
      'InfoIcone': true,
      'Modificadores': [
      ]
    },
    {
      'Codigo': 'valorDoSticker',
      'Descricao': 'Valor do adesivo',
      'Valores': [
        10
      ],
      'Modificadores': [

      ]
    },
    {
      'Codigo': 'mensalidade',
      'Descricao': 'Mensalidade',
      'Valores': [
        9.90
      ],
      'Modificadores': [
        {
          'Tipo': 'Desconto',
          'Descricao': 'Desconto de Carnaval',
          'Valor': -10,
          'Percentual': 12.5
        }
      ]
    },
    {
      'Codigo': 'recarga',
      'Descricao': 'Recargas',
      'Valores': [
        10,
        50,
        100,
        150
      ],
      'Modificadores': [

      ]
    },
    {
      'Codigo': 'carroAdicional50',
      'Descricao': 'Carro Adicional',
      'Valores': [
        19.9
      ],
      'Modificadores': [

      ]
    },
    {
      'Codigo': 'carroAdicional',
      'Descricao': 'Carro Adicional Apartir 51',
      'Valores': [
        16.9
      ],
      'Modificadores': [

      ]
    }
  ],
  'Locais': [
    'Ped\u00e1gios',
    'Aeroportos',
    'Shoppings',
    'Estacionamentos'
  ],
  'Beneficios': [
    'Todas as substitui\u00e7\u00f5es de Sticker gr\u00e1tis',
    'Pagamento com cart\u00e3o de cr\u00e9dito',
    'Pagamento no d\u00e9bito em conta corrente',
    'Recargas autom\u00e1ticas',
    'Desconto de combust\u00edvel (KMV)'
  ]
}

export default ProdutosMock;
