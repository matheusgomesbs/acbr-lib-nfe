import { ACBrLibNFe, IACBrLibNFeOptions } from '@ACBrLibNFe';
import path from 'node:path';

const ACBrLibPath = path.join(__dirname, 'bin', 'StdCall', 'ACBrNFe64.dll');
const ACBrFileConfigINI = path.join(__dirname, 'bin', 'ACBrLib.ini');
const XMLFile = path.join(__dirname, 'lib', 'xml', 'test-save.xml');
const eventXMLFile = path.join(__dirname, 'lib', 'xml', 'evento-teste-nfe.xml');
const eventINIFile = path.join(__dirname, 'lib', 'ini', 'evento-teste.ini');
const INIFile = path.join(__dirname, 'lib', 'ini', '01.ini');

const ACBrOptions: IACBrLibNFeOptions = {
  fileConfigINI: ''
}

const NFe = new ACBrLibNFe({
  ACBrLibPath: '',
  ACBrOptions
});

const init = NFe.initialize();
console.log('=>', init.ACBrResponse);

// Ultimo retorno
// const lastResponse = NFe.getLastResponse();
// console.log('=>', lastResponse.ACBrResponse);

// Nome Biblioteca
// const libName = NFe.getLibName();
// console.log('=>', libName.ACBrResponse);

// Versão Biblioteca
// const libVersion = NFe.getLibVersion();
// console.log('=>', libVersion.ACBrResponse);

// Ler Configuração
// const libReadConfig = NFe.readConfig();
// console.log('=>', libReadConfig.ACBrResponse);

// Gravar Configuração
// const libSaveConfig = NFe.saveConfig();
// console.log('=>', libSaveConfig.ACBrResponse);

// Ler Configuração do Item
// const libGetConfigItemValue = NFe.getConfigItemValue({
//   key: 'Sistema',
//   sessionINI: 'Nome'
// });
// console.log('=>', libGetConfigItemValue.ACBrResponse);

// gravar item na configuração
// const libSaveConfigItemValue = NFe.saveConfigItemValue({
//   key: 'Sistema',
//   sessionINI: 'Nome',
//   value: 'TesteNovaLib'
// });
// console.log('=>', libSaveConfigItemValue.ACBrResponse);

// Importar configurações
// const libImportConfig = NFe.importConfig({
//   fileConfigINI: ACBrFileConfigINI
// });
// console.log('=>', libImportConfig.ACBrResponse);

// Exportar configurações
// const libImportConfig = NFe.exportConfig();
// console.log('=>', libImportConfig.ACBrResponse);

// Carregar XML
// const libLoadXML = NFe.loadXML({
//   fileOrContent: XMLFile
// });
// console.log('=>', libLoadXML.ACBrResponse);

// Carregar INI
// const libLoadINI = NFe.loadINI({
//   fileOrContent: INIFile
// });
// console.log('=>', libLoadINI.ACBrResponse);

// Retornar o xml da NFe.
// const libGetXML = NFe.getXML({
//   position: 0
// });
// console.log('=>', libGetXML.ACBrResponse);

// Gravar o xml da NFe.
// const libSaveXML = NFe.saveXML({
//   position: 0,
//   fileName: 'test-save.xml',
//   filhePath: path.join(__dirname, 'lib', 'xml')
// });
// console.log('=>', libSaveXML.ACBrResponse);

// Retornar o INI da NFe.
// const libGetINI = NFe.getXML({
//   position: 0
// });
// console.log('=>', libGetINI.ACBrResponse);

// Gravar o INI da NFe.
// const libSaveINI = NFe.saveINI({
//   position: 0,
//   fileName: 'test-save.ini',
//   filhePath: path.join(__dirname, 'lib', 'ini')
// });
// console.log('=>', libSaveINI.ACBrResponse);

// Carregar Evento XML
// const libLoadEventXML = NFe.loadEventXML({
//   fileOrContent: eventXMLFile
// });
// console.log('=>', libLoadEventXML.ACBrResponse);

// Carregar Evento INI
// const libLoadEventINI = NFe.loadEventINI({
//   fileOrContent: eventINIFile
// });
// console.log('=>', libLoadEventINI.ACBrResponse);

