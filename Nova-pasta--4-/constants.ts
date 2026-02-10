import { PFData, PJData, PaymentMethod } from './types';

export const WEBHOOK_URL_PF = "https://escritoriofla.app.n8n.cloud/webhook-test/abfb9471-9656-4da5-a89d-8f323244ef12";
export const WEBHOOK_URL_PJ = "https://escritoriofla.app.n8n.cloud/webhook-test/87cb8ce2-0f7f-439c-96c9-c43fe3c6f215";

// PDF Configuration - Strict A4 with 2cm margins
export const PDF_CONFIG = {
    paperSize: 'A4',
    // We set explicit API margins to match CSS @page (2cm = 20mm)
    margins: '20mm 20mm 20mm 20mm', 
    orientation: 'Portrait',
    printBackground: true
};

// Helpers for date formatting
const getDay = (dateStr: string) => dateStr ? new Date(dateStr + 'T12:00:00').getDate().toString().padStart(2, '0') : '___';
const getMonth = (dateStr: string) => dateStr ? new Date(dateStr + 'T12:00:00').toLocaleString('pt-BR', { month: 'long' }) : '___';
const getYear = (dateStr: string) => dateStr ? new Date(dateStr + 'T12:00:00').getFullYear().toString() : '___';

const formatDate = (date: Date) => {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

// Function to generate the Payment Schedule Table
const generatePaymentSchedule = (
  entryValue: string, 
  entryDateStr: string, 
  installments: string, 
  installmentValue: string, 
  paymentDay: string
): string => {
  let rows = '';
  
  // 1. Entry Row
  if (entryValue && entryDateStr) {
    const entryDate = new Date(entryDateStr + 'T12:00:00');
    rows += `
      <tr>
        <td>Entrada</td>
        <td>${formatDate(entryDate)}</td>
        <td>R$ ${entryValue}</td>
      </tr>
    `;
  }

  // 2. Installments Rows
  const numInstallments = parseInt(installments) || 0;
  const payDay = parseInt(paymentDay) || 10;
  
  if (numInstallments > 0 && entryDateStr) {
    const startDate = new Date(entryDateStr + 'T12:00:00');
    let currentMonth = startDate.getMonth() + 1;
    let currentYear = startDate.getFullYear();

    for (let i = 1; i <= numInstallments; i++) {
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      
      const installmentDate = new Date(currentYear, currentMonth, payDay);
      
      rows += `
        <tr>
          <td>Parcela ${i}/${numInstallments}</td>
          <td>${formatDate(installmentDate)}</td>
          <td>R$ ${installmentValue}</td>
        </tr>
      `;
      
      currentMonth++;
    }
  }

  return `
    <div class="table-container">
      <p style="font-weight: bold; margin-bottom: 5px;">DEMONSTRATIVO DE PAGAMENTO:</p>
      <table>
        <thead>
          <tr>
            <th style="width: 40%;">Descrição</th>
            <th style="width: 30%;">Data de Vencimento</th>
            <th style="width: 30%;">Valor</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
};

// Styles optimized for A4 (210mm x 297mm) - PRINT CSS RULES
const pdfStyles = `
  <style>
    /* 1. Reset & Global Box Sizing */
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
    }

    /* 2. Page Configuration */
    @page {
      size: A4;
      margin: 2cm; /* 20mm margin all around */
    }
    
    body { 
      font-family: Arial, sans-serif; /* Clean font as requested */
      font-size: 11pt; 
      line-height: 1.5; 
      color: #000; 
      background-color: #fff;
      margin: 0;
      padding: 0;
    }

    /* 3. Container Protection 
       This pushes content to the next page before it hits the footer area 
    */
    .main-content {
      width: 100%;
      padding-bottom: 100px; /* Buffer zone for footer */
    }
    
    /* 4. Typography & Flow */
    h2 { 
      text-align: center; 
      text-transform: uppercase; 
      font-weight: bold; 
      margin-top: 0px;
      margin-bottom: 25px; 
      font-size: 14pt;
      page-break-after: avoid; 
    }
    
    h3 { 
      text-align: left; 
      text-transform: uppercase; 
      font-weight: bold; 
      margin-top: 25px;
      margin-bottom: 15px; 
      font-size: 11pt;
      page-break-after: avoid; 
    }
    
    p { 
      margin-bottom: 12px; 
      text-align: justify;
      text-justify: inter-word;
      orphans: 3; 
      widows: 3;
      page-break-inside: avoid;
    }
    
    /* 5. Header Layout (Flows naturally) */
    .header { 
      text-align: center; 
      margin-bottom: 30px; 
      color: #B08D1E; 
      position: relative;
    }
    
    /* Watermark - Fixed */
    .watermark {
      position: fixed;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 350px;
      color: #B08D1E;
      opacity: 0.08;
      z-index: -1000;
      font-weight: bold;
      pointer-events: none;
    }
    
    /* 6. Footer Styling - Fixed in Margin Area */
    .footer { 
      font-size: 9pt; 
      color: #333; 
      position: fixed; 
      /* Negative bottom pulls it into the @page margin space */
      bottom: -1.5cm; 
      left: 0; 
      right: 0; 
      height: 1.5cm;
      border-top: 2px solid #FCD34D; 
      padding-top: 5px; 
      background-color: #fff; 
      z-index: 1000;
      text-align: center;
    }

    .footer-content {
        display: table;
        width: 100%;
    }
    
    /* 7. Signature Block */
    .signature-block { 
      margin-top: 50px; 
      text-align: center; 
      page-break-inside: avoid; 
    }
    .signature-line { 
      border-top: 1px solid #000; 
      width: 70%; 
      margin: 0 auto 5px auto; 
    }
    
    /* 8. Table Normalization */
    .table-container {
      margin: 20px 0;
      width: 100%;
      page-break-inside: avoid; 
    }
    table {
      width: 100% !important;
      border-collapse: collapse;
      font-size: 10pt;
      text-align: center;
    }
    th, td {
      border: 1px solid #000;
      padding: 6px 8px;
    }
    th {
      background-color: #f0f0f0;
      font-weight: bold;
    }

    .bold { font-weight: bold; }
    .gold-text { color: #B08D1E; }
  </style>
`;

const headerHtml = `
  <div class="watermark">fB</div>
  <div class="header">
    <div style="font-size: 65px; font-weight: bold; line-height: 0.8; font-family: serif;">fB</div>
    <div style="font-size: 10px; letter-spacing: 5px; text-transform: uppercase; margin-top: 5px;">ADVOCACIA</div>
    <div style="width: 100%; height: 2px; background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(176,141,30,1) 50%, rgba(255,255,255,1) 100%); margin-top: 15px;"></div>
  </div>
`;

const footerHtml = `
  <div class="footer">
    <table style="width: 100%; border: none; margin: 0;">
      <tr>
        <td style="text-align: left; width: 65%; vertical-align: top; border: none; padding: 2px 0;">
          <strong style="color: #B08D1E;">📍</strong> Av. Maria Teresa, nº 75, sala 328 – Edifício Business Completo - Campo Grande – Rio de Janeiro/RJ<br/>
          <span style="margin-top: 2px; display: inline-block;">
            <strong style="color: #B08D1E;">📞</strong> (21) 99173-5421 &nbsp; 
            <strong style="color: #B08D1E;">✉️</strong> juridico@flafsonadvocacia.com &nbsp; 
            <strong style="color: #B08D1E;">🌐</strong> www.flafsonadvocacia.com
          </span>
        </td>
        <td style="text-align: right; vertical-align: top; border: none; padding: 2px 0;">
          <strong>Flafson Barbosa</strong><br/>
          ADVOGADO | OAB/RJ: 213.777
        </td>
      </tr>
    </table>
  </div>
`;

// --- PF TEMPLATES ---

export const generateHipossuficienciaPF = (data: PFData) => `
  <html>
  <head>${pdfStyles}</head>
  <body>
    ${headerHtml}
    ${footerHtml}
    
    <div class="main-content">
      <h2>DECLARAÇÃO DE HIPOSSUFICIÊNCIA</h2>
      
      <p>
        Eu, <strong>${data.nome.toUpperCase()}</strong>, ${data.estadoCivil.toUpperCase()}, ${data.profissao.toUpperCase()}, ${data.nacionalidade.toUpperCase()}, CPF/MF de nº ${data.cpf}, 
        residente e domiciliado em ${data.rua}, ${data.complemento} - CEP: ${data.cep},
      </p>
      
      <p>
        DECLARO, para os devidos fins, sob as penas da lei, que não possuo condições financeiras de arcar 
        com as custas processuais e honorários advocatícios sem prejuízo do meu sustento e de minha família, razão 
        pela qual requeiro os benefícios da justiça gratuita, nos termos do artigo 98 do Código de Processo Civil.
      </p>
      
      <p>
        Por ser expressão da verdade, firmo a presente.
      </p>
      
      <p style="text-align: center; margin-top: 30px;">
        ${data.estado}, ${getDay(data.dataAssinatura)} de ${getMonth(data.dataAssinatura)} de ${getYear(data.dataAssinatura)}.
      </p>
      
      <div class="signature-block">
        <div class="signature-line"></div>
        <div><strong>${data.nome.toUpperCase()}</strong></div>
        <div>(Outorgante)</div>
      </div>
    </div>
    
  </body>
  </html>
`;

export const generateProcuracaoPF = (data: PFData) => `
  <html>
  <head>${pdfStyles}</head>
  <body>
    ${headerHtml}
    ${footerHtml}
    
    <div class="main-content">
      <h2>PROCURAÇÃO</h2>
      
      <p>
        <strong>OUTORGANTE:</strong> ${data.nome.toUpperCase()}, ${data.estadoCivil.toUpperCase()}, ${data.profissao.toUpperCase()}, ${data.nacionalidade.toUpperCase()}, CPF/MF de nº ${data.cpf}, 
        residente e domiciliado em ${data.rua}, ${data.complemento} - CEP: ${data.cep}, pelo presente instrumento particular de 
        procuração nomeia e constitui seu advogado:
      </p>
      
      <p>
        <strong>OUTORGADO:</strong> Flafson Borges Barbosa, OAB/RJ 213.777, com escritório profissional localizado na 
        Av. Maria Teresa, 75, sala 328, Campo Grande - Rio de Janeiro, CEP: 23.050-160, e-mail: 
        juridico@flafsonadvocacia.com, telefone/WhatsApp: (21) 99173-5421.
      </p>
      
      <p>
        <strong>OBJETO:</strong> Representar o outorgante no processo judicial de revisão de cláusulas contratuais de 
        N°: <strong>${data.numeroProcesso}</strong>, promovendo a defesa dos seus direitos e interesses, podendo, para tanto, 
        propor quaisquer ações, medidas incidentais, acompanhar processos administrativos e/ou judiciais em qualquer 
        Juízo, Instância, Tribunal ou Repartição Pública.
      </p>
      
      <p>
        <strong>PODERES:</strong> Por este instrumento particular de procuração, constituo meus procuradores outorgados, 
        concedendo-lhe os poderes inerentes da cláusula, poderes da cláusulas ad judicia e especiais, representar o 
        outorgante perante a qualquer Tribunal de Justiça do Brasil, STF, STJ, TRT, TRF, podendo propor qualquer tipo 
        de ação, podendo ainda para tanto praticar os atos de acordar, discordar, transigir, negociar, juntar, dar quitação 
        e receber, receber os honorários contratuais separadamente firmados de trinta por cento do valor de qualquer 
        indenização deste processo diretamente no processo incluindo juros e correção monetária, firmar 
        compromissos, concordar e impugnar cálculos, renunciar e desistir, substabelecer com ou sem reservas de 
        poderes, sendo o presente instrumento de mandato oneroso e contratual, dando tudo por bom e valioso, afim 
        de praticar todos os demais atos necessários ao fiel desempenho deste mandato.
      </p>
      
      <p style="text-align: center; margin-top: 30px;">
        ${data.cidade}, ${getDay(data.dataAssinatura)} de ${getMonth(data.dataAssinatura)} de ${getYear(data.dataAssinatura)}.
      </p>
      
      <div class="signature-block">
        <div class="signature-line"></div>
        <div><strong>${data.nome.toUpperCase()}</strong></div>
        <div>(Outorgante)</div>
      </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <strong>FLAFSON BORGES BARBOSA</strong><br/>
        OAB/RJ 213.777
      </div>
    </div>
    
  </body>
  </html>
`;

export const generateContratoPF = (data: PFData) => {
  const isBoleto = data.paymentMethod === PaymentMethod.BOLETO;
  
  let paymentText = "";
  if (isBoleto) {
    paymentText = `Fará jus o contrato o valor de <strong>R$ ${data.valorTotal}</strong> de honorários iniciais, 
    pago <strong>R$ ${data.entrada}</strong> de entrada, até dia ${formatDate(new Date(data.dataEntrada + 'T12:00:00'))} + 
    <strong>${data.vezesParcelas}</strong> parcelas iguais no valor de <strong>R$ ${data.valorParcela}</strong> 
    todo dia <strong>${data.dataPagamentoParcelas}</strong>.`;
  } else {
    paymentText = `Fará jus o contrato o valor de <strong>R$ ${data.valorTotal}</strong> de honorários iniciais, 
    pagos na modalidade <strong>${data.paymentMethod.toUpperCase()}</strong>.`;
  }

  const demonstrativo = isBoleto ? generatePaymentSchedule(data.entrada, data.dataEntrada, data.vezesParcelas, data.valorParcela, data.dataPagamentoParcelas) : '';

  return `
  <html>
  <head>${pdfStyles}</head>
  <body>
    ${headerHtml}
    ${footerHtml}
    
    <div class="main-content">
      <h2>CONTRATO DE HONORÁRIOS ADVOCATÍCIOS</h2>
      
      <p>
        <strong>OUTORGANTE:</strong> <strong>${data.nome.toUpperCase()}</strong>, ${data.estadoCivil.toUpperCase()}, ${data.profissao.toUpperCase()}, ${data.nacionalidade.toUpperCase()}, CPF/MF de nº 
        ${data.cpf}, residente e domiciliado em ${data.rua}, ${data.complemento} - CEP: ${data.cep}, pelo presente instrumento 
        particular de procuração nomeia e constitui seu advogado:
      </p>
      
      <p>
        <strong>OUTORGADO:</strong> <strong>Flafson Barbosa Borges</strong>, OAB/RJ 213.777, com escritório profissional localizado 
        na Av. Maria Teresa, 75, sala 328, Campo Grande - Rio de Janeiro, CEP: 23.050-160, e-mail: 
        suporte@flafsonadvocacia.com, telefone/WhatsApp: (21) 99452-6345.
      </p>
      
      <h3>DO OBJETO DO CONTRATO</h3>
      <p>
        Cláusula 1ª. O presente instrumento tem como <u>OBJETO</u> a prestação de serviços advocatícios 
        na ação judicial de revisão de cláusulas contratuais de Nº: <strong>${data.numeroProcesso}</strong> que lhe é 
        movida a serem realizados nas instâncias ordinárias e em grau de recurso ao qual fica obrigada a 
        parte contratante a verificar os fatos e fundamentos do processo através do site do tribunal de 
        referência ou ir à serventia para verificar o seu processo e o ratificá-lo e não fazendo estará 
        automaticamente ratificado o processo com seus fatos e fundamentos redigidos. Fica obrigada a 
        parte contratante a tomar ciência do processo e seu número através do telefone do escritório ou 
        pessoalmente ao mesmo.
      </p>
      
      <h3>DAS ATIVIDADES</h3>
      <p>
        Cláusula 2ª. As atividades inclusas na prestação de serviço objeto deste instrumento são 
        todas aquelas inerentes à profissão, ou seja, todos os atos inerentes ao exercício da advocacia e 
        aqueles constantes no Estatuto da Ordem dos Advogados do Brasil, bem como os especificados no 
        instrumento de mandato. Atividades que fazem parte além as da procuração são a de atendimento 
        ao cliente inicial, redigir a petição inicial, fazer o cálculo, distribuição da peça judicial, atendimento ao 
        cliente por telefone diariamente em todos os dias úteis do ano, atendimento presencial quando 
        solicitado por e-mail suporte@flafsonadvocacia.com ou telefone acima especificado, 
        acompanhamento do processo judicial, petições interlocutórias no processo.
      </p>
      
      <h3>DOS ATOS PROCESSUAIS</h3>
      <p>
        Cláusula 3ª. Havendo necessidade de contratação de outros profissionais, no decurso do 
        processo, o CONTRATADO elaborará substabelecimento, indicando os advogados de seu 
        conhecimento.
      </p>
      
      <h3>DA COBRANÇA</h3>
      <p>
        Cláusula 4ª. As partes acordam que facultará ao CONTRATADO, o direito de realizar a 
        cobrança dos honorários por todos os meios admitidos em direito.
      </p>
      
      <h3>DOS HONORÁRIOS</h3>
      <p>
        Cláusula 5ª. ${paymentText}
      </p>
      
      ${demonstrativo}

      <p>
        Caso não pague a mensalidade ou prestação incidirá multa de 10% do valor devido e mais 
        juros de 1% e correção pelo IGP-M ao mês (na falta do índice do IGP-M será adotado outro índice 
        oficial que vier a ser adotado em seu lugar ou equivalente).
      </p>
      <p>
        Parágrafo Primeiro. Os honorários de sucumbência, que são pagos pela parte contrária, serão 
        revertidos integralmente ao CONTRATADO.
      </p>
      <p>
        Parágrafo Segundo - Caso a parte rescinda o contrato de honorários o mesmo terá que enviar 
        uma carta ao escritório com o pedido e a parte contratada ficará com os valores já pagos e os devidos 
        do contrato, <u>por se tratar de honorários iniciais.</u>
      </p>
      <p>
        Parágrafo Terceiro. Caso haja morte ou incapacidade civil do CONTRATADO, seus 
        sucessores ou representante legal receberão os honorários.
      </p>
      <p>
        Parágrafo Quarto. O contratado está autorizado a receber pelo contratante e dar quitação ao 
        processo e retirar a sua parte dos honorários (trinta porcento do total) diretamente do valor que for 
        recebido e terá o prazo de 7 dias uteis para efetuar o pagamento do valor devido ao contratante sem 
        incidir juros e correção monetária, a partir da confirmação da indenização recebida.
      </p>
      <p>
        Parágrafo Quinto. Caso tenha que pagar Imposto de Renda ou qualquer outro imposto ou que 
        o mesmo seja automaticamente deduzido no valor que receba de indenizações materiais, morais ou 
        qualquer outra natureza os mesmos serão pagos exclusivamente pela parte contratante.
      </p>
      <p>
        Cláusula 6ª. Havendo acordo entre o CONTRATANTE e a parte contrária, tal fato não 
        prejudicará o recebimento dos honorários contratados e da sucumbência.
      </p>
      <p>
        Cláusula 7ª. O CONTRATANTE concorda que os honorários advocatícios referentes às 
        custas iniciais dos serviços prestados serão pagos de forma antecipada, no caso de formalização de 
        qualquer acordo. O valor total dos honorários será estipulado na clausula 5°, e deverá ser quitado 
        antes da celebração do referido acordo.
      </p>
      
      <h3>DA RESCISÃO</h3>
      <p>
        Cláusula 8ª. O presente contrato poderá ser rescindido por qualquer das partes, mediante 
        aviso prévio, por escrito com aviso de recebimento, com 30 (trinta) dias de antecedência, incidindo 
        nesse caso a totalidade dos honorários contratados.
      </p>
      
      <h3>DOS DADOS</h3>
      <p>
        Cláusula 9ª. O contratante autoriza desde já a disponibilização dos dados somente e 
        exclusivamente para os colaboradores do escritório contratado e a única exceção será caso fique 
        inadimplente com o escritório contratado fica autorizado a disponibilizar os dados aos serviços de 
        cadastros de inadimplentes como o SPC, SERASA e PROTESTO.
      </p>
      
      <h3>DO FORO</h3>
      <p>
        Cláusula 10ª. Para dirimir quaisquer controvérsias oriundas do CONTRATO, as partes elegem 
        o foro do Centro da Cidade (comarca da capital) da comarca do Rio de Janeiro, Rio de Janeiro.
      </p>
      <p>
        Por estarem assim justos e contratados, firmam o presente instrumento, em duas vias de igual 
        teor.
      </p>
      
      <p style="text-align: center; margin-top: 30px;">
        ${data.estado}, ${getDay(data.dataAssinatura)} de ${getMonth(data.dataAssinatura)} de ${getYear(data.dataAssinatura)}.
      </p>
      
      <div class="signature-block">
        <div class="signature-line"></div>
        <div><strong>${data.nome.toUpperCase()}</strong></div>
        <div>(Outorgante)</div>
      </div>
      
      <div class="signature-block">
         <div><strong>FLAFSON BORGES BARBOSA</strong></div>
         <div>OAB/RJ 213.777</div>
      </div>
    </div>
    
  </body>
  </html>
`;
};


// --- PJ TEMPLATES ---

export const generateHipossuficienciaPJ = (data: PJData) => `
  <html>
  <head>${pdfStyles}</head>
  <body>
    ${headerHtml}
    ${footerHtml}
    
    <div class="main-content">
      <h2>DECLARAÇÃO DE HIPOSSUFICIÊNCIA</h2>
      
      <p>
        Eu, <strong>${data.representanteLegal.toUpperCase()}</strong>, ${data.nacionalidadeRep.toUpperCase()}, ${data.profissaoRep.toUpperCase()}, ${data.estadoCivilRep.toUpperCase()}, 
        portador do CPF nº: ${data.cpfRep}, residente e domiciliado em ${data.enderecoRep}, ${data.numeroEmpresa}, ${data.bairroEmpresa}, ${data.cidadeEmpresa} – ${data.ufEmpresa} - CEP: ${data.cepEmpresa},
      </p>
      
      <p>
        DECLARO, para os devidos fins, sob as penas da lei, que não possuo condições financeiras de arcar 
        com as custas processuais e honorários advocatícios sem prejuízo do meu sustento e de minha família, razão pela 
        qual requeiro os benefícios da justiça gratuita, nos termos do artigo 98 do Código de Processo Civil.
      </p>
      
      <p>
        Por ser expressão da verdade, firmo a presente.
      </p>
      
      <p style="text-align: center; margin-top: 30px;">
        ${data.cidadeEmpresa}, ${getDay(data.dataAssinatura)} de ${getMonth(data.dataAssinatura)} de ${getYear(data.dataAssinatura)}.
      </p>
      
      <div class="signature-block">
        <div class="signature-line"></div>
        <div><strong>${data.nomeRepresentanteLegalAssinatura.toUpperCase()}</strong></div>
        <div>(Outorgante)</div>
      </div>
    </div>
    
  </body>
  </html>
`;

export const generateProcuracaoPJ = (data: PJData) => `
  <html>
  <head>${pdfStyles}</head>
  <body>
    ${headerHtml}
    ${footerHtml}
    
    <div class="main-content">
      <h2>PROCURAÇÃO</h2>
      
      <p>
        <strong>OUTORGANTE:</strong> <strong>${data.nomeEmpresa.toUpperCase()}</strong>, pessoa jurídica de direito privado, inscrita no CNPJ sob nº ${data.cnpj}, 
        com sede na ${data.enderecoEmpresa}, ${data.numeroEmpresa}, ${data.bairroEmpresa}, ${data.cidadeEmpresa} – ${data.ufEmpresa} - CEP: ${data.cepEmpresa}, neste ato 
        representada por seu representante legal: Sr(a). <strong>${data.representanteLegal.toUpperCase()}</strong>, ${data.nacionalidadeRep.toUpperCase()}, ${data.profissaoRep.toUpperCase()}, 
        ${data.estadoCivilRep.toUpperCase()}, portador do CPF nº: ${data.cpfRep}, residente e domiciliado em ${data.enderecoRep}, 
        pelo presente instrumento particular de procuração nomeia e constitui seu advogado:
      </p>
      
      <p>
        <strong>OUTORGADO:</strong> Flafson Borges Barbosa, OAB/RJ 213.777, com escritório profissional localizado na 
        Av. Maria Teresa, 75, sala 328, Campo Grande - Rio de Janeiro, CEP: 23.050-160, e-mail: 
        juridico@flafsonadvocacia.com, telefone/WhatsApp: (21) 99173-5421.
      </p>
      
      <p>
        <strong>OBJETO:</strong> Representar o outorgante no processo judicial de revisão de cláusulas contratuais, 
        promovendo a defesa dos seus direitos e interesses, podendo, para tanto, propor quaisquer ações, medidas 
        incidentais, acompanhar processos administrativos e/ou judiciais em qualquer Juízo, Instância, Tribunal ou 
        Repartição Pública.
      </p>
      
      <p>
        <strong>PODERES:</strong> Por este instrumento particular de procuração, constituo meus procuradores outorgados, 
        concedendo-lhe os poderes inerentes da cláusula, poderes da cláusulas ad judicia e especiais, representar o 
        outorgante perante a qualquer Tribunal de Justiça do Brasil, STF, STJ, TRT, TRF, podendo propor qualquer tipo 
        de ação, podendo ainda para tanto praticar os atos de acordar, discordar, transigir, negociar, juntar, dar quitação 
        e receber, receber os honorários contratuais separadamente firmados de trinta por cento do valor de qualquer 
        indenização deste processo diretamente no processo incluindo juros e correção monetária, firmar 
        compromissos, concordar e impugnar cálculos, renunciar e desistir, substabelecer com ou sem reservas de 
        poderes, sendo o presente instrumento de mandato oneroso e contratual, dando tudo por bom e valioso, afim 
        de praticar todos os demais atos necessários ao fiel desempenho deste mandato.
      </p>
      
      <p style="text-align: center; margin-top: 30px;">
        ${data.cidadeEmpresa}, ${getDay(data.dataAssinatura)} de ${getMonth(data.dataAssinatura)} de ${getYear(data.dataAssinatura)}.
      </p>
      
      <div class="signature-block">
        <div class="signature-line"></div>
        <div><strong>${data.nomeRepresentanteLegalAssinatura.toUpperCase()}</strong></div>
        <div>(Representante Legal)</div>
      </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <strong>FLAFSON BORGES BARBOSA</strong><br/>
        OAB/RJ 213.777
      </div>
    </div>
    
  </body>
  </html>
`;

export const generateContratoPJ = (data: PJData) => {
  const isBoleto = data.paymentMethod === PaymentMethod.BOLETO;
  
  let paymentText = "";
  if (isBoleto) {
    paymentText = `Fará jus o contrato o valor de <strong>R$ ${data.valorTotal}</strong> de honorários iniciais, 
    pago <strong>R$ ${data.entrada}</strong> de entrada, até dia ${formatDate(new Date(data.dataEntrada + 'T12:00:00'))} + 
    <strong>${data.vezesParcelas}</strong> parcelas iguais no valor de <strong>R$ ${data.valorParcela}</strong> 
    todo dia <strong>${data.dataPagamentoParcelas}</strong>.`;
  } else {
    paymentText = `Fará jus o contrato o valor de <strong>R$ ${data.valorTotal}</strong> de honorários iniciais, 
    pagos na modalidade <strong>${data.paymentMethod.toUpperCase()}</strong>.`;
  }

  const demonstrativo = isBoleto ? generatePaymentSchedule(data.entrada, data.dataEntrada, data.vezesParcelas, data.valorParcela, data.dataPagamentoParcelas) : '';

  return `
  <html>
  <head>${pdfStyles}</head>
  <body>
    ${headerHtml}
    ${footerHtml}
    
    <div class="main-content">
      <h2>CONTRATO DE HONORÁRIOS ADVOCATÍCIOS</h2>
      
      <p>
        <strong>OUTORGANTE:</strong> <strong>${data.nomeEmpresa.toUpperCase()}</strong>, pessoa jurídica de direito privado, inscrita no CNPJ sob nº ${data.cnpj}, 
        com sede na ${data.enderecoEmpresa}, ${data.numeroEmpresa}, ${data.bairroEmpresa}, ${data.cidadeEmpresa} – ${data.ufEmpresa} - CEP: ${data.cepEmpresa},
        neste ato representada por seu:
      </p>
      
      <p>
        <strong>REPRESENTANTES LEGAIS:</strong> Sr(a). <strong>${data.representanteLegal.toUpperCase()}</strong>, ${data.nacionalidadeRep.toUpperCase()}, 
        ${data.profissaoRep.toUpperCase()}, ${data.estadoCivilRep.toUpperCase()}, portador do CPF nº: ${data.cpfRep}, residente e domiciliado em 
        ${data.enderecoRep}, pelo presente instrumento particular de procuração nomeia e constitui seu advogado:
      </p>
      
      <p>
        <strong>OUTORGADO:</strong> <strong>FLAFSON BORGES BARBOSA</strong>, OAB/RJ 213.777, com escritório profissional 
        localizado na Av. Maria Teresa, 75, sala 328, Campo Grande - Rio de Janeiro, CEP: 23.050-160, e-mail: 
        juridico@flafsonadvocacia.com, telefone/WhatsApp: (21) 99173-5421.
      </p>
      
      <h3>DO OBJETO DO CONTRATO</h3>
      <p>
        Cláusula 1ª. O presente instrumento tem como <u>OBJETO</u> a prestação de serviços advocatícios em uma 
        ação judicial de Nº: <strong>${data.numeroProcesso}</strong> Que lhe é movida a serem realizados nas Instâncias ordinárias 
        e em grau de recurso ao qual fica obrigada a parte contratante a verificar os fatos e fundamentos do processo 
        através do site do tribunal de referência ou ir à serventia para verificar o seu processo e o ratificá-lo e não 
        fazendo estará automaticamente ratificado o processo com seus fatos e fundamentos redigidos. Fica obrigada 
        a parte contratante a tomar ciência do processo e seu número através do telefone do escritório ou pessoalmente 
        ao mesmo.
      </p>
      
      <h3>DAS ATIVIDADES</h3>
      <p>
        Cláusula 2ª. As atividades inclusas na prestação de serviço objeto deste instrumento
        são todas aquelas inerentes à profissão, ou seja, todos os atos inerentes ao exercício da advocacia e aqueles 
        constantes no Estatuto da Ordem dos Advogados do Brasil, bem como os especificados no instrumento de 
        mandato. Atividades que fazem parte além as da procuração são a de atendimento ao cliente inicial, redigir a 
        petição inicial, fazer o cálculo, distribuição da peça judicial, atendimento ao cliente por telefone diariamente em 
        todos os dias úteis do ano, atendimento presencial quando solicitado por e-mail juridico@flafsonadvocacia.com
        ou telefone acima especificado, acompanhamento do processo judicial, petições interlocutórias no processo.
      </p>
      
      <h3>DOS ATOS PROCESSUAIS</h3>
      <p>
        Cláusula 3ª. Havendo necessidade de contratação de outros profissionais, no decurso do processo, o 
        CONTRATADO elaborará substabelecimento, indicando os advogados de seu conhecimento.
      </p>
      
      <h3>DA COBRANÇA</h3>
      <p>
        Cláusula 4ª. As partes acordam que facultará ao CONTRATADO, o direito de realizar a cobrança dos 
        honorários por todos os meios admitidos em direito.
      </p>
      
      <h3>DOS HONORÁRIOS</h3>
      <p>
        Cláusula 5ª. ${paymentText}
      </p>

      ${demonstrativo}

      <p>
        Caso não pague a mensalidade ou prestação incidirá multa de 10% do valor devido e mais juros de 
        1% e correção pelo IGP-M ao mês (na falta do índice do IGP-M será adotado outro índice oficial que vier a ser 
        adotado em seu lugar ou equivalente).
      </p>
      <p>
        Parágrafo Primeiro. Os honorários de sucumbência, que são pagos pela parte contrária, serão 
        revertidos integralmente ao CONTRATADO.
      </p>
      <p>
        Parágrafo Segundo - Caso a parte rescinda o contrato de honorários o mesmo terá que enviar uma 
        carta ao escritório com o pedido e a parte contratada ficará com os valores já pagos e os devidos do contrato, 
        <u>por se tratar de honorários iniciais.</u>
      </p>
      <p>
        Parágrafo Terceiro. Caso haja morte ou incapacidade civil do CONTRATADO, seus sucessores ou 
        representante legal receberão os honorários.
      </p>
      <p>
        Parágrafo Quarto. O contratado está autorizado a receber pelo contratante e dar quitação ao processo 
        e retirar a sua parte dos honorários (trinta porcento do total) diretamente do valor que for recebido e terá o prazo 
        de 7 dias uteis para efetuar o pagamento do valor devido ao contratante sem incidir juros e correção monetária, 
        a partir da confirmação da indenização recebida.
      </p>
      <p>
        Parágrafo Quinto. Caso tenha que pagar Imposto de Renda ou qualquer outro imposto ou que o 
        mesmo seja automaticamente deduzido no valor que receba de indenizações materiais, morais ou qualquer 
        outra natureza os mesmos serão pagos exclusivamente pela parte contratante.
      </p>
      <p>
        Cláusula 6ª. Havendo acordo entre o CONTRATANTE e a parte contrária, tal fato não prejudicará o 
        recebimento dos honorários contratados e da sucumbência.
      </p>
      <p>
        Cláusula 7ª. O CONTRATANTE concorda que os honorários advocatícios referentes às custas iniciais 
        dos serviços prestados serão pagos de forma antecipada, no caso de formalização de qualquer acordo. O valor 
        total dos honorários será estipulado na clausula 5°, e deverá ser quitado antes da celebração do referido 
        acordo.
      </p>
      
      <h3>DA RESCISÃO</h3>
      <p>
        Cláusula 8ª. O presente contrato poderá ser rescindido por qualquer das partes, mediante aviso prévio, 
        por escrito com aviso de recebimento, com 30 (trinta) dias de antecedência, incidindo nesse caso a totalidade 
        dos honorários contratados.
      </p>
      
      <h3>DOS DADOS</h3>
      <p>
        Cláusula 9ª. O contratante autoriza desde já a disponibilização dos dados somente e exclusivamente 
        para os colaboradores do escritório contratado e a única exceção será caso fique inadimplente com o escritório 
        contratado fica autorizado a disponibilizar os dados aos serviços de cadastros de inadimplentes como o SPC, 
        SERASA e PROTESTO.
      </p>
      
      <h3>DO FORO</h3>
      <p>
        Cláusula 10ª. Para dirimir quaisquer controvérsias oriundas do CONTRATO, as partes elegem o foro 
        do Centro da Cidade (comarca da capital) da comarca do Rio de Janeiro, Rio de Janeiro.
      </p>
      <p>
        Por estarem assim justos e contratados, firmam o presente instrumento, em duas vias de igual teor.
      </p>
      
      <p style="text-align: center; margin-top: 30px;">
        ${data.cidadeEmpresa}, ${getDay(data.dataAssinatura)} de ${getMonth(data.dataAssinatura)} de ${getYear(data.dataAssinatura)}.
      </p>
      
      <div class="signature-block">
        <div class="signature-line"></div>
        <div><strong>${data.nomeRepresentanteLegalAssinatura.toUpperCase()}</strong></div>
        <div>(Representante Legal)</div>
      </div>
      
      <div class="signature-block">
         <div><strong>FLAFSON BORGES BARBOSA</strong></div>
         <div>OAB/RJ 213.777</div>
      </div>
    </div>
    
  </body>
  </html>
`;
};