export enum ClientType {
  PF = 'PF',
  PJ = 'PJ'
}

export enum PaymentMethod {
  BOLETO = 'Boleto',
  A_VISTA = 'À Vista',
  CARTAO = 'Cartão de Crédito'
}

export interface PFData {
  nome: string;
  estadoCivil: string;
  profissao: string;
  nacionalidade: string;
  cpf: string;
  rua: string;
  complemento: string;
  cep: string;
  numeroProcesso: string;
  
  // Payment Data
  paymentMethod: PaymentMethod;
  valorTotal: string;
  entrada: string; // Only for Boleto
  dataEntrada: string; // Only for Boleto
  vezesParcelas: string; // Only for Boleto
  valorParcela: string; // Only for Boleto
  dataPagamentoParcelas: string; // Day of month (e.g., "10")
  
  estado: string;
  cidade: string;
  dataAssinatura: string;
}

export interface PJData {
  nomeEmpresa: string;
  cnpj: string;
  enderecoEmpresa: string;
  numeroEmpresa: string;
  bairroEmpresa: string;
  cidadeEmpresa: string;
  ufEmpresa: string;
  cepEmpresa: string;
  representanteLegal: string;
  nacionalidadeRep: string;
  profissaoRep: string;
  estadoCivilRep: string;
  cpfRep: string;
  enderecoRep: string;
  dataAssinatura: string;
  nomeRepresentanteLegalAssinatura: string;
  
  numeroProcesso: string;
  
  // Payment Data
  paymentMethod: PaymentMethod;
  valorTotal: string; // Renamed from honorarios for consistency, represents total value
  entrada: string;
  dataEntrada: string;
  vezesParcelas: string;
  valorParcela: string;
  dataPagamentoParcelas: string;

  estadoForo: string;
}

export interface GeneratedFile {
  name: string;
  url: string;
  error?: boolean;
}