// Limpar lista de NFe
// const libClearList = NFe.clearList();
// console.log('=>', libClearList.ACBrResponse);

// Limpar lista de Eventos NFe
// const libClearEventList = NFe.clearEventList();
// console.log('=>', libClearEventList.ACBrResponse);

// Assinar NFe
// const libSign = NFe.sign();
// console.log('=>', libSign.ACBrResponse);

// Validar NFe
// const libValidate = NFe.validate();
// console.log('=>', libValidate.ACBrResponse);

// Validar Regras de Negócios
// const libValidateBusinessRules = NFe.validateBusinessRules();
// console.log('=>', libValidateBusinessRules.ACBrResponse);

// Verificar assinatura
// const libVerifySignature = NFe.verifySignature();
// console.log('=>', libVerifySignature.ACBrResponse);

// Gerar chave nota fiscal
// const libGenerateKey = NFe.generateKey({
//   UFCode: UFCodeEnum.CE,
//   numericCode: 38196387,
//   model: NFeModelEnum.NFe,
//   serie: 1,
//   numberNFe: 77631,
//   typeEmission: TypeEmissionEnum.teNormal,
//   dateEmission: '22/09/2022',
//   document: '00000000000000'
// });
// console.log('=>', libGenerateKey.ACBrResponse);

// Obter Certificados
// const libGetCertificates = NFe.getCertificates();
// console.log('=>', libGetCertificates.ACBrResponse);

// Get Path
// const libGetPath = NFe.getPath({
//   pathType: PathTypeEnum.NFe
// });
// console.log('=>', libGetPath.ACBrResponse);

// Get Path evento
// const libGetEventPath = NFe.getEventPath({
//   eventCode: 0
// });
// console.log('=>', libGetEventPath.ACBrResponse);

// Verificar Status Serviço
// const libCheckServiceStatus = NFe.checkServiceStatus();
// console.log('=>', libCheckServiceStatus.ACBrResponse);

// Consultar um NFe
// const libConsult = NFe.consult({
//   keyOrContent: '00000000000000000000000000000000000000000000',
//   isEventsExtract: true
// });
// console.log('=>', libConsult.ACBrResponse);

// Consultar Recibo
// const libConsultReceipt = NFe.consultReceipt({
//   receipt: '323220034904631'
// });
// console.log('=>', libConsultReceipt.ACBrResponse);

// Consultar cadastro
// const libConsultRegistration = NFe.consultRegistration({
//   UF: 'CE',
//   document: '00000000000000',
//   isIECode: false
// });
// console.log('=>', libConsultRegistration.ACBrResponse);

// Inutilizar NFe
// const libMakeUnusable = NFe.makeUnusable({
//   document: '00000000000000',
//   justification: 'QUEBRA DE SEQUENCIA',
//   year: 2023,
//   model: NFeModelEnum.NFe,
//   serie: 1,
//   initialNumber: 10,
//   finalNumber: 10
// });
// console.log('=>', libMakeUnusable.ACBrResponse);

// Enviar NFe
// const libSend = NFe.send({
//   batchNumber: 1,
//   isPrint: true,
//   isSynchronous: false,
//   isZipped: false
// });
// console.log('=>', libSend.ACBrResponse);

// Cancelar NFe
// const libCancel = NFe.cancel({
//   NFeKey: '00000000000000000000000000000000000000000000',
//   justification: 'ERRO DE DIGITAÇÃO',
//   document: '00000000000000',
//   batchNumber: 1
// });
// console.log('=>', libCancel.ACBrResponse);

// Enviar Evento
// const libEventSend = NFe.eventSend({
//   batchNumber: 1
// });
// console.log('=>', libEventSend.ACBrResponse);

// Distribuição DFe
// const libDFeDistribution = NFe.DFeDistribution({
//   UFCode: UFCodeEnum.CE,
//   document: '00000000000000',
//   NSU: '000000000000000',
//   fileOrContent: path.join(__dirname, 'lib', 'xml', 'distribuicaoDFe')
// })
// console.log('=>', libDFeDistribution.ACBrResponse);

// Distribuição DFe Por Ult NSU
// const libDFeDistributionLastNSU = NFe.DFeDistributionLastNSU({
//   UFCode: UFCodeEnum.CE,
//   document: '00000000000000',
//   NSU: '000000000000055'
// })
// console.log('=>', libDFeDistributionLastNSU.ACBrResponse);

// Distribuição DFe Por NSU
// const libDFeDistributionNSU = NFe.DFeDistributionNSU({
//   UFCode: UFCodeEnum.CE,
//   document: '00000000000000',
//   NSU: '0'
// })
// console.log('=>', libDFeDistributionNSU.ACBrResponse);

// Distribuição DFe Por Chave
// const libDFeDistributionKey = NFe.DFeDistributionKey({
//   UFCode: UFCodeEnum.CE,
//   document: '00000000000000',
//   key: '00000000000000000000000000000000000000000000'
// })
// console.log('=>', libDFeDistributionKey.ACBrResponse);

// Enviar e-mail
// const libSendMail = NFe.sendMail({
//   from: 'matheusgomesbs@gmail.com',
//   XMLPath: XMLFile,
//   isSendPDF: true,
//   subject: 'Teste Envio E-mail ACBr',
//   CC: '',
//   attachments: '',
//   message: 'conteudo do e-mail'
// })
// console.log('=>', libSendMail.ACBrResponse);

// Enviar Evento e-mail
// const libSendEventMail = NFe.sendEventMail({
//   from: 'matheusgomesbs@gmail.com',
//   eventPath: eventXMLFile,
//   XMLPath: XMLFile,
//   isSendPDF: true,
//   subject: 'Teste Envio E-mail ACBr',
//   CC: '',
//   attachments: '',
//   message: 'conteudo do e-mail'
// })
// console.log('=>', libSendEventMail.ACBrResponse);

// Imprimir
// const libPrint = NFe.print({
//   printName: 'Microsoft Print to PDF',
//   numberCopies:1,
//   protocol: '238944234',
//   pathWaterMark: '',
//   isShowPreview: PrintDataBoolEnum.yes,
//   isSimplified: PrintDataBoolEnum.no,
//   isViaConsumer: PrintDataBoolEnum.no
// })
// console.log('=>', libPrint.ACBrResponse);

// Imprimir PDF
// const libPrintPDF = NFe.printPDF();
// console.log('=>', libPrintPDF.ACBrResponse);

// Salvar PDF
// const libSavePDF = NFe.savePDF();
// console.log('=>', libSavePDF.ACBrResponse);

// Imprimir Evento
// const libEventPrint = NFe.eventPrint({
//   fileOrContent: XMLFile,
//   eventFileOrContent: eventXMLFile
// });
// console.log('=>', libEventPrint.ACBrResponse);

// Imprimir Evento PDF
// const libEventPrintPDF = NFe.eventPrintPDF({
//   fileOrContent: XMLFile,
//   eventFileOrContent: eventXMLFile
// });
// console.log('=>', libEventPrintPDF.ACBrResponse);

// Salvar Evento PDF
// const libSaveEventPDF = NFe.saveEventPDF({
//   fileOrContent: XMLFile,
//   eventFileOrContent: eventXMLFile
// });
// console.log('=>', libSaveEventPDF.ACBrResponse);

// Imprimir Inutilização
// const libPrintUnusable = NFe.printUnusable({
  //   pathXMLFile: XMLUnusableFile
  // });
// console.log('=>', libPrintUnusable.ACBrResponse);

// Imprimir Inutilização PDF
// const libPrintUnusablePDF = NFe.printUnusablePDF({
  //   pathXMLFile: XMLUnusableFile
  // });
// console.log('=>', libPrintUnusablePDF.ACBrResponse);

// Salvar Inutilização PDF
// const libSaveUnusablePDF = NFe.saveUnusablePDF({
//   pathXMLFile: XMLUnusableFile
// });
// console.log('=>', libSaveUnusablePDF.ACBrResponse);

const finish = NFe.finish();
console.log('=>', finish.ACBrResponse);
