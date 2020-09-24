export class Cadastro {
  cpf?: string;
  name?: string;
  email?: string;
  ddd?: string;
  phone?: string;
  birthdate?: string;
  password?: string;
  veiculo?: Array<Veiculos>;
  cep?: string;
}

export class Veiculos {
  placa?: string;
  eixo?: string;
}
