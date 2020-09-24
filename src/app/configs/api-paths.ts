const ApiPaths = {
  // Catalogo.Produto
  Get_Produtos_Com_Campanha_Por_Filtros: '/sprint13/catalogo/produto/api/v1/produtos',
  Get_Produtos_Com_Campanha_Por_Cupom: '/sprint13/catalogo/produto/api/v1/produtos/porcupom?codigoCupom=',

  // Framework
  Resource_Get: '/sprint13/framework/api/v1/resources',
  FeatureToggle_Get: '/sprint13/framework/api/v1/featureToggle',

  // Seguranca.Autenticacacao
  Get_Autenticacoes_Revalidar_Token: '/sprint13/seguranca/autenticacao/api/v1/autenticacoes/revalidartoken',
  Post_Autenticacoes_Logar_Usuario: '/sprint13/seguranca/autenticacao/api/v1/autenticacoes',
  Post_Autenticacoes_Logar_Com_Facebook: '/sprint13/seguranca/autenticacao/api/v1/autenticacoes/facebook',
  Post_Usuarios_Associar_Usuario_Facebook: '/sprint13/seguranca/autenticacao/api/v1/usuarios/associarfacebook',
  Post_Usuarios_Desassociar_Usuario_Facebook: '/sprint13/seguranca/autenticacao/api/v1/usuarios/desassociarfacebook',
  Post_Usuarios_Incluir_Usuario: '/sprint13/seguranca/autenticacao/api/v1/usuarios',
  Post_Usuarios_Obter_Dados_Recuperar_Senha_Cliente_CPF: '/sprint13/seguranca/autenticacao/api/v1/usuarios/ObterDadosRecuperarSenhaPorCliente?CPF=',
  Post_Usuarios_Associar_Obter_Dados_Recuperar_Senha: '/sprint13/seguranca/autenticacao/api/v1/usuarios/ObterDadosRecuperarSenha',
  Post_Usuarios_Validar_Recuperar_Senha_Email_SMS: '/sprint13/seguranca/autenticacao/api/v1/usuarios/ValidarRecuperarSenhaEmailSMS',
  Post_Usuarios_Alterar_Senha_Email_SMS: '/sprint13/seguranca/autenticacao/api/v1/usuarios/AlterarSenhaEmailSMS',
  Post_Usuarios_Alterar_Senha: '/sprint13/Seguranca/Autenticacao/api/v1/usuarios/alterarsenha',

  // Cadastro.Cliente
  Get_Cliente_Obter_Cliente_Por_CPF: '/sprint13/cadastro/cliente/api/v1/clientes?cpf=',
  Post_Cliente_Incluir_Cliente: '/sprint13/cadastro/cliente/api/v1/clientes',
  Put_Cliente_Alterar_Cliente: '/sprint13/cadastro/cliente/api/v1/clientes',
  Get_Cliente_Obter_Usuario_Por_CPF: '/sprint13/cadastro/cliente/api/v1/clientes/possuiusuario?cpf=',
  Get_CartaoDeCredito_Obter_Token_Cartao_De_Credito_Por_Id: '/sprint13/cadastro/cliente/api/v1/cartoesdecredito?id=',
  Get_Listar_Imagens_Por_Cliente: '/sprint13/cadastro/cliente/api/v1/clientes/listarimagensporcliente?medida=',
  Post_Arquivo_Foto_Perfil: '/sprint13/cadastro/cliente/api/v1/clientes/uploadfotoperfil',
  Post_CartaoDeCredito_Incluir_Token_Cartao_De_Credito: '/sprint13/cadastro/cliente/api/v1/cartoesdecredito',

  // Cadastro.Endereco
  Get_Endereco_Obter_Endereco_Por_CEP: '/sprint13/cadastro/endereco/api/v1/enderecos?usuario=1&senha=1&cep=',
  Get_Cidade_Listar_Cidade_Por_Estado: '/sprint13/cadastro/endereco/api/v1/cidades?usuario=1&senha=1&estado=',
  Get_Estado_Listar_Estado: '/sprint13/cadastro/endereco/api/v1/estados?usuario=1&senha=1',
  Put_Endereco_Atualizar_Endereco: '/sprint13/cadastro/endereco/api/v1/enderecos',

  // InterfacesExternas.Logistica
  Post_Entrega_Agendamento: '/sprint13/interfacesexternas/logistica/api/v1/entregas/agendar',
  Get_Entrega_Retorno_Dias_Uteis: '/sprint13/interfacesexternas/logistica/api/v1/entregas/retornadiasuteis?cep=',
  Get_Entrega_Retorno_Agendamento: '/sprint13/interfacesexternas/logistica/api/v1/entregas/retornaagendamentos?cep=',

  // Comercial.Campanha
  Get_Cartao_Obter_Cartao_Por_Bin_E_Canal: '/sprint13/comercial/campanha/api/v1/cartoes/campanha',

  // Comercial.Cliente.Venda
  Get_Pedido_Listar_Pedidos_Pendentes_Entregues: '/sprint13/comercial/cliente/venda/api/v1/pedidos/clientes/',
  Get_Pedido_Obter_Ultimo_Pedido_Nao_Finalizado: '/sprint13/comercial/cliente/venda/api/v1/pedidos/',
  Put_Pedido_Alterar_Pedido: '/sprint13/comercial/cliente/venda/api/v1/pedidos',
  Post_Pedido_Incluir_Pedido: '/sprint13/comercial/cliente/venda/api/v1/pedidos',
  Post_Pedido_Processar_Pedido: '/sprint13/comercial/cliente/venda/api/v1/pedidos/processar',
  Get_Veiculo_Listar_Categoria: '/sprint13/comercial/cliente/venda/api/v1/veiculos/categorias',
  Get_Tag_Validar_Tag_Posto: '/sprint13/comercial/cliente/venda/api/v1/tags/validatagposto?numeroSerie=',
  Get_Veiculo_Validar_Tag_Ativa: '/sprint13/comercial/cliente/venda/api/v1/veiculos/possuiveiculotag?',

  // Comercial.Cliente.Adesao
  Get_Ativacao_Validar_Placa_Ativa: '/sprint13/comercial/cliente/adesao/api/v1/ativacao/validarplacaativa?placaVeiculo=',
  Post_Ativacao_Ativar_Tag: '/sprint13/comercial/cliente/adesao/api/v1/ativacao/ativartag',

  // Comercial.Cliente.Conta
  Get_Plano_Obter_Plano_Por_ClienteId: '/sprint13/comercial/cliente/conta/api/v1/planos?clienteId=',
  Get_Recarga_Listar_Recarga_Automatica_Por_Codigo_Tipo_Conta: '/sprint13/comercial/cliente/conta/api/v1/recargas/automaticas?codigoTipoConta=',
  Get_Recarga_Listar_Recarga_Avulsa_Por_Codigo_Tipo_Conta: '/sprint13/comercial/cliente/conta/api/v1/recargas/avulsas?codigoTipoConta=',

  // Comercial Adesão Ponto a Ponto
  Post_AdesaoPontoPonto_Incluir_AdesaoPontoPonto: '/sprint13/comercial/cliente/adesao/api/v1/adesao',

  // Comercial.Cliente.Venda
  Post_Pedido_Recarga: '/sprint13/comercial/cliente/venda/api/v1/pedido/recarga',

  // Financeiro.ContaCliente.Extrato
  Get_ContaExtrato_Listar_Contas: '/sprint13/financeiro/contacliente/extrato/api/v1/contaextrato/listarcontas?clienteId=',
  Post_ContaExtrato_Listar_Extratos: '/sprint13/financeiro/contacliente/extrato/api/v1/contaextrato/listarextratos',
}

export default ApiPaths;
