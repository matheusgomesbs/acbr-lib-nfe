import koffi from 'koffi';

import { libError } from '@errors';
import { IACBrLibNFe } from '@interfaces';
import { ConsultRegistrationData, DFeDefaultData, DFeDistributionData, DFeDistributionKeyData, FileOrContentData, GenerateKeyData, GetConfigItemValueData, GetPathData, IACBrLibNFeResponse, MakeUnusableData, NFeCancelData, NFeConsultData, NFePositionData, NFeSaveData, NFeSendData, PrintData, ReadSaveImportConfigData, SaveConfigItemValueData, SendMailDefaultData, SendMailEventMailData, UnusablePrintSaveData } from '@types';

export interface IACBrLibNFeOptions{
  fileConfigINI: string;
  keyCrypt?: string;
}

const BUFFER_LENGTH = 1024 * 6;

/**
 * ACBrLibNFe is a library (dll) developed using the ACBrNFe component 
 * of the ACBr Project, which enables the issuance of Electronic 
 * Invoices and Electronic Consumer Invoices, as well as 
 * all events related to these DFes.
 *
 * @export
 * @class ACBrLibNFe
 * @implements {IACBrLibNFe}
 */
export class ACBrLibNFe implements IACBrLibNFe {
  private ACBrLib: koffi.IKoffiLib;
  private ACBrOptions: IACBrLibNFeOptions;
  private ACBrResponse: Buffer = Buffer.alloc(BUFFER_LENGTH);
  private ACBrResponseLength: number[] = [BUFFER_LENGTH];
  private ACBrTypeResponse = ['_Out_ str *ACBrResponse', '_Inout_ int *ACBrResponseLength'];
  

  /**
   * Creates an instance of ACBrLibNFe.
   * @param {{ACBrLibPath:string, ACBrOptions: IACBrLibNFeOptions}} options
   * @memberof ACBrLibNFe
   */
  constructor(options: {ACBrLibPath:string, ACBrOptions: IACBrLibNFeOptions}) {
    this.ACBrLib = koffi.load(options.ACBrLibPath); 
    this.ACBrOptions = options.ACBrOptions;
  }

