import koffi from 'koffi';

import { libError } from '@errors';
import { IACBrLibNFe } from '@interfaces';
import { ACBrLibNFeData, ConsultRegistrationData, DFeDefaultData, DFeDistributionData, DFeDistributionKeyData, FileOrContentData, GenerateKeyData, GetConfigItemValueData, GetPathData, IACBrLibNFeOptions, IACBrLibNFeResponse, MakeUnusableData, NFeCancelData, NFeConsultData, NFePositionData, NFeSaveData, NFeSendData, PrintData, ReadSaveImportConfigData, SaveConfigItemValueData, SendMailDefaultData, SendMailEventMailData, UnusablePrintSaveData } from '@types';

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
   * @param {ACBrLibNFeData} {ACBrLibPath, ACBrOptions}
   * @param ACBrLibPath - library path (dll) of the ACBrNFe component 
   * @param ACBrOptions.fileConfigINI - Location of the INI file, may be 
   * blank in this case ACBrLib will create a new INI file.
   * @param ACBrOptions.keyCrypt - Security key to encrypt confidential 
   * information, it can be blank in this case the default password will be used.
   * @memberof ACBrLibNFe
   */
  constructor({ACBrLibPath, ACBrOptions}: ACBrLibNFeData) {
    this.ACBrLib = koffi.load(ACBrLibPath); 
    this.ACBrOptions = ACBrOptions;
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

    return this.response(data, 'Biblioteca foi inicializada corretamente.');
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

    return this.response(data, 'Biblioteca foi finalizada corretamente.');
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

    return this.response(data);
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

    return this.response(data);
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

    return this.response(data);
  }

  /**
   * Method used to read the library configuration from the given INI file.
   *
   * @param {ReadSaveImportConfigData} {fileConfigINI} - INI file to read,
   * if entered empty the default value will be used.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  readConfig({fileConfigINI}: ReadSaveImportConfigData): IACBrLibNFeResponse {
    const NFeReadConfig = this.ACBrLib.func('NFE_ConfigLer', 'int', ['string']);
    const setFileConfigINI = fileConfigINI ?? this.ACBrOptions.fileConfigINI;
    const data = NFeReadConfig(setFileConfigINI);      

    return this.response(data, 'Configurações foram lidas corretamente.');
  }

  /**
   * Method used to write the library configuration to the specified INI file.
   *
   * @param {ReadSaveImportConfigData} {fileConfigINI} - INI file to read,
   * if entered empty the default value will be used.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  saveConfig({fileConfigINI}: ReadSaveImportConfigData): IACBrLibNFeResponse {
    const NFeSaveConfig = this.ACBrLib.func('NFE_ConfigGravar', 'int', ['string']);
    const setFileConfigINI = fileConfigINI ?? this.ACBrOptions.fileConfigINI;
    const data = NFeSaveConfig(setFileConfigINI);      

    return this.response(data, 'Configurações foram gravadas corretamente.');
  }

  /**
   * Method used to read a specific configuration item.
   *
   * @param {GetConfigItemValueData} {sessionINI, key}
   * @param sessionINI - Configuration session name.
   * @param key - Session key name.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  getConfigItemValue({sessionINI, key}: GetConfigItemValueData): IACBrLibNFeResponse {
    const NFeGetConfigValue = this.ACBrLib.func('NFE_ConfigLerValor', 'int', ['string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeGetConfigValue(sessionINI, key, this.ACBrResponse, this.ACBrResponseLength)

    return this.response(data);
  }

  /**
   * Method used to write a specific configuration item.
   *
   * @param {SaveConfigItemValueData} {sessionINI, key, value}
   * @param sessionINI - Configuration session name.
   * @param key - Session key name.
   * @param value - Value to be recorded in the configuration remembering that 
   * it must be a string value compatible with the configuration.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  saveConfigItemValue({sessionINI, key, value}: SaveConfigItemValueData): IACBrLibNFeResponse {
    const NFeSaveConfigValue = this.ACBrLib.func('NFE_ConfigGravarValor', 'int', ['string', 'string', 'string']);
    const data = NFeSaveConfigValue(sessionINI, key, value);

    return this.response(data, 'Configuração gravadas corretamente.');
  }

  /**
   * Method used to import the library configuration from the given INI file.
   *
   * @param {ReadSaveImportConfigData} {fileConfigINI}
   * @param fileConfigINI - INI file to read, if entered empty the default 
   * value will be used.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  importConfig({fileConfigINI}: ReadSaveImportConfigData): IACBrLibNFeResponse {
    const NFeImportConfig = this.ACBrLib.func('NFE_ConfigImportar', 'int', ['string']);
    const setFileConfigINI = fileConfigINI ?? this.ACBrOptions.fileConfigINI;
    const data = NFeImportConfig(setFileConfigINI)

    return this.response(data, 'Configuração importada corretamente.');
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

    return this.response(data);
  }

  /**
   * Method used to read the XML file for the ACBrNFe component.
   *
   * @param {Pick<FileOrContentData, 'fileOrContent'>} {fileOrContent}
   * @param fileOrContent - Path with the name of the XML file to be read or 
   * the content of the XML.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  loadXML({fileOrContent}: Pick<FileOrContentData, 'fileOrContent'>): IACBrLibNFeResponse {
    const NFeLoadXML = this.ACBrLib.func('NFE_CarregarXML', 'int', ['string']);
    const data = NFeLoadXML(fileOrContent);

    return this.response(data, 'Arquivo/Conteúdo XML carregado corretamente.');
  }

  /**
   * Method used to read the INI file for the ACBrNFe component.
   *
   * @param {Pick<FileOrContentData, 'fileOrContent'>} {fileOrContent}
   * @param fileOrContent - Path with the name of the INI file to be read or 
   * the contents of the INI.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  loadINI({fileOrContent}: Pick<FileOrContentData, 'fileOrContent'>): IACBrLibNFeResponse{
    const NFeLoadINI = this.ACBrLib.func('NFE_CarregarINI', 'int', ['string']);
    const data = NFeLoadINI(fileOrContent);

    return this.response(data, 'Arquivo/Conteúdo INI carregado corretamente.');
  }


  /**
   * Method to return the NFe xml.
   *
   * @param {NFePositionData} {position}
   * @param position - NFe position in the list, the list starts at 0.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  getXML({position}: NFePositionData): IACBrLibNFeResponse{
    const NFeGetXML = this.ACBrLib.func('NFE_ObterXml', 'int', ['int', ...this.ACBrTypeResponse]);
    const data = NFeGetXML(position, this.ACBrResponse, this.ACBrResponseLength);

    return this.response(data);
  }

  /**
   * Method to write the NFe xml.
   *
   * @param {NFeSaveData} {position, fileName, filhePath}
   * @param position - NFe position in the list, the list starts at 0.
   * @param fileName - Name of the XML file to be saved.
   * @param filhePath - Local onde será salvo o arquivo XML.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  saveXML({position, fileName, filhePath}: NFeSaveData): IACBrLibNFeResponse {
    const NFeSaveXML = this.ACBrLib.func('NFE_GravarXml', 'int', ['int', 'string', 'string']);
    const data = NFeSaveXML(position, fileName, filhePath);

    return this.response(data, 'Arquivo XML gravado corretamente.');
  }
  
  /**
   * Method to return the NFe xml in INI format.
   *
   * @param {NFePositionData} {position}
   * @param position - NFe position in the list, the list starts at 0.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  getINI({position}: NFePositionData): IACBrLibNFeResponse{
    const NFeGetINI = this.ACBrLib.func('NFE_ObterIni', 'int', ['int', ...this.ACBrTypeResponse]);
    const data = NFeGetINI(position, this.ACBrResponse, this.ACBrResponseLength);

    return this.response(data);
  }

  /**
   * Method to write the NFe xml in INI format.
   *
   * @param {NFeSaveData} {position, fileName, filhePath}
   * @param position - NFe position in the list, the list starts at 0.
   * @param fileName - Name of the INI file to be saved.
   * @param filhePath - Local onde será salvo o arquivo INI.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  saveINI({position, fileName, filhePath}: NFeSaveData): IACBrLibNFeResponse {
    const NFeSaveINI = this.ACBrLib.func('NFE_GravarIni', 'int', ['int', 'string', 'string']);
    const data = NFeSaveINI(position, fileName, filhePath);

    return this.response(data, 'Arquivo INI gravado corretamente.');
  }

  /**
   * Method used to read the XML file for the ACBrNFe component.
   *
   * @param {Pick<FileOrContentData, 'fileOrContent'>} {fileOrContent}
   * @param fileOrContent - Path with the name of the INI file to be read
   * or the contents of the INI.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  loadEventXML({fileOrContent}: Pick<FileOrContentData, 'fileOrContent'>): IACBrLibNFeResponse {
    const NFeLoadEventXML = this.ACBrLib.func('NFE_CarregarEventoXML', 'int', ['string']);
    const data = NFeLoadEventXML(fileOrContent);

    return this.response(data);
  }

  /**
   * Method used to read the INI file for the ACBrNFe component.
   *
   * @param {Pick<FileOrContentData, 'fileOrContent'>} {fileOrContent}
   * @param fileOrContent - Path with the name of the INI file to be read
   * or the contents of the INI.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  loadEventINI({fileOrContent}: Pick<FileOrContentData, 'fileOrContent'>): IACBrLibNFeResponse {
    const NFeLoadEventINI = this.ACBrLib.func('NFE_CarregarEventoINI', 'int', ['string']);
    const data = NFeLoadEventINI(fileOrContent);

    return this.response(data);
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

    return this.response(data);
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

    return this.response(data);
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

    return this.response(data);
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

    return this.response(data);
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

    return this.response(data);
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

    return this.response(data);
  }

  /**
   * Method used to generate a key to the fiscal document.
   *
   * @param {GenerateKeyData} {UFCode, numericCode, model, serie, numberNFe, typeEmission, dateEmission, document}
   * @param UFCode - UF code to generate the key.
   * @param numericCode - Numeric code of the invoice.
   * @param model - Document model 55 or 65.
   * @param serie - Invoice series.
   * @param numberNFe - Invoice number.
   * @param typeEmission - Type of Emission: 1 = teNormal, 2 = teContingencia, 
   * 3 = teSCAN, 4 = teDPEC, 5 = teFSDA, 6 = teSVCAN, 7 = teSVCRS, 
   * 8 = teSVCSP, 9 = teOffLine
   * @param dateEmission - 
   * @param document - 
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  generateKey({UFCode, numericCode, model, serie, numberNFe, typeEmission, dateEmission, document}: GenerateKeyData): IACBrLibNFeResponse {
    const NFeGenerateKey = this.ACBrLib.func('NFE_GerarChave', 'int', ['int', 'int', 'int', 'int', 'int', 'int', 'string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeGenerateKey(UFCode, numericCode, model, serie, numberNFe, typeEmission, dateEmission, document, this.ACBrResponse, this.ACBrResponseLength);

    return this.response(data);
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

    return this.response(data);
  }

  /**
   * Method used to return the path where the documents generated by the 
   * library will be saved.
   *
   * @param {GetPathData} {pathType}
   * @param pathType - Type of path that will be returned: 0 = NFe,
   * 1 = Inutilização, 2 = CCe, 3 = Cancelamento.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  getPath({pathType}: GetPathData): IACBrLibNFeResponse {
    const NFeGetPath = this.ACBrLib.func('NFE_GetPath', 'int', ['int', ...this.ACBrTypeResponse]);
    const data = NFeGetPath(pathType, this.ACBrResponse, this.ACBrResponseLength);

    return this.response(data);
  }

  /**
   * Method used to return the path where the events generated by the 
   * library will be saved.
   *
   * @param {{ eventCode: number }} {eventCode}
   * @param eventCode - The event code.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  getEventPath({eventCode}: { eventCode: number }): IACBrLibNFeResponse {
    const NFeGetEventPath = this.ACBrLib.func('NFE_GetPathEvento', 'int', ['int', ...this.ACBrTypeResponse]);
    const data = NFeGetEventPath(eventCode, this.ACBrResponse, this.ACBrResponseLength);

    return this.response(data);
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

    return this.response(data);
  }

  /**
   * Method used to consult an NFe at SEFAZ.
   *
   * @param {NFeConsultData} {keyOrContent, isEventsExtract}
   * @param keyOrContent - Path with the name of the XML file to be consulted 
   * or the content of the XML.
   * @param isEventsExtract - Inform whether or not to extract the events, 
   * if they exist in the response.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  consult({keyOrContent, isEventsExtract}: NFeConsultData): IACBrLibNFeResponse {
    const NFeConsult = this.ACBrLib.func('NFE_Consultar', 'int', ['string', 'bool', ...this.ACBrTypeResponse]);
    const data = NFeConsult(keyOrContent, isEventsExtract, this.ACBrResponse, this.ACBrResponseLength);

    return this.response(data);
  }

  /**
   * Method used to consult the shipping receipt at SEFAZ.
   *
   * @param {{receipt: string}} {receipt}
   * @param receipt - Receipt number for consultation.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  consultReceipt({receipt}: {receipt: string}): IACBrLibNFeResponse {
    const NFeConsultReceipt = this.ACBrLib.func('NFE_ConsultarRecibo', 'int', ['string',...this.ACBrTypeResponse]);
    const data = NFeConsultReceipt(receipt, this.ACBrResponse, this.ACBrResponseLength);

    return this.response(data);
  }

  /**
   * Method used to consult the SEFAZ registry.
   *
   * @param {ConsultRegistrationData} {UF, document, isIECode}
   * @param UF - Acronym of the state of the document to be consulted.
   * @param document - Number of the document to be consulted.
   * @param isIECode - If true, you will query the State Registration document, 
   * otherwise you will query the CPF or CNPJ.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  consultRegistration({UF, document, isIECode}: ConsultRegistrationData): IACBrLibNFeResponse {
    const NFeConsultRegistration = this.ACBrLib.func('NFE_ConsultaCadastro', 'int', ['string', 'string', 'bool', ...this.ACBrTypeResponse]);
    const data = NFeConsultRegistration(UF, document, isIECode, this.ACBrResponse, this.ACBrResponseLength);

    return this.response(data);
  }
  
  /**
   * Method used to make a number or range of numbers unusable in SEFAZ.
   *
   * @param {MakeUnusableData} {document, justification, year, model, serie, initialNumber, finalNumber}
   * @param document - CNPJ of the issuer.
   * @param justification - Reason for requesting Disablement.
   * @param year - Year.
   * @param model - Model must be entered 55 for NF-e or 65 for NFC-e.
   * @param serie - Tax Document Series.
   * @param initialNumber - Initial number you wish to unusable.
   * @param finalNumber - Final Number if you wish to unusable.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  makeUnusable({document, justification, year, model, serie, initialNumber, finalNumber}: MakeUnusableData): IACBrLibNFeResponse {
    const NFeMakeUnusable = this.ACBrLib.func('NFE_Inutilizar', 'int', ['string', 'string', 'int', 'int', 'int', 'int', 'int', ...this.ACBrTypeResponse]);
    const data = NFeMakeUnusable(document, justification, year, model, serie, initialNumber, finalNumber, this.ACBrResponse, this.ACBrResponseLength);

    return this.response(data);
  }

  /**
   * Method used to send a batch of NFe to SEFAZ.
   *
   * @param {NFeSendData} {batchNumber, isPrint, isSynchronous, isZipped}
   * @param batchNumber - Batch number of the cancellation event.
   * @param isPrint - If True prints the DANFe if the NF-e is authorized.
   * @param isSynchronous - If True prints it sends it in synchronous mode.
   * @param isZipped - If True prints and sends the zipped file.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  send({batchNumber, isPrint, isSynchronous, isZipped}: NFeSendData): IACBrLibNFeResponse {
    const NFeSend = this.ACBrLib.func('NFE_Enviar', 'int', ['int', 'bool', 'bool', 'bool', ...this.ACBrTypeResponse]);
    const data = NFeSend(batchNumber, isPrint, isSynchronous, isZipped, this.ACBrResponse, this.ACBrResponseLength);

    return this.response(data);
  }

  /**
   * Method used to cancel an NFe at SEFAZ.
   *
   * @param {NFeCancelData} {NFeKey, justification, document, batchNumber}
   * @param NFeKey - XML access key to be canceled.
   * @param justification - Reason for cancellation.
   * @param document - CNPJ of the issuer.
   * @param batchNumber - Batch number of the cancellation event.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  cancel({NFeKey, justification, document, batchNumber}: NFeCancelData): IACBrLibNFeResponse {
    const NFeCancel = this.ACBrLib.func('NFE_Cancelar', 'int', ['string', 'string', 'string', 'int', ...this.ACBrTypeResponse]);
    const data = NFeCancel(NFeKey, justification, document, batchNumber, this.ACBrResponse, this.ACBrResponseLength);

    return this.response(data);
  }

  /**
   * Method used to Send an Event to SEFAZ.
   *
   * @param {{batchNumber: number}} {batchNumber}
   * @param batchNumber - Lot number of the event.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  eventSend({batchNumber}: {batchNumber: number}): IACBrLibNFeResponse {
    const NFeEventSend = this.ACBrLib.func('NFE_EnviarEvento', 'int', ['int', ...this.ACBrTypeResponse]);
    const data = NFeEventSend(batchNumber, this.ACBrResponse, this.ACBrResponseLength);

    return this.response(data);
  }

  /**
   * Method used to Download documents from the National Environment through
   * the DistribuicaoDFe method informing the last NSU returned by the
   * previous execution.
   *
   * @param {DFeDistributionData} {UFCode, document, NSU, fileOrContent}
   * @param UFCode - UF code of the query author.
   * @param document - CNPJ/CPF of the author of the query.
   * @param NSU - NSU number of the document.
   * @param fileOrContent - Path with the name of the XML file to be read or 
   * the content of the XML.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  DFeDistribution({UFCode, document, NSU, fileOrContent}: DFeDistributionData): IACBrLibNFeResponse {
    const NFeDFeDistribution = this.ACBrLib.func('NFE_DistribuicaoDFe', 'int', ['int', 'string', 'string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeDFeDistribution(UFCode, document, NSU, fileOrContent, this.ACBrResponse, this.ACBrResponseLength);

    return this.response(data);
  }

  /**
   * Method used to Download documents from the National Environment through the DistribuicaoDFe method informing 
   * the last NSU returned by the previous execution.
   *
   * @param {DFeDefaultData} {UFCode, document, NSU}
   * @param UFCode - UF code of the query author.
   * @param document - CNPJ/CPF of the author of the query.
   * @param NSU - NSU number of the document.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  DFeDistributionLastNSU({UFCode, document, NSU}: DFeDefaultData): IACBrLibNFeResponse {
    const NFeDFeDistributionLastNSU = this.ACBrLib.func('NFE_DistribuicaoDFePorUltNSU', 'int', ['int', 'string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeDFeDistributionLastNSU(UFCode, document, NSU, this.ACBrResponse, this.ACBrResponseLength);

    return this.response(data);
  }


  /**
   * Method used to Download the National Environment document through the 
   * DistribuicaoDFe method informing your NSU.
   *
   * @param {DFeDefaultData} {UFCode, document, NSU}
   * @param UFCode - UF code of the query author.
   * @param document - CNPJ/CPF of the author of the query.
   * @param NSU - NSU number of the document.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  DFeDistributionNSU({UFCode, document, NSU}: DFeDefaultData): IACBrLibNFeResponse {
    const NFeDFeDistributionNSU = this.ACBrLib.func('NFE_DistribuicaoDFePorNSU', 'int', ['int', 'string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeDFeDistributionNSU(UFCode, document, NSU, this.ACBrResponse, this.ACBrResponseLength);

    return this.response(data);
  }

  /**
   * Method used to Download the NFe from the National Environment through the 
   * DistribuicaoDFe method, informing your key.
   *
   * @param {DFeDistributionKeyData} {UFCode, document, key}
   * @param UFCode - UF code of the query author.
   * @param document - CNPJ/CPF of the author of the query.
   * @param key - NFe key.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  DFeDistributionKey({UFCode, document, key}: DFeDistributionKeyData): IACBrLibNFeResponse {
    const NFeDFeDistributionKey = this.ACBrLib.func('NFE_DistribuicaoDFePorChave', 'int', ['int', 'string', 'string', ...this.ACBrTypeResponse]);
    const data = NFeDFeDistributionKey(UFCode, document, key, this.ACBrResponse, this.ACBrResponseLength);

    return this.response(data);
  }

  /**
   * Method used to send email through the ACBrNFe component.
   *
   * @param {SendMailEventMailData} {from, XMLPath, isSendPDF, subject, CC, attachments, message}
   * @param from - Recipient.
   * @param XMLPath - Path with the name of the NFe XML file to be 
   * attached to the email.
   * @param isSendPDF - If True generates the DANFe PDF and 
   * attaches it to the email.
   * @param subject - Text containing the subject of the email.
   * @param CC - addresses separated by semicolons that will receive a 
   * copy of the email.
   * @param attachments - Path with the name of files separated by semicolons 
   * to be attached to the email.
   * @param message - Text referring to the email message.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  sendMail({from, XMLPath, isSendPDF, subject, CC, attachments, message}: SendMailDefaultData): IACBrLibNFeResponse {
    const NFeSendMail = this.ACBrLib.func('NFE_EnviarEmail', 'int', ['string', 'string', 'bool', 'string', 'string', 'string', 'string']);
    const data = NFeSendMail(from, XMLPath, isSendPDF, subject, CC, attachments, message);

    return this.response(data, 'E-mail enviado corretamente.');
  }

  /**
   * Method used to send event by email through the ACBrNFe component.
   *
   * @param {SendMailEventMailData} {from, eventPath, XMLPath, isSendPDF, subject, CC, attachments, message}
   * @param from - Recipient.
   * @param eventPath - Path with the name of the Event XML file to be 
   * attached to the email.
   * @param XMLPath - Path with the name of the NFe XML file to be 
   * attached to the email.
   * @param isSendPDF - If True generates the DANFe PDF and 
   * attaches it to the email.
   * @param subject - Text containing the subject of the email.
   * @param CC - addresses separated by semicolons that will receive a 
   * copy of the email.
   * @param attachments - Path with the name of files separated by semicolons 
   * to be attached to the email.
   * @param message - Text referring to the email message.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  sendEventMail({from, eventPath, XMLPath, isSendPDF, subject, CC, attachments, message}: SendMailEventMailData): IACBrLibNFeResponse {
    const NFeSendEventMail = this.ACBrLib.func('NFE_EnviarEmailEvento', 'int', ['string', 'string', 'string', 'bool', 'string', 'string', 'string', 'string']);
    const data = NFeSendEventMail(from, eventPath, XMLPath, isSendPDF, subject, CC, attachments, message);

    return this.response(data, 'E-mail do evento enviado corretamente.');
  }

  /**
   * Method used to print the DANFe/DANFCe of the loaded NFes/NFCes.
   *
   * @param {PrintData} {printName, numberCopies, protocol, isShowPreview, pathWaterMark, isViaConsumer, isSimplified}
   * @param printName - Name of the printer where the document will be printed, 
   * if not entered, the printer entered in the settings will be used.
   * @param numberCopies - Number of copies to be printed, enter zero to use 
   * the value entered in the settings.
   * @param protocol - NFe protocol number.
   * @param isShowPreview - If entered "yes" will display the preview, 
   * if "no" does not want to show it or empty to use the 
   * configuration values.
   * @param pathWaterMark - Defines the path of the image that will be used 
   * as a watermark when printing DANFe, otherwise the 
   * configuration value will be used.
   * @param isViaConsumer - If entered "yes" prints the consumer's copy,
   * if "no" otherwise shows or empty to use the configuration values,
   * valid only for NFCe.
   * @param isViaConsumer - If "yes" is entered, it prints the DANFCe in 
   * a simplified way, if "no" otherwise it is displayed or empty to use 
   * the configuration values, valid only for NFCe.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  print({printName, numberCopies, protocol, isShowPreview, pathWaterMark, isViaConsumer, isSimplified}: PrintData): IACBrLibNFeResponse {
    const NFePrint = this.ACBrLib.func('NFE_Imprimir', 'int', ['string', 'int', 'string', 'string', 'string', 'string', 'string']);
    const data = NFePrint(printName, numberCopies, protocol, isShowPreview, pathWaterMark, isViaConsumer, isSimplified);

    return this.response(data, 'Impresso corretamente.');
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

    return this.response(data, 'PDF Impresso corretamente.');
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

    return this.response(data);
  }

  /**
   * Method used to print an event.
   *
   * @param {FileOrContentData} {fileOrContent, eventFileOrContent}
   * @param fileOrContent - Path of the NFe XML file for Base64 format.
   * @param eventFileOrContent - Path of the event XML file to Base64 format.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  eventPrint({fileOrContent, eventFileOrContent}: FileOrContentData): IACBrLibNFeResponse {
    const NFeEventPrint = this.ACBrLib.func('NFE_ImprimirEvento', 'int', ['string', 'string']);
    const data = NFeEventPrint(fileOrContent, eventFileOrContent);

    return this.response(data, 'Evento impresso corretamente.');
  }

  /**
   * Method used to generate the PDF of an event.
   *
   * @param {FileOrContentData} {fileOrContent, eventFileOrContent}
   * @param fileOrContent - Path of the NFe XML file for Base64 format.
   * @param eventFileOrContent - Path of the event XML file to Base64 format.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  eventPrintPDF({fileOrContent, eventFileOrContent}: FileOrContentData): IACBrLibNFeResponse {
    const NFeEventPrintPDF = this.ACBrLib.func('NFE_ImprimirEventoPDF', 'int', ['string', 'string']);
    const data = NFeEventPrintPDF(fileOrContent, eventFileOrContent);

    return this.response(data, 'PDF do evento impresso corretamente.');
  }

  /**
   * Method used to save the PDF of an event in Base64 format.
   *
   * @param {FileOrContentData} {fileOrContent, eventFileOrContent}
   * @param fileOrContent - Path of the NFe XML file for Base64 format.
   * @param eventFileOrContent - Path of the event XML file to Base64 format.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  saveEventPDF({fileOrContent, eventFileOrContent}: FileOrContentData): IACBrLibNFeResponse {
    const NFeSaveEventPDF = this.ACBrLib.func('NFE_SalvarEventoPDF', 'int', ['string', 'string']);
    const data = NFeSaveEventPDF(fileOrContent, eventFileOrContent);

    return this.response(data, 'PDF do evento foi salvo corretamente.');
  }

  /**
   * Method used to print the unusable number NFe.
   *
   * @param {UnusablePrintSaveData} {pathXMLFile}
   * @param pathXMLFile - Path of the unusable XML file for Base64 format.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  printUnusable({pathXMLFile}: UnusablePrintSaveData): IACBrLibNFeResponse {
    const NFePrintUnusable = this.ACBrLib.func('NFE_ImprimirInutilizacao', 'int', ['string']);
    const data = NFePrintUnusable(pathXMLFile);
    
    return this.response(data, 'Inutilização foi impressa corretamente.');
  }

  /**
   * Method used to generate the PDF of the Unusable
   * 
   * @param {UnusablePrintSaveData} {pathXMLFile}
   * @param pathXMLFile - Path of the unusable XML file for Base64 format.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  printUnusablePDF({pathXMLFile}: UnusablePrintSaveData): IACBrLibNFeResponse {
    const NFePrintUnusablePDF = this.ACBrLib.func('NFE_ImprimirInutilizacaoPDF', 'int', ['string']);
    const data = NFePrintUnusablePDF(pathXMLFile);

    return this.response(data, 'PDF da inutilização foi impresso corretamente');
  }

  /**
   * Method used to save the Unusable PDF in Base64 format.
   *
   * @param {UnusablePrintSaveData} {pathXMLFile}
   * @param pathXMLFile - Path of the unusable XML file for Base64 format.
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  saveUnusablePDF({pathXMLFile}: UnusablePrintSaveData): IACBrLibNFeResponse {
    const NFeSaveUnusablePDF = this.ACBrLib.func('NFE_SalvarInutilizacaoPDF', 'int', ['string']);
    const data = NFeSaveUnusablePDF(pathXMLFile);

    return this.response(data, 'PDF da inutilização foi salvo corretamente.');
  }


  /**
   * Private method to get data and make a responses
   *
   * @private
   * @param {*} data
   * @param {string} [message]
   * @return {*}  {IACBrLibNFeResponse}
   * @memberof ACBrLibNFe
   */
  private response(data: any, message?: string): IACBrLibNFeResponse {
    let ACBrResponse= message ?? ''; 

    if(message) {
      ACBrResponse = this.ACBrResponse.toString()
    }
    
    if(data !== 0) {
      ACBrResponse = libError(data);
    }
    
    return {
      ACBrCode: data,
      ACBrResponse
    }
  }
}
