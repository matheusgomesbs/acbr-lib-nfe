import { ConsultRegistrationData, DFeDefaultData, DFeDistributionData, DFeDistributionKeyData, FileOrContentData, GenerateKeyData, GetConfigItemValueData, GetPathData, IACBrLibNFeResponse, MakeUnusableData, NFeCancelData, NFeConsultData, NFePositionData, NFeSaveData, NFeSendData, PrintData, ReadSaveImportConfigData, SaveConfigItemValueData, SendMailDefaultData, SendMailEventMailData, UnusablePrintSaveData } from "@types";

export interface IACBrLibNFe {
  // Lib
  initialize(): IACBrLibNFeResponse;
  finish(): IACBrLibNFeResponse;
  getLastResponse(): IACBrLibNFeResponse;
  getLibName(): IACBrLibNFeResponse;
  getLibVersion(): IACBrLibNFeResponse;

  // Configuration
  readConfig(options: ReadSaveImportConfigData): IACBrLibNFeResponse;
  saveConfig(options: ReadSaveImportConfigData): IACBrLibNFeResponse;
  getConfigItemValue(options: GetConfigItemValueData): IACBrLibNFeResponse;
  saveConfigItemValue(options: SaveConfigItemValueData): IACBrLibNFeResponse;
  importConfig(options: ReadSaveImportConfigData): IACBrLibNFeResponse;
  exportConfig(): IACBrLibNFeResponse;

  // NFe
  loadXML(options: Pick<FileOrContentData, 'fileOrContent'>): IACBrLibNFeResponse;
  loadINI(options: Pick<FileOrContentData, 'fileOrContent'>): IACBrLibNFeResponse;
  getXML(options: NFePositionData): IACBrLibNFeResponse;
  saveXML(options: NFeSaveData): IACBrLibNFeResponse;
  getINI(options: NFePositionData): IACBrLibNFeResponse;
  saveINI(options: NFeSaveData): IACBrLibNFeResponse;
  loadEventXML(options: Pick<FileOrContentData, 'fileOrContent'>): IACBrLibNFeResponse;
  loadEventINI(options: Pick<FileOrContentData, 'fileOrContent'>): IACBrLibNFeResponse;
  clearList(): IACBrLibNFeResponse;
  clearEventList(): IACBrLibNFeResponse;
  sign(): IACBrLibNFeResponse;
  validate(): IACBrLibNFeResponse;
  validateBusinessRules(): IACBrLibNFeResponse;
  verifySignature(): IACBrLibNFeResponse;
  generateKey(options: GenerateKeyData): IACBrLibNFeResponse;
  getCertificates(): IACBrLibNFeResponse;
  getPath(options: GetPathData): IACBrLibNFeResponse;
  getEventPath(options: {eventCode: number}): IACBrLibNFeResponse;
  checkServiceStatus(): IACBrLibNFeResponse;
  consult(options: NFeConsultData): IACBrLibNFeResponse;
  consultReceipt(options: {receipt: string}): IACBrLibNFeResponse;
  consultRegistration(options: ConsultRegistrationData): IACBrLibNFeResponse;
  makeUnusable(options: MakeUnusableData): IACBrLibNFeResponse;
  send(options: NFeSendData): IACBrLibNFeResponse;
  cancel(options: NFeCancelData): IACBrLibNFeResponse;
  eventSend(options:{batchNumber: number}): IACBrLibNFeResponse;
  DFeDistribution(options: DFeDistributionData): IACBrLibNFeResponse;
  DFeDistributionLastNSU(options: DFeDefaultData): IACBrLibNFeResponse;
  DFeDistributionNSU(options: DFeDefaultData): IACBrLibNFeResponse;
  DFeDistributionKey(options: DFeDistributionKeyData): IACBrLibNFeResponse;
  sendMail(options: SendMailDefaultData): IACBrLibNFeResponse;
  sendEventMail(options: SendMailEventMailData): IACBrLibNFeResponse;
  print(options: PrintData): IACBrLibNFeResponse;
  printPDF(): IACBrLibNFeResponse;
  savePDF(): IACBrLibNFeResponse;
  eventPrint(options: FileOrContentData): IACBrLibNFeResponse;
  eventPrintPDF(options: FileOrContentData): IACBrLibNFeResponse;
  saveEventPDF(options: FileOrContentData): IACBrLibNFeResponse;
  printUnusable(options: UnusablePrintSaveData): IACBrLibNFeResponse;
  printUnusablePDF(options: UnusablePrintSaveData): IACBrLibNFeResponse;
  saveUnusablePDF(options: UnusablePrintSaveData): IACBrLibNFeResponse;
}