  /**
   * Method used to initialize the component for library use.
   *
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  initialize(): IACBrLibNFeResponse {
    const NFeInit = this.ACBrLib.func('NFE_Inicializar', 'int', ['string', 'string']);
    const {fileConfigINI, keyCrypt} = this.ACBrOptions;    
    const data = NFeInit(fileConfigINI, keyCrypt);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Biblioteca foi inicializada corretamente.'
    }
  }

  /**
   * Method used to remove the ACBrNFe component and its classes from memory.
   *
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  finish(): IACBrLibNFeResponse {
    const NFeFinish = this.ACBrLib.func('NFE_Finalizar', 'int', []);
    const data = NFeFinish();

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Biblioteca foi finalizada corretamente.'
    }
  }

  /**
   * Method used to return the last return processed by the library.
   *
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  getLastResponse(): IACBrLibNFeResponse {
    const NFeLastResponse = this.ACBrLib.func('NFE_UltimoRetorno', 'int', this.ACBrTypeResponse);
    const data = NFeLastResponse(this.ACBrResponse, this.ACBrResponseLength);    

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method that returns the name of the library.
   *
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  getLibName(): IACBrLibNFeResponse {
    const NFeName = this.ACBrLib.func('NFE_Nome', 'int', this.ACBrTypeResponse);
    const data = NFeName(this.ACBrResponse, this.ACBrResponseLength);      

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method that returns the library version.
   *
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  getLibVersion(): IACBrLibNFeResponse {
    const NFeVersion = this.ACBrLib.func('NFE_Versao', 'int', this.ACBrTypeResponse);
    const data = NFeVersion(this.ACBrResponse, this.ACBrResponseLength);      

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to read the library configuration from the given INI file.
   *
   * @param {ReadSaveImportConfigData} [options]
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  readConfig(options?: ReadSaveImportConfigData): IACBrLibNFeResponse {
    const NFeReadConfig = this.ACBrLib.func('NFE_ConfigLer', 'int', ['string']);
    const fileConfigINI = options?.fileConfigINI ?? this.ACBrOptions.fileConfigINI;
    const data = NFeReadConfig(fileConfigINI);      

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Configurações foram lidas corretamente.'
    }
  }

  /**
   * Method used to write the library configuration to the specified INI file.
   *
   * @param {ReadSaveImportConfigData} [options]
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  saveConfig(options?: ReadSaveImportConfigData): IACBrLibNFeResponse {
    const NFeSaveConfig = this.ACBrLib.func('NFE_ConfigGravar', 'int', ['string']);
    const fileConfigINI = options?.fileConfigINI ?? this.ACBrOptions.fileConfigINI;
    const data = NFeSaveConfig(fileConfigINI);      

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Configurações foram gravadas corretamente.'
    }
  }

  /**
   * Method used to read a specific configuration item.
   *
   * @param {GetConfigItemValueData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  getConfigItemValue(options: GetConfigItemValueData): IACBrLibNFeResponse {
    const NFeGetConfigValue = this.ACBrLib.func('NFE_ConfigLerValor', 'int', ['string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeGetConfigValue(options.sessionINI, options.key, this.ACBrResponse, this.ACBrResponseLength)

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to write a specific configuration item.
   *
   * @param {SaveConfigItemValueData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  saveConfigItemValue(options: SaveConfigItemValueData): IACBrLibNFeResponse {
    const NFeSaveConfigValue = this.ACBrLib.func('NFE_ConfigGravarValor', 'int', ['string', 'string', 'string']);
    const data = NFeSaveConfigValue(options.sessionINI, options.key, options.value)

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Configuração gravadas corretamente.'
    }
  }

  /**
   * Method used to import the library configuration from the given INI file.
   *
   * @param {ReadSaveImportConfigData} [options]
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  importConfig(options?: ReadSaveImportConfigData): IACBrLibNFeResponse {
    const NFeImportConfig = this.ACBrLib.func('NFE_ConfigImportar', 'int', ['string']);
    const fileConfigINI = options?.fileConfigINI ?? this.ACBrOptions.fileConfigINI;
    const data = NFeImportConfig(fileConfigINI)

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Configuração importada corretamente.'
    }
  }

  /**
   * Method used to export the library configuration from the given INI file.
   *
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  exportConfig(): IACBrLibNFeResponse {
    const NFeExportConfig = this.ACBrLib.func('NFE_ConfigExportar', 'int', this.ACBrTypeResponse);
    const data = NFeExportConfig(this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to read the XML file for the ACBrNFe component.
   *
   * @param {Pick<FileOrContentData, 'fileOrContent'>} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  loadXML(options: Pick<FileOrContentData, 'fileOrContent'>): IACBrLibNFeResponse {
    const NFeLoadXML = this.ACBrLib.func('NFE_CarregarXML', 'int', ['string']);
    const data = NFeLoadXML(options.fileOrContent);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Arquivo/Conteúdo XML carregado corretamente.'
    }
  }

  /**
   * Method used to read the INI file for the ACBrNFe component.
   *
   * @param {Pick<FileOrContentData, 'fileOrContent'>} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  loadINI(options: Pick<FileOrContentData, 'fileOrContent'>): IACBrLibNFeResponse{
    const NFeLoadINI = this.ACBrLib.func('NFE_CarregarINI', 'int', ['string']);
    const data = NFeLoadINI(options.fileOrContent);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Arquivo/Conteúdo INI carregado corretamente.'
    }
  }


  /**
   * Method to return the NFe xml.
   *
   * @param {NFePositionData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  getXML(options: NFePositionData): IACBrLibNFeResponse{
    const NFeGetXML = this.ACBrLib.func('NFE_ObterXml', 'int', ['int', ...this.ACBrTypeResponse]);
    const data = NFeGetXML(options.position, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }
  
  /**
   * Method to write the NFe xml.
   *
   * @param {NFeSaveData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  saveXML(options: NFeSaveData): IACBrLibNFeResponse {
    const NFeSaveXML = this.ACBrLib.func('NFE_GravarXml', 'int', ['int', 'string', 'string']);
    const data = NFeSaveXML(options.position, options.fileName, options.filhePath);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Arquivo XML gravado corretamente.'
    }
  }
  
  /**
   * Method to return the NFe xml in INI format.
   *
   * @param {NFePositionData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  getINI(options: NFePositionData): IACBrLibNFeResponse{
    const NFeGetINI = this.ACBrLib.func('NFE_ObterIni', 'int', ['int', ...this.ACBrTypeResponse]);
    const data = NFeGetINI(options.position, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }
  
  /**
   * Method to write the NFe xml in INI format.
   *
   * @param {NFeSaveData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  saveINI(options: NFeSaveData): IACBrLibNFeResponse {
    const NFeSaveINI = this.ACBrLib.func('NFE_GravarIni', 'int', ['int', 'string', 'string']);
    const data = NFeSaveINI(options.position, options.fileName, options.filhePath);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Arquivo INI gravado corretamente.'
    }
  }

  /**
   * Method used to read the XML file for the ACBrNFe component.
   *
   * @param {Pick<FileOrContentData, 'fileOrContent'>} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  loadEventXML(options: Pick<FileOrContentData, 'fileOrContent'>): IACBrLibNFeResponse {
    const NFeLoadEventXML = this.ACBrLib.func('NFE_CarregarEventoXML', 'int', ['string']);
    const data = NFeLoadEventXML(options.fileOrContent);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Arquivo/Conteúdo XML de evento carregado corretamente.'
    }
  }

  /**
   * Method used to read the INI file for the ACBrNFe component.
   *
   * @param {Pick<FileOrContentData, 'fileOrContent'>} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  loadEventINI(options: Pick<FileOrContentData, 'fileOrContent'>): IACBrLibNFeResponse {
    const NFeLoadEventINI = this.ACBrLib.func('NFE_CarregarEventoINI', 'int', ['string']);
    const data = NFeLoadEventINI(options.fileOrContent);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Arquivo/Conteúdo INI de evento carregado corretamente.'
    }
  }

  /**
   * Method used to clear the list of notes in the ACBrNFe component.
   *
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  clearList(): IACBrLibNFeResponse {
    const NFeClearList = this.ACBrLib.func('NFE_LimparLista', 'int', []);
    const data = NFeClearList();

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Lista de notas foi limpo corretamente.'
    }
  }

  /**
   * Method used to clear the event list in the ACBrNFe component.
   *
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  clearEventList(): IACBrLibNFeResponse {
    const NFeClearEventList = this.ACBrLib.func('NFE_LimparListaEventos', 'int', []);
    const data = NFeClearEventList();

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Lista de eventos foi limpo corretamente.'
    }
  }

  /**
   * Method used to sign notes loaded into the ACBrNFe component.
   *
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  sign(): IACBrLibNFeResponse {
    const NFeSign = this.ACBrLib.func('NFE_Assinar', 'int', []);
    const data = NFeSign();

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Notas carregadas assinadas corretamente.'
    }
  }

  /**
   * Method used to validate signed notes through the ACBrNFe component.
   *
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  validate(): IACBrLibNFeResponse {
    const NFeValidate = this.ACBrLib.func('NFE_Validar', 'int', []);
    const data = NFeValidate();

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Notas carregadas validadas corretamente.'
    }
  }

  /**
   * Method used to Validate Business Rules of data found in the XML 
   * of an NF-e.
   *
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  validateBusinessRules(): IACBrLibNFeResponse {
    const NFeValidateBusinessRules = this.ACBrLib.func('NFE_ValidarRegrasdeNegocios', 'int', this.ACBrTypeResponse);
    const data = NFeValidateBusinessRules(this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to verify the signature of an XML.
   *
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  verifySignature(): IACBrLibNFeResponse {
    const NFeVerifySignature = this.ACBrLib.func('NFE_VerificarAssinatura', 'int', this.ACBrTypeResponse);
    const data = NFeVerifySignature(this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to generate a key to the fiscal document.
   *
   * @param {GenerateKeyData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  generateKey(options: GenerateKeyData): IACBrLibNFeResponse {
    const NFeGenerateKey = this.ACBrLib.func('NFE_GerarChave', 'int', ['int', 'int', 'int', 'int', 'int', 'int', 'string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeGenerateKey(options.UFCode, options.numericCode, options.model, options.serie, options.numberNFe, options.typeEmission, options.dateEmission, options.document, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to return a list of certificate data installed on the machine:
   * - With certificate Installed on Windows and using WinCrypt, 
   * just execute the command;
   * - Using OpenSSL (Linux/Windows) we must configure the INI (DFe Settings) 
   * and enter the path and pfx file (ArquivoPFX=c:\temp\certificate.pfx) 
   * and the password before executing the command;
   *
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  getCertificates(): IACBrLibNFeResponse {
    const NFeGetCertificates = this.ACBrLib.func('NFE_ObterCertificados', 'int', this.ACBrTypeResponse);
    const data = NFeGetCertificates(this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to return the path where the 
   * documents generated by the library will be saved.
   *
   * @param {GetPathData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  getPath(options: GetPathData): IACBrLibNFeResponse {
    const NFeGetPath = this.ACBrLib.func('NFE_GetPath', 'int', ['int', ...this.ACBrTypeResponse]);
    const data = NFeGetPath(options.pathType, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to return the path where the
   * events generated by the library will be saved.
   *
   * @param {{ eventCode: number }} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  getEventPath(options: { eventCode: number }): IACBrLibNFeResponse {
    const NFeGetEventPath = this.ACBrLib.func('NFE_GetPathEvento', 'int', ['int', ...this.ACBrTypeResponse]);
    const data = NFeGetEventPath(options.eventCode, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to Consult the Service Status at SEFAZ.
   *
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  checkServiceStatus(): IACBrLibNFeResponse {
    const NFeCheckServiceStatus = this.ACBrLib.func('NFE_StatusServico', 'int', this.ACBrTypeResponse);
    const data = NFeCheckServiceStatus(this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to consult an NFe at SEFAZ.
   *
   * @param {NFeConsultData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  consult(options: NFeConsultData): IACBrLibNFeResponse {
    const NFeConsult = this.ACBrLib.func('NFE_Consultar', 'int', ['string', 'bool', ...this.ACBrTypeResponse]);
    const data = NFeConsult(options.keyOrContent, options.isEventsExtract, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to consult the shipping receipt at SEFAZ.
   *
   * @param {{receipt: string}} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  consultReceipt(options: {receipt: string}): IACBrLibNFeResponse {
    const NFeConsultReceipt = this.ACBrLib.func('NFE_ConsultarRecibo', 'int', ['string',...this.ACBrTypeResponse]);
    const data = NFeConsultReceipt(options.receipt, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to consult the SEFAZ registry.
   *
   * @param {ConsultRegistrationData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  consultRegistration(options: ConsultRegistrationData): IACBrLibNFeResponse {
    const NFeConsultRegistration = this.ACBrLib.func('NFE_ConsultaCadastro', 'int', ['string', 'string', 'bool', ...this.ACBrTypeResponse]);
    const data = NFeConsultRegistration(options.UF, options.document, options.isIECode, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }
  
  /**
   * Method used to make a number or range of numbers unusable in SEFAZ.
   *
   * @param {MakeUnusableData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  makeUnusable(options: MakeUnusableData): IACBrLibNFeResponse {
    const NFeMakeUnusable = this.ACBrLib.func('NFE_Inutilizar', 'int', ['string', 'string', 'int', 'int', 'int', 'int', 'int', ...this.ACBrTypeResponse]);
    const data = NFeMakeUnusable(options.document, options.justification, options.year, options.model, options.serie, options.initialNumber, options.finalNumber, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to send a batch of NFe to SEFAZ.
   *
   * @param {NFeSendData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  send(options: NFeSendData): IACBrLibNFeResponse {
    const NFeSend = this.ACBrLib.func('NFE_Enviar', 'int', ['int', 'bool', 'bool', 'bool', ...this.ACBrTypeResponse]);
    const data = NFeSend(options.batchNumber, options.isPrint, options.isSynchronous, options.isZipped, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to cancel an NFe at SEFAZ.
   *
   * @param {NFeCancelData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  cancel(options: NFeCancelData): IACBrLibNFeResponse {
    const NFeCancel = this.ACBrLib.func('NFE_Cancelar', 'int', ['string', 'string', 'string', 'int', ...this.ACBrTypeResponse]);
    const data = NFeCancel(options.NFeKey, options.justification, options.document, options.batchNumber, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to Send an Event to SEFAZ.
   *
   * @param {{batchNumber: number}} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  eventSend(options:{batchNumber: number}): IACBrLibNFeResponse {
    const NFeEventSend = this.ACBrLib.func('NFE_EnviarEvento', 'int', ['int', ...this.ACBrTypeResponse]);
    const data = NFeEventSend(options.batchNumber, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to Download documents from the National Environment through
   * the DistribuicaoDFe method informing the last NSU returned by the
   * previous execution.
   *
   * @param {DFeDistributionData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  DFeDistribution(options: DFeDistributionData): IACBrLibNFeResponse {
    const NFeDFeDistribution = this.ACBrLib.func('NFE_DistribuicaoDFe', 'int', ['int', 'string', 'string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeDFeDistribution(options.UFCode, options.document, options.NSU, options.fileOrContent, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to Download documents from the National Environment through the DistribuicaoDFe method informing 
   * the last NSU returned by the previous execution.
   *
   * @param {DFeDefaultData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  DFeDistributionLastNSU(options: DFeDefaultData): IACBrLibNFeResponse {
    const NFeDFeDistributionLastNSU = this.ACBrLib.func('NFE_DistribuicaoDFePorUltNSU', 'int', ['int', 'string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeDFeDistributionLastNSU(options.UFCode, options.document, options.NSU, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to Download the National Environment document through the 
   * DistribuicaoDFe method informing your NSU.
   *
   * @param {DFeDefaultData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  DFeDistributionNSU(options: DFeDefaultData): IACBrLibNFeResponse {
    const NFeDFeDistributionNSU = this.ACBrLib.func('NFE_DistribuicaoDFePorNSU', 'int', ['int', 'string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeDFeDistributionNSU(options.UFCode, options.document, options.NSU, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to Download the NFe from the National Environment through the 
   * DistribuicaoDFe method, informing your key.
   *
   * @param {DFeDistributionKeyData} options
   * @return {*} 
   * @memberof ACBrLibNFe
   */
  DFeDistributionKey(options: DFeDistributionKeyData) {
    const NFeDFeDistributionKey = this.ACBrLib.func('NFE_DistribuicaoDFePorChave', 'int', ['int', 'string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeDFeDistributionKey(options.UFCode, options.document, options.key, this.ACBrResponse, this.ACBrResponseLength);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to send email through the ACBrNFe component.
   *
   * @param {SendMailDefaultData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  sendMail(options: SendMailDefaultData): IACBrLibNFeResponse {
    const NFeSendMail = this.ACBrLib.func('NFE_EnviarEmail', 'int', ['string', 'string', 'bool', 'string', 'string', 'string', 'string']);
    const data = NFeSendMail(options.from, options.XMLPath, options.isSendPDF, options.subject, options.CC, options.attachments, options.message);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'E-mail enviado corretamente.'
    }
  }

  /**
   * Method used to send event by email through the ACBrNFe component.
   *
   * @param {SendMailEventMailData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  sendEventMail(options: SendMailEventMailData): IACBrLibNFeResponse {
    const NFeSendEventMail = this.ACBrLib.func('NFE_EnviarEmailEvento', 'int', ['string', 'string', 'string', 'bool', 'string', 'string', 'string', 'string']);
    const data = NFeSendEventMail(options.from, options.eventPath, options.XMLPath, options.isSendPDF, options.subject, options.CC, options.attachments, options.message);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'E-mail enviado corretamente.'
    }
  }

  /**
   * Method used to print the DANFe/DANFCe of the loaded NFes/NFCes.
   *
   * @param {PrintData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  print(options: PrintData): IACBrLibNFeResponse {
    const NFePrint = this.ACBrLib.func('NFE_Imprimir', 'int', ['string', 'int', 'string', 'string', 'string', 'string', 'string']);
    const data = NFePrint(options.printName, options.numberCopies, options.protocol, options.isShowPreview, options.pathWaterMark, options.isViaConsumer, options.isSimplified);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Impresso corretamente.'
    }
  }

  /**
   * Method used to generate the DANFe PDF of a loaded NFe.
   *
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  printPDF(): IACBrLibNFeResponse {
    const NFePrintPDF = this.ACBrLib.func('NFE_ImprimirPDF', 'int', []);
    const data = NFePrintPDF();

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'PDF Impresso corretamente.'
    }
  }

  /**
   * Method to return the DANFe pdf in Base64 format.
   *
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  savePDF(): IACBrLibNFeResponse {
    const NFeSavePDF = this.ACBrLib.func('NFE_SalvarPDF', 'int', this.ACBrTypeResponse);
    const data = NFeSavePDF();

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : this.ACBrResponse.toString()
    }
  }

  /**
   * Method used to print an event.
   *
   * @param {FileOrContentData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  eventPrint(options: FileOrContentData): IACBrLibNFeResponse {
    const NFeEventPrint = this.ACBrLib.func('NFE_ImprimirEvento', 'int', ['string', 'string']);
    const data = NFeEventPrint(options.fileOrContent, options.eventFileOrContent);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Evento impresso corretamente.'
    }
  }

  /**
   * Method used to generate the PDF of an event.
   *
   * @param {FileOrContentData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  eventPrintPDF(options: FileOrContentData): IACBrLibNFeResponse {
    const NFeEventPrintPDF = this.ACBrLib.func('NFE_ImprimirEventoPDF', 'int', ['string', 'string']);
    const data = NFeEventPrintPDF(options.fileOrContent, options.eventFileOrContent);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'PDF do evento impresso corretamente.'
    }
  }

  /**
   * Method used to save the PDF of an event in Base64 format.
   *
   * @param {FileOrContentData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  saveEventPDF(options: FileOrContentData): IACBrLibNFeResponse {
    const NFeSaveEventPDF = this.ACBrLib.func('NFE_SalvarEventoPDF', 'int', ['string', 'string']);
    const data = NFeSaveEventPDF(options.fileOrContent, options.eventFileOrContent);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'PDF do evento impresso corretamente.'
    }
  }

  /**
   * Method used to print the unusable number NFe.
   *
   * @param {UnusablePrintSaveData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  printUnusable(options: UnusablePrintSaveData): IACBrLibNFeResponse {
    const NFePrintUnusable = this.ACBrLib.func('NFE_ImprimirInutilizacao', 'int', ['string']);
    const data = NFePrintUnusable(options.pathXMLFile);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'Inutilização impressa corretamente.'
    }
  }

  /**
   * Method used to generate the PDF of the Unusable
   *
   * @param {UnusablePrintSaveData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  printUnusablePDF(options: UnusablePrintSaveData): IACBrLibNFeResponse {
    const NFePrintUnusablePDF = this.ACBrLib.func('NFE_ImprimirInutilizacaoPDF', 'int', ['string']);
    const data = NFePrintUnusablePDF(options.pathXMLFile);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'PDF da inutilização impresso corretamente.'
    }
  }

  /**
   * Method used to save the Unusable PDF in Base64 format.
   *
   * @param {UnusablePrintSaveData} options
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  saveUnusablePDF(options: UnusablePrintSaveData): IACBrLibNFeResponse {
    const NFeSaveUnusablePDF = this.ACBrLib.func('NFE_SalvarInutilizacaoPDF', 'int', ['string']);
    const data = NFeSaveUnusablePDF(options.pathXMLFile);

    return {
      ACBrCode: data,
      ACBrResponse: data !== 0 ? libError(data) : 'PDF da inutilização salvo corretamente.'
    }
  }
}
