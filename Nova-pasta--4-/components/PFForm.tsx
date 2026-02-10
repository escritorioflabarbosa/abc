import React from 'react';
import { PFData, PaymentMethod } from '../types';
import Input from './Input';

interface Props {
  data: PFData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PFForm: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="md:col-span-3 pb-2 border-b border-gray-200 mb-2">
        <h3 className="text-gold-600 font-bold uppercase text-sm">Dados Pessoais</h3>
      </div>
      
      <Input label="Nome Completo" name="nome" value={data.nome} onChange={onChange} required />
      <Input label="Estado Civil" name="estadoCivil" value={data.estadoCivil} onChange={onChange} required />
      <Input label="Profissão" name="profissao" value={data.profissao} onChange={onChange} required />
      <Input label="Nacionalidade" name="nacionalidade" value={data.nacionalidade} onChange={onChange} required />
      <Input label="CPF" name="cpf" value={data.cpf} onChange={onChange} placeholder="000.000.000-00" required />
      
      <div className="md:col-span-3 pb-2 border-b border-gray-200 mt-4 mb-2">
        <h3 className="text-gold-600 font-bold uppercase text-sm">Endereço</h3>
      </div>

      <Input label="Rua" name="rua" value={data.rua} onChange={onChange} required />
      <Input label="Complemento" name="complemento" value={data.complemento} onChange={onChange} required />
      <Input label="CEP" name="cep" value={data.cep} onChange={onChange} placeholder="00000-000" required />
      <Input label="Cidade" name="cidade" value={data.cidade} onChange={onChange} required />
      <Input label="Estado (UF)" name="estado" value={data.estado} onChange={onChange} placeholder="RJ" required />

      <div className="md:col-span-3 pb-2 border-b border-gray-200 mt-4 mb-2">
        <h3 className="text-gold-600 font-bold uppercase text-sm">Dados do Processo e Pagamento</h3>
      </div>

      <Input label="Número do Processo" name="numeroProcesso" value={data.numeroProcesso} onChange={onChange} required />
      
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
      
      <div className="md:col-span-3 mt-4">
        <Input label="Data de Assinatura" type="date" name="dataAssinatura" value={data.dataAssinatura} onChange={onChange} required />
      </div>
    </div>
  );
};

export default PFForm;