import React, { useState, useRef } from 'react';
import { ClientType, PFData, PJData, GeneratedFile, PaymentMethod } from './types';
import PFForm from './components/PFForm';
import PJForm from './components/PJForm';
import { 
  generateHipossuficienciaPF, generateProcuracaoPF, generateContratoPF,
  generateHipossuficienciaPJ, generateProcuracaoPJ, generateContratoPJ
} from './constants';
import { generatePdfFromHtml } from './services/pdfCoService';

const initialPFData: PFData = {
  nome: '', estadoCivil: '', profissao: '', nacionalidade: '', cpf: '',
  rua: '', complemento: '', cep: '', numeroProcesso: '', 
  
  paymentMethod: PaymentMethod.BOLETO,
  valorTotal: '',
  entrada: '', dataEntrada: '', vezesParcelas: '', valorParcela: '',
  dataPagamentoParcelas: '', 
  
  estado: 'Rio de Janeiro', cidade: 'Rio de Janeiro', dataAssinatura: new Date().toISOString().split('T')[0]
};

const initialPJData: PJData = {
  nomeEmpresa: '', cnpj: '', enderecoEmpresa: '', numeroEmpresa: '', bairroEmpresa: '',
  cidadeEmpresa: 'Rio de Janeiro', ufEmpresa: 'RJ', cepEmpresa: '',
  representanteLegal: '', nacionalidadeRep: '', profissaoRep: '', estadoCivilRep: '',
  cpfRep: '', enderecoRep: '', dataAssinatura: new Date().toISOString().split('T')[0],
  nomeRepresentanteLegalAssinatura: '', numeroProcesso: '',
  
  paymentMethod: PaymentMethod.BOLETO,
  valorTotal: '',
  entrada: '', dataEntrada: '', vezesParcelas: '', valorParcela: '',
  dataPagamentoParcelas: '', 

  estadoForo: 'RJ'
};

function App() {
  const [clientType, setClientType] = useState<ClientType>(ClientType.PF);
  const [pfData, setPfData] = useState<PFData>(initialPFData);
  const [pjData, setPjData] = useState<PJData>(initialPJData);
  const [loading, setLoading] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [selectedDocs, setSelectedDocs] = useState({
    hipossuficiencia: true,
    procuracao: true,
    contrato: true
  });

  const handlePFChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPfData({ ...pfData, [e.target.name]: e.target.value });
  };

  const handlePJChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPjData({ ...pjData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formRef.current && !formRef.current.checkValidity()) {
        formRef.current.reportValidity();
        return;
    }

    setLoading(true);
    setGeneratedFiles([]);
    const files: GeneratedFile[] = [];

    try {
      // Hipossuficiencia
      if (selectedDocs.hipossuficiencia) {
        const html = clientType === ClientType.PF ? generateHipossuficienciaPF(pfData) : generateHipossuficienciaPJ(pjData);
        const url = await generatePdfFromHtml(html, `Hipossuficiencia_${clientType === ClientType.PF ? pfData.nome : pjData.nomeEmpresa}.pdf`);
        files.push({ name: 'Declaração de Hipossuficiência', url });
      }

      // Procuracao
      if (selectedDocs.procuracao) {
        const html = clientType === ClientType.PF ? generateProcuracaoPF(pfData) : generateProcuracaoPJ(pjData);
        const url = await generatePdfFromHtml(html, `Procuracao_${clientType === ClientType.PF ? pfData.nome : pjData.nomeEmpresa}.pdf`);
        files.push({ name: 'Procuração', url });
      }

      // Contrato
      if (selectedDocs.contrato) {
        const html = clientType === ClientType.PF ? generateContratoPF(pfData) : generateContratoPJ(pjData);
        const url = await generatePdfFromHtml(html, `Contrato_${clientType === ClientType.PF ? pfData.nome : pjData.nomeEmpresa}.pdf`);
        files.push({ name: 'Contrato de Honorários', url });
      }

      setGeneratedFiles(files);
    } catch (error) {
      alert("Erro ao gerar documentos. Verifique o console ou sua chave de API.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <header className="bg-slate-900 text-gold-400 py-6 shadow-lg border-b-4 border-gold-500">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-serif font-bold tracking-wider">FB ADVOCACIA</h1>
          <p className="text-sm mt-2 text-slate-300">Gerador Automático de Documentos</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 mt-8 max-w-5xl">
        
        {/* Type Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => setClientType(ClientType.PF)}
            className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${clientType === ClientType.PF ? 'bg-gold-500 text-white shadow-md scale-105' : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'}`}
          >
            Pessoa Física
          </button>
          <button
            type="button"
            onClick={() => setClientType(ClientType.PJ)}
            className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${clientType === ClientType.PJ ? 'bg-gold-500 text-white shadow-md scale-105' : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'}`}
          >
            Pessoa Jurídica
          </button>
        </div>

        {/* Form Container */}
        <form ref={formRef} className="bg-white rounded-xl shadow-xl p-8 border border-slate-200">
          <h2 className="text-2xl font-serif font-bold text-slate-800 mb-6 border-l-4 border-gold-500 pl-4">
            Preencha os dados: {clientType === ClientType.PF ? 'Pessoa Física' : 'Pessoa Jurídica'}
          </h2>
          
          {clientType === ClientType.PF ? (
            <PFForm data={pfData} onChange={handlePFChange} />
          ) : (
            <PJForm data={pjData} onChange={handlePJChange} />
          )}

          {/* Document Selection */}
          <div className="mt-8 bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Selecionar Documentos para Gerar:</h3>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedDocs.hipossuficiencia} 
                  onChange={(e) => setSelectedDocs({...selectedDocs, hipossuficiencia: e.target.checked})}
                  className="w-5 h-5 text-gold-600 rounded focus:ring-gold-500"
                />
                <span>Declaração de Hipossuficiência</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedDocs.procuracao} 
                  onChange={(e) => setSelectedDocs({...selectedDocs, procuracao: e.target.checked})}
                  className="w-5 h-5 text-gold-600 rounded focus:ring-gold-500"
                />
                <span>Procuração</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedDocs.contrato} 
                  onChange={(e) => setSelectedDocs({...selectedDocs, contrato: e.target.checked})}
                  className="w-5 h-5 text-gold-600 rounded focus:ring-gold-500"
                />
                <span>Contrato de Honorários</span>
              </label>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`
                bg-slate-900 text-gold-400 font-bold text-lg px-10 py-4 rounded-lg shadow-lg 
                hover:bg-slate-800 hover:text-gold-300 transition-all duration-300 flex items-center
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gold-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando Documentos...
                </>
              ) : 'Gerar Documentos PDF'}
            </button>
          </div>
        </form>

        {/* Results */}
        {generatedFiles.length > 0 && (
          <div className="mt-8 bg-green-50 rounded-xl shadow border border-green-200 p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Documentos Gerados com Sucesso!</h2>
            <div className="space-y-3">
              {generatedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-4 rounded border border-green-100 shadow-sm">
                  <span className="font-semibold text-slate-700">{file.name}</span>
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Baixar PDF
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;