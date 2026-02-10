import React from 'react';
import { PJData, PaymentMethod } from '../types';
import Input from './Input';

interface Props {
  data: PJData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PJForm: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="md:col-span-3 pb-2 border-b border-gray-200 mb-2">
        <h3 className="text-gold-600 font-bold uppercase text-sm">Dados da Empresa</h3>
      </div>
      
      <Input label="Nome da Empresa" name="nomeEmpresa" value={data.nomeEmpresa} onChange={onChange} required />
      <Input label="CNPJ" name="cnpj" value={data.cnpj} onChange={onChange} placeholder="00.000.000/0001-00" required/>
      <Input label="Endereço Empresa" name="enderecoEmpresa" value={data.enderecoEmpresa} onChange={onChange} required />
      <Input label="Número" name="numeroEmpresa" value={data.numeroEmpresa} onChange={onChange} required />
      <Input label="Bairro" name="bairroEmpresa" value={data.bairroEmpresa} onChange={onChange} required />
      <Input label="Cidade" name="cidadeEmpresa" value={data.cidadeEmpresa} onChange={onChange} required />
      <Input label="UF" name="ufEmpresa" value={data.ufEmpresa} onChange={onChange} required />
      <Input label="CEP" name="cepEmpresa" value={data.cepEmpresa} onChange={onChange} required />

      <div className="md:col-span-3 pb-2 border-b border-gray-200 mt-4 mb-2">
        <h3 className="text-gold-600 font-bold uppercase text-sm">Representante Legal</h3>
      </div>

      <Input label="Nome Representante (Contrato)" name="representanteLegal" value={data.representanteLegal} onChange={onChange} required />
      <Input label="Nacionalidade Rep." name="nacionalidadeRep" value={data.nacionalidadeRep} onChange={onChange} required />
      <Input label="Profissão Rep." name="profissaoRep" value={data.profissaoRep} onChange={onChange} required />
      <Input label="Estado Civil Rep." name="estadoCivilRep" value={data.estadoCivilRep} onChange={onChange} required />
      <Input label="CPF Rep." name="cpfRep" value={data.cpfRep} onChange={onChange} required />
      <Input label="Endereço Rep." name="enderecoRep" value={data.enderecoRep} onChange={onChange} required />
      <Input label="Nome para Assinatura" name="nomeRepresentanteLegalAssinatura" value={data.nomeRepresentanteLegalAssinatura} onChange={onChange} required />

      <div className="md:col-span-3 pb-2 border-b border-gray-200 mt-4 mb-2">
        <h3 className="text-gold-600 font-bold uppercase text-sm">Dados do Processo e Pagamento</h3>
      </div>

      <Input label="Número de Processo" name="numeroProcesso" value={data.numeroProcesso} onChange={onChange} required />
      
      {/* Payment Method Selector */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-slate-700 mb-1">Forma de Pagamento</label>
        <select 
          name="paymentMethod" 
          value={data.paymentMethod} 
          onChange={onChange}
          className="border border-slate-300 rounded p-2 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition bg-white"
          required
        >
          <option value={PaymentMethod.BOLETO}>Boleto (Parcelado)</option>
          <option value={PaymentMethod.A_VISTA}>À Vista</option>
          <option value={PaymentMethod.CARTAO}>Cartão de Crédito</option>
        </select>
      </div>

      <Input label="Valor Total (R$)" name="valorTotal" value={data.valorTotal} onChange={onChange} required />

      {/* Conditional Fields for Boleto */}
      {data.paymentMethod === PaymentMethod.BOLETO && (
        <>
          <Input label="Entrada (R$)" name="entrada" value={data.entrada} onChange={onChange} required />
          <Input label="Data de Entrada" type="date" name="dataEntrada" value={data.dataEntrada} onChange={onChange} required />
          <Input label="Qtd. Parcelas" type="number" name="vezesParcelas" value={data.vezesParcelas} onChange={onChange} required />
          <Input label="Valor da Parcela (R$)" name="valorParcela" value={data.valorParcela} onChange={onChange} required />
          <Input label="Dia de Vencimento (Ex: 10)" type="number" min="1" max="31" name="dataPagamentoParcelas" value={data.dataPagamentoParcelas} onChange={onChange} placeholder="Dia do mês" required />
        </>
      )}

      <Input label="Estado (Foro)" name="estadoForo" value={data.estadoForo} onChange={onChange} placeholder="RJ" required />
      
      <div className="md:col-span-3 mt-4">
        <Input label="Data de Assinatura" type="date" name="dataAssinatura" value={data.dataAssinatura} onChange={onChange} required />
      </div>
    </div>
  );
};

export default PJForm;