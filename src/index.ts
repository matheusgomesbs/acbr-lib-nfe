import koffi from 'koffi';

import { IACBrLibNFe } from '@interfaces';
import { ConsultRegistrationData, DFeDefaultData, DFeDistributionData, DFeDistributionKeyData, FileOrContentData, GenerateKeyData, GetConfigItemValueData, GetPathData, IACBrLibNFeResponse, MakeUnusableData, NFeCancelData, NFeConsultData, NFePositionData, NFeSaveData, NFeSendData, PrintData, ReadSaveImportConfigData, SaveConfigItemValueData, SendMailDefaultData, SendMailEventMailData, UnusablePrintSaveData } from '@types';

export interface IACBrLibNFeOptions{
  fileConfigINI: string;
  keyCrypt?: string;
}

const BUFFER_LENGTH = 1024 * 6;

export class ACBrLibNFe implements IACBrLibNFe {
  private ACBrLib: koffi.IKoffiLib;
  private ACBrOptions: IACBrLibNFeOptions;
  private ACBrResponse: Buffer = Buffer.alloc(BUFFER_LENGTH);
  private ACBrResponseLength: number[] = [BUFFER_LENGTH];
  private ACBrTypeResponse = ['_Out_ str *ACBrResponse', '_Inout_ int *ACBrResponseLength'];
  
  constructor(options: {ACBrLibPath:string, ACBrOptions: IACBrLibNFeOptions}) {
    this.ACBrLib = koffi.load(options.ACBrLibPath); 
    this.ACBrOptions = options.ACBrOptions;
  }

