import { NFeModelEnum, PathTypeEnum, PrintDataBoolEnum, TypeEmissionEnum, UFCodeEnum, UFInitialsEnum } from "@enums";

export type ACBrLibNFeData = {
  ACBrLibPath: string;
  ACBrOptions: IACBrLibNFeOptions;
}

export interface IACBrLibNFeOptions{
  fileConfigINI: string;
  keyCrypt?: string;
}

export type IACBrLibNFeResponse = {
  ACBrCode: number;
  ACBrResponse: string | object;
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
  fileConfigINI?: string;
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
}

export type NFeSaveData = NFePositionData & {
  fileName: string;
  filhePath: string
}

export type NFeConsultData = {
  keyOrContent: string;
  isEventsExtract: boolean;
}

export type ConsultRegistrationData = {
  UF: UFInitialsEnum;
  document: string;
  isIECode: boolean;
}

export type MakeUnusableData = {
  document: string;
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
  document: string;
}

export type DFeDefaultData = {
  UFCode: UFCodeEnum;
  document: string;
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
