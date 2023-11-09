export type IACBrLibNFeResponse = {
  ACBrCode: number;
  ACBrResponse: string | object;
}

export enum UFCodeEnum {
  AC = 12,
  AL = 27,
  AM = 13,
  AP = 16,
  BA = 29,
  CE = 23,
  DF = 53,
  ES = 32,
  GO = 52,
  MA = 21,
  MG = 31,
  MS = 50,
  MT = 51,
  PA = 15,
  PB = 25,
  PE = 26,
  PI = 22,
  PR = 41,
  RJ = 33,
  RN = 24,
  RO = 11,
  RR = 14,
  RS = 43,
  SC = 42,
  SE = 28,
  SP = 35,
  TO = 17,
}

export enum NFeModelEnum {
  NFe = 55,
  NFCe = 65,
}

export enum TypeEmissionEnum {
  teNormal = 1,
  teContingency = 2,
  teSCAN = 3,
  teDPEC = 4,
  teFSDA = 5,
  teSVCAN = 6,
  teSVCRS = 7,
  teSVCSP = 8,
  teOffLine = 9
}

export enum PathTypeEnum {
  NFe = 0,
  Unusable = 1,
  CCe = 2,
  Cancellation = 3
}

export type GenerateKeyData = {
  UFCode: UFCodeEnum;
  numericCode: number;
  model: NFeModelEnum;
  serie: number;
  numberNFe: number;
  typeEmission: TypeEmissionEnum;
  dateEmission: string;
  document: string;
}

export type GetPathData = {
  pathType: PathTypeEnum
}

export enum PrintDataBoolEnum {
  yes = 'True',
  no = 'False'
}

export type PrintData = {
  printName: string;
  numberCopies: number;
  protocol: string;
  isShowPreview: PrintDataBoolEnum;
  pathWaterMark: string;
  isViaConsumer: PrintDataBoolEnum;
  isSimplified: PrintDataBoolEnum;
}

export type ReadSaveImportConfigData = {
  fileConfigINI: string;
}

export type GetConfigItemValueData = {
  sessionINI: string;
  key: string
}

export type SaveConfigItemValueData = GetConfigItemValueData & {
  value: string;
}

export type FileOrContentData = {
  fileOrContent: string;
  eventFileOrContent: string;
}

export type NFePositionData = {
  position: number;
};

export type NFeSaveData = NFePositionData & {
  fileName: string;
  filhePath: string
}

export type NFeConsultData = {
  keyOrContent: string;
  isEventsExtract: boolean;
}

export type ConsultRegistrationData = {
  UF: string;
  document: string;
  isIECode: boolean;
}

export type MakeUnusableData = {
  CNPJ: string;
  justification: string;
  year: number;
  model: NFeModelEnum;
  serie: number;
  initialNumber: number;
  finalNumber: number;
}

export type UnusablePrintSaveData = {
  pathXMLFile: string;
}

export type NFeSendData = {
  batchNumber: number;
  isPrint: boolean;
  isSynchronous: boolean;
  isZipped: boolean;
}

export type NFeCancelData = {
  batchNumber: number;
  NFeKey: string;
  justification: string;
  CNPJ: string;
}

export type DFeDefaultData = {
  UFCode: UFCodeEnum;
  CNPJCPF: string;
  NSU: string;
}

export type DFeDistributionData = DFeDefaultData & Pick<FileOrContentData, 'fileOrContent'>;

export type DFeDistributionKeyData = Omit<DFeDefaultData, 'NSU'> & {
  key: string;
}

export type SendMailDefaultData = {
  from: string;
  subject: string;
  CC: string;
  attachments: string;
  message: string;
  isSendPDF: boolean;
  XMLPath: string;
}

export type SendMailEventMailData = SendMailDefaultData & {
  eventPath: string;
}

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