  initialize() {
    const NFeInit = this.ACBrLib.func('NFE_Inicializar', 'int', ['string', 'string']);
    const {fileConfigINI, keyCrypt} = this.ACBrOptions;    
    const data = NFeInit(fileConfigINI, keyCrypt);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Biblioteca foi inicializada corretamente.'
    }
  }

  finish() {
    const NFeFinish = this.ACBrLib.func('NFE_Finalizar', 'int', []);
    const data = NFeFinish();

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Biblioteca foi finalizada corretamente.'
    }
  }

  getLastResponse() {
    const NFeLastResponse = this.ACBrLib.func('NFE_UltimoRetorno', 'int', this.ACBrTypeResponse);
    const data = NFeLastResponse(this.ACBrResponse, this.ACBrResponseLength);    

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  getLibName() {
    const NFeName = this.ACBrLib.func('NFE_Nome', 'int', this.ACBrTypeResponse);
    const data = NFeName(this.ACBrResponse, this.ACBrResponseLength);      

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  getLibVersion() {
    const NFeVersion = this.ACBrLib.func('NFE_Versao', 'int', this.ACBrTypeResponse);
    const data = NFeVersion(this.ACBrResponse, this.ACBrResponseLength);      

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  readConfig(options?: ReadSaveImportConfigData): IACBrLibNFeResponse {
    const NFeReadConfig = this.ACBrLib.func('NFE_ConfigLer', 'int', ['string']);
    const fileConfigINI = options?.fileConfigINI ?? this.ACBrOptions.fileConfigINI;
    const data = NFeReadConfig(fileConfigINI);      

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Configurações foram lidas corretamente.'
    }
  }

  saveConfig(options?: ReadSaveImportConfigData): IACBrLibNFeResponse {
    const NFeSaveConfig = this.ACBrLib.func('NFE_ConfigGravar', 'int', ['string']);
    const fileConfigINI = options?.fileConfigINI ?? this.ACBrOptions.fileConfigINI;
    const data = NFeSaveConfig(fileConfigINI);      

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Configurações foram gravadas corretamente.'
    }
  }

  getConfigItemValue(options: GetConfigItemValueData): IACBrLibNFeResponse {
    const NFeGetConfigValue = this.ACBrLib.func('NFE_ConfigLerValor', 'int', ['string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeGetConfigValue(options.sessionINI, options.key, this.ACBrResponse, this.ACBrResponseLength)

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  saveConfigItemValue(options: SaveConfigItemValueData): IACBrLibNFeResponse {
    const NFeSaveConfigValue = this.ACBrLib.func('NFE_ConfigGravarValor', 'int', ['string', 'string', 'string']);
    const data = NFeSaveConfigValue(options.sessionINI, options.key, options.value)

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Configuração gravadas corretamente.'
    }
  }

  importConfig(options?: ReadSaveImportConfigData): IACBrLibNFeResponse {
    const NFeImportConfig = this.ACBrLib.func('NFE_ConfigImportar', 'int', ['string']);
    const fileConfigINI = options?.fileConfigINI ?? this.ACBrOptions.fileConfigINI;
    const data = NFeImportConfig(fileConfigINI)

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Configuração importada corretamente.'
    }
  }

  exportConfig(): IACBrLibNFeResponse {
    const NFeExportConfig = this.ACBrLib.func('NFE_ConfigExportar', 'int', this.ACBrTypeResponse);
    const data = NFeExportConfig(this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  loadXML(options: Pick<FileOrContentData, 'fileOrContent'>): IACBrLibNFeResponse {
    const NFeLoadXML = this.ACBrLib.func('NFE_CarregarXML', 'int', ['string']);
    const data = NFeLoadXML(options.fileOrContent);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Arquivo/Conteúdo XML carregado corretamente.'
    }
  }

  loadINI(options: Pick<FileOrContentData, 'fileOrContent'>): IACBrLibNFeResponse{
    const NFeLoadINI = this.ACBrLib.func('NFE_CarregarINI', 'int', ['string']);
    const data = NFeLoadINI(options.fileOrContent);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Arquivo/Conteúdo INI carregado corretamente.'
    }
  }

  getXML(options: NFePositionData): IACBrLibNFeResponse{
    const NFeGetXML = this.ACBrLib.func('NFE_ObterXml', 'int', ['int', ...this.ACBrTypeResponse]);
    const data = NFeGetXML(options.position, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }
  
  saveXML(options: NFeSaveData): IACBrLibNFeResponse {
    const NFeSaveXML = this.ACBrLib.func('NFE_GravarXml', 'int', ['int', 'string', 'string']);
    const data = NFeSaveXML(options.position, options.fileName, options.filhePath);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Arquivo XML gravado corretamente.'
    }
  }
  
  getINI(options: NFePositionData): IACBrLibNFeResponse{
    const NFeGetINI = this.ACBrLib.func('NFE_ObterIni', 'int', ['int', ...this.ACBrTypeResponse]);
    const data = NFeGetINI(options.position, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }
  
  saveINI(options: NFeSaveData): IACBrLibNFeResponse {
    const NFeSaveINI = this.ACBrLib.func('NFE_GravarIni', 'int', ['int', 'string', 'string']);
    const data = NFeSaveINI(options.position, options.fileName, options.filhePath);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Arquivo INI gravado corretamente.'
    }
  }

  loadEventXML(options: Pick<FileOrContentData, 'fileOrContent'>): IACBrLibNFeResponse {
    const NFeLoadEventXML = this.ACBrLib.func('NFE_CarregarEventoXML', 'int', ['string']);
    const data = NFeLoadEventXML(options.fileOrContent);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Arquivo/Conteúdo XML de evento carregado corretamente.'
    }
  }

  loadEventINI(options: Pick<FileOrContentData, 'fileOrContent'>): IACBrLibNFeResponse {
    const NFeLoadEventINI = this.ACBrLib.func('NFE_CarregarEventoINI', 'int', ['string']);
    const data = NFeLoadEventINI(options.fileOrContent);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Arquivo/Conteúdo INI de evento carregado corretamente.'
    }
  }

  clearList(): IACBrLibNFeResponse {
    const NFeClearList = this.ACBrLib.func('NFE_LimparLista', 'int', []);
    const data = NFeClearList();

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Lista de notas foi limpo corretamente.'
    }
  }

  clearEventList(): IACBrLibNFeResponse {
    const NFeClearEventList = this.ACBrLib.func('NFE_LimparListaEventos', 'int', []);
    const data = NFeClearEventList();

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Lista de eventos foi limpo corretamente.'
    }
  }

  sign(): IACBrLibNFeResponse {
    const NFeSign = this.ACBrLib.func('NFE_Assinar', 'int', []);
    const data = NFeSign();

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Notas carregadas assinadas corretamente.'
    }
  }

  validate(): IACBrLibNFeResponse {
    const NFeValidate = this.ACBrLib.func('NFE_Validar', 'int', []);
    const data = NFeValidate();

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Notas carregadas validadas corretamente.'
    }
  }

  validateBusinessRules(): IACBrLibNFeResponse {
    const NFeValidateBusinessRules = this.ACBrLib.func('NFE_ValidarRegrasdeNegocios', 'int', this.ACBrTypeResponse);
    const data = NFeValidateBusinessRules(this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  verifySignature(): IACBrLibNFeResponse {
    const NFeVerifySignature = this.ACBrLib.func('NFE_VerificarAssinatura', 'int', this.ACBrTypeResponse);
    const data = NFeVerifySignature(this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  generateKey(options: GenerateKeyData): IACBrLibNFeResponse {
    const NFeGenerateKey = this.ACBrLib.func('NFE_GerarChave', 'int', ['int', 'int', 'int', 'int', 'int', 'int', 'string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeGenerateKey(options.UFCode, options.numericCode, options.model, options.serie, options.numberNFe, options.typeEmission, options.dateEmission, options.document, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  getCertificates(): IACBrLibNFeResponse {
    const NFeGetCertificates = this.ACBrLib.func('NFE_ObterCertificados', 'int', this.ACBrTypeResponse);
    const data = NFeGetCertificates(this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  getPath(options: GetPathData): IACBrLibNFeResponse {
    const NFeGetPath = this.ACBrLib.func('NFE_GetPath', 'int', ['int', ...this.ACBrTypeResponse]);
    const data = NFeGetPath(options.pathType, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }
  getEventPath(options: { eventCode: number }): IACBrLibNFeResponse {
    const NFeGetEventPath = this.ACBrLib.func('NFE_GetPathEvento', 'int', ['int', ...this.ACBrTypeResponse]);
    const data = NFeGetEventPath(options.eventCode, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  checkServiceStatus(): IACBrLibNFeResponse {
    const NFeCheckServiceStatus = this.ACBrLib.func('NFE_StatusServico', 'int', this.ACBrTypeResponse);
    const data = NFeCheckServiceStatus(this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  consult(options: NFeConsultData): IACBrLibNFeResponse {
    const NFeConsult = this.ACBrLib.func('NFE_Consultar', 'int', ['string', 'bool', ...this.ACBrTypeResponse]);
    const data = NFeConsult(options.keyOrContent, options.isEventsExtract, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  consultReceipt(options: {receipt: string}): IACBrLibNFeResponse {
    const NFeConsultReceipt = this.ACBrLib.func('NFE_ConsultarRecibo', 'int', ['string',...this.ACBrTypeResponse]);
    const data = NFeConsultReceipt(options.receipt, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  consultRegistration(options: ConsultRegistrationData): IACBrLibNFeResponse {
    const NFeConsultRegistration = this.ACBrLib.func('NFE_ConsultaCadastro', 'int', ['string', 'string', 'bool', ...this.ACBrTypeResponse]);
    const data = NFeConsultRegistration(options.UF, options.document, options.isIECode, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }
  
  makeUnusable(options: MakeUnusableData): IACBrLibNFeResponse {
    const NFeMakeUnusable = this.ACBrLib.func('NFE_Inutilizar', 'int', ['string', 'string', 'int', 'int', 'int', 'int', 'int', ...this.ACBrTypeResponse]);
    const data = NFeMakeUnusable(options.document, options.justification, options.year, options.model, options.serie, options.initialNumber, options.finalNumber, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  send(options: NFeSendData): IACBrLibNFeResponse {
    const NFeSend = this.ACBrLib.func('NFE_Enviar', 'int', ['int', 'bool', 'bool', 'bool', ...this.ACBrTypeResponse]);
    const data = NFeSend(options.batchNumber, options.isPrint, options.isSynchronous, options.isZipped, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  cancel(options: NFeCancelData): IACBrLibNFeResponse {
    const NFeCancel = this.ACBrLib.func('NFE_Cancelar', 'int', ['string', 'string', 'string', 'int', ...this.ACBrTypeResponse]);
    const data = NFeCancel(options.NFeKey, options.justification, options.document, options.batchNumber, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  eventSend(options:{batchNumber: number}): IACBrLibNFeResponse {
    const NFeEventSend = this.ACBrLib.func('NFE_EnviarEvento', 'int', ['int', ...this.ACBrTypeResponse]);
    const data = NFeEventSend(options.batchNumber, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  DFeDistribution(options: DFeDistributionData): IACBrLibNFeResponse {
    const NFeDFeDistribution = this.ACBrLib.func('NFE_DistribuicaoDFe', 'int', ['int', 'string', 'string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeDFeDistribution(options.UFCode, options.document, options.NSU, options.fileOrContent, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  DFeDistributionLastNSU(options: DFeDefaultData): IACBrLibNFeResponse {
    const NFeDFeDistributionLastNSU = this.ACBrLib.func('NFE_DistribuicaoDFePorUltNSU', 'int', ['int', 'string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeDFeDistributionLastNSU(options.UFCode, options.document, options.NSU, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  DFeDistributionNSU(options: DFeDefaultData): IACBrLibNFeResponse {
    const NFeDFeDistributionNSU = this.ACBrLib.func('NFE_DistribuicaoDFePorNSU', 'int', ['int', 'string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeDFeDistributionNSU(options.UFCode, options.document, options.NSU, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  DFeDistributionKey(options: DFeDistributionKeyData) {
    const NFeDFeDistributionKey = this.ACBrLib.func('NFE_DistribuicaoDFePorChave', 'int', ['int', 'string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeDFeDistributionKey(options.UFCode, options.document, options.key, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  sendMail(options: SendMailDefaultData): IACBrLibNFeResponse {
    const NFeSendMail = this.ACBrLib.func('NFE_EnviarEmail', 'int', ['string', 'string', 'bool', 'string', 'string', 'string', 'string']);
    const data = NFeSendMail(options.from, options.XMLPath, options.isSendPDF, options.subject, options.CC, options.attachments, options.message);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'E-mail enviado corretamente.'
    }
  }

  sendEventMail(options: SendMailEventMailData): IACBrLibNFeResponse {
    const NFeSendEventMail = this.ACBrLib.func('NFE_EnviarEmailEvento', 'int', ['string', 'string', 'string', 'bool', 'string', 'string', 'string', 'string']);
    const data = NFeSendEventMail(options.from, options.eventPath, options.XMLPath, options.isSendPDF, options.subject, options.CC, options.attachments, options.message);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'E-mail enviado corretamente.'
    }
  }

  print(options: PrintData): IACBrLibNFeResponse {
    const NFePrint = this.ACBrLib.func('NFE_Imprimir', 'int', ['string', 'int', 'string', 'string', 'string', 'string', 'string']);
    const data = NFePrint(options.printName, options.numberCopies, options.protocol, options.isShowPreview, options.pathWaterMark, options.isViaConsumer, options.isSimplified);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Impresso corretamente.'
    }
  }

  printPDF(): IACBrLibNFeResponse {
    const NFePrintPDF = this.ACBrLib.func('NFE_ImprimirPDF', 'int', []);
    const data = NFePrintPDF();

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'PDF Impresso corretamente.'
    }
  }

  savePDF(): IACBrLibNFeResponse {
    const NFeSavePDF = this.ACBrLib.func('NFE_SalvarPDF', 'int', this.ACBrTypeResponse);
    const data = NFeSavePDF();

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : this.ACBrResponse.toString()
    }
  }

  eventPrint(options: FileOrContentData): IACBrLibNFeResponse {
    const NFeEventPrint = this.ACBrLib.func('NFE_ImprimirEvento', 'int', ['string', 'string']);
    const data = NFeEventPrint(options.fileOrContent, options.eventFileOrContent);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Evento impresso corretamente.'
    }
  }

  eventPrintPDF(options: FileOrContentData): IACBrLibNFeResponse {
    const NFeEventPrintPDF = this.ACBrLib.func('NFE_ImprimirEventoPDF', 'int', ['string', 'string']);
    const data = NFeEventPrintPDF(options.fileOrContent, options.eventFileOrContent);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'PDF do evento impresso corretamente.'
    }
  }

  saveEventPDF(options: FileOrContentData): IACBrLibNFeResponse {
    const NFeSaveEventPDF = this.ACBrLib.func('NFE_SalvarEventoPDF', 'int', ['string', 'string']);
    const data = NFeSaveEventPDF(options.fileOrContent, options.eventFileOrContent);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'PDF do evento impresso corretamente.'
    }
  }

  printUnusable(options: UnusablePrintSaveData): IACBrLibNFeResponse {
    const NFePrintUnusable = this.ACBrLib.func('NFE_ImprimirInutilizacao', 'int', ['string']);
    const data = NFePrintUnusable(options.pathXMLFile);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'Inutilização impressa corretamente.'
    }
  }

  printUnusablePDF(options: UnusablePrintSaveData): IACBrLibNFeResponse {
    const NFePrintUnusablePDF = this.ACBrLib.func('NFE_ImprimirInutilizacaoPDF', 'int', ['string']);
    const data = NFePrintUnusablePDF(options.pathXMLFile);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'PDF da inutilização impresso corretamente.'
    }
  }

  saveUnusablePDF(options: UnusablePrintSaveData): IACBrLibNFeResponse {
    const NFeSaveUnusablePDF = this.ACBrLib.func('NFE_SalvarInutilizacaoPDF', 'int', ['string']);
    const data = NFeSaveUnusablePDF(options.pathXMLFile);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? this.libError(data) : 'PDF da inutilização salvo corretamente.'
    }
  }

  private libError(response: number) {
    let message:string = 'Mensagem não catalogada!';
    
    if(response === -1) message = '[ERROR] Houve falhas na inicialização da biblioteca.';
    if(response === -2) message = '[ERROR] Houve falhas na finalização da biblioteca.';
    if(response === -3) message = '[ERROR] Houve erro ao ler a configuração informada.';
    if(response === -4) message = '[ERROR] Valor informado incorreto.';
    if(response === -5) message = '[ERROR] Não foi possível localizar o arquivo informado.';
    if(response === -6) message = '[ERROR] Não foi possível encontrar o diretório do arquivo.';
    if(response === -7) message = '[ERROR] Erro na comunicação HTTP.';
    if(response === -10) message = '[ERROR] Houve falhas na execução do método.';
    if(response === -11) message = '[ERROR] Falha na validação do xml.';
    if(response === -12) message = '[ERROR] Falha na validação da chave passada.';
    if(response === -13) message = '[ERROR] Índice passado não se encontra no intervalo.';
    if(response === -14) message = '[ERROR] Houve um erro ao gerar o xml.';
    if(response === -17) message = '[ERROR] Nenhuma NF-e foi adicionada ao lote ou adicionado mais de 50 NFe.';
  
    return message
  }
}