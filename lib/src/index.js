"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACBrLibNFe = void 0;
const koffi_1 = __importDefault(require("koffi"));
const _errors_1 = require("@errors");
const BUFFER_LENGTH = 1024 * 6;
class ACBrLibNFe {
    constructor(options) {
        this.ACBrResponse = Buffer.alloc(BUFFER_LENGTH);
        this.ACBrResponseLength = [BUFFER_LENGTH];
        this.ACBrTypeResponse = ['_Out_ str *ACBrResponse', '_Inout_ int *ACBrResponseLength'];
        this.ACBrLib = koffi_1.default.load(options.ACBrLibPath);
        this.ACBrOptions = options.ACBrOptions;
    }
    initialize() {
        const NFeInit = this.ACBrLib.func('NFE_Inicializar', 'int', ['string', 'string']);
        const { fileConfigINI, keyCrypt } = this.ACBrOptions;
        const data = NFeInit(fileConfigINI, keyCrypt);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Biblioteca foi inicializada corretamente.'
        };
    }
    finish() {
        const NFeFinish = this.ACBrLib.func('NFE_Finalizar', 'int', []);
        const data = NFeFinish();
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Biblioteca foi finalizada corretamente.'
        };
    }
    getLastResponse() {
        const NFeLastResponse = this.ACBrLib.func('NFE_UltimoRetorno', 'int', this.ACBrTypeResponse);
        const data = NFeLastResponse(this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    getLibName() {
        const NFeName = this.ACBrLib.func('NFE_Nome', 'int', this.ACBrTypeResponse);
        const data = NFeName(this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    getLibVersion() {
        const NFeVersion = this.ACBrLib.func('NFE_Versao', 'int', this.ACBrTypeResponse);
        const data = NFeVersion(this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    readConfig(options) {
        const NFeReadConfig = this.ACBrLib.func('NFE_ConfigLer', 'int', ['string']);
        const fileConfigINI = options?.fileConfigINI ?? this.ACBrOptions.fileConfigINI;
        const data = NFeReadConfig(fileConfigINI);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Configurações foram lidas corretamente.'
        };
    }
    saveConfig(options) {
        const NFeSaveConfig = this.ACBrLib.func('NFE_ConfigGravar', 'int', ['string']);
        const fileConfigINI = options?.fileConfigINI ?? this.ACBrOptions.fileConfigINI;
        const data = NFeSaveConfig(fileConfigINI);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Configurações foram gravadas corretamente.'
        };
    }
    getConfigItemValue(options) {
        const NFeGetConfigValue = this.ACBrLib.func('NFE_ConfigLerValor', 'int', ['string', 'string', ...this.ACBrTypeResponse]);
        const data = NFeGetConfigValue(options.sessionINI, options.key, this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    saveConfigItemValue(options) {
        const NFeSaveConfigValue = this.ACBrLib.func('NFE_ConfigGravarValor', 'int', ['string', 'string', 'string']);
        const data = NFeSaveConfigValue(options.sessionINI, options.key, options.value);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Configuração gravadas corretamente.'
        };
    }
    importConfig(options) {
        const NFeImportConfig = this.ACBrLib.func('NFE_ConfigImportar', 'int', ['string']);
        const fileConfigINI = options?.fileConfigINI ?? this.ACBrOptions.fileConfigINI;
        const data = NFeImportConfig(fileConfigINI);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Configuração importada corretamente.'
        };
    }
    exportConfig() {
        const NFeExportConfig = this.ACBrLib.func('NFE_ConfigExportar', 'int', this.ACBrTypeResponse);
        const data = NFeExportConfig(this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    loadXML(options) {
        const NFeLoadXML = this.ACBrLib.func('NFE_CarregarXML', 'int', ['string']);
        const data = NFeLoadXML(options.fileOrContent);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Arquivo/Conteúdo XML carregado corretamente.'
        };
    }
    loadINI(options) {
        const NFeLoadINI = this.ACBrLib.func('NFE_CarregarINI', 'int', ['string']);
        const data = NFeLoadINI(options.fileOrContent);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Arquivo/Conteúdo INI carregado corretamente.'
        };
    }
    getXML(options) {
        const NFeGetXML = this.ACBrLib.func('NFE_ObterXml', 'int', ['int', ...this.ACBrTypeResponse]);
        const data = NFeGetXML(options.position, this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    saveXML(options) {
        const NFeSaveXML = this.ACBrLib.func('NFE_GravarXml', 'int', ['int', 'string', 'string']);
        const data = NFeSaveXML(options.position, options.fileName, options.filhePath);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Arquivo XML gravado corretamente.'
        };
    }
    getINI(options) {
        const NFeGetINI = this.ACBrLib.func('NFE_ObterIni', 'int', ['int', ...this.ACBrTypeResponse]);
        const data = NFeGetINI(options.position, this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    saveINI(options) {
        const NFeSaveINI = this.ACBrLib.func('NFE_GravarIni', 'int', ['int', 'string', 'string']);
        const data = NFeSaveINI(options.position, options.fileName, options.filhePath);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Arquivo INI gravado corretamente.'
        };
    }
    loadEventXML(options) {
        const NFeLoadEventXML = this.ACBrLib.func('NFE_CarregarEventoXML', 'int', ['string']);
        const data = NFeLoadEventXML(options.fileOrContent);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Arquivo/Conteúdo XML de evento carregado corretamente.'
        };
    }
    loadEventINI(options) {
        const NFeLoadEventINI = this.ACBrLib.func('NFE_CarregarEventoINI', 'int', ['string']);
        const data = NFeLoadEventINI(options.fileOrContent);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Arquivo/Conteúdo INI de evento carregado corretamente.'
        };
    }
    clearList() {
        const NFeClearList = this.ACBrLib.func('NFE_LimparLista', 'int', []);
        const data = NFeClearList();
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Lista de notas foi limpo corretamente.'
        };
    }
    clearEventList() {
        const NFeClearEventList = this.ACBrLib.func('NFE_LimparListaEventos', 'int', []);
        const data = NFeClearEventList();
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Lista de eventos foi limpo corretamente.'
        };
    }
    sign() {
        const NFeSign = this.ACBrLib.func('NFE_Assinar', 'int', []);
        const data = NFeSign();
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Notas carregadas assinadas corretamente.'
        };
    }
    validate() {
        const NFeValidate = this.ACBrLib.func('NFE_Validar', 'int', []);
        const data = NFeValidate();
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Notas carregadas validadas corretamente.'
        };
    }
    validateBusinessRules() {
        const NFeValidateBusinessRules = this.ACBrLib.func('NFE_ValidarRegrasdeNegocios', 'int', this.ACBrTypeResponse);
        const data = NFeValidateBusinessRules(this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    verifySignature() {
        const NFeVerifySignature = this.ACBrLib.func('NFE_VerificarAssinatura', 'int', this.ACBrTypeResponse);
        const data = NFeVerifySignature(this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    generateKey(options) {
        const NFeGenerateKey = this.ACBrLib.func('NFE_GerarChave', 'int', ['int', 'int', 'int', 'int', 'int', 'int', 'string', 'string', ...this.ACBrTypeResponse]);
        const data = NFeGenerateKey(options.UFCode, options.numericCode, options.model, options.serie, options.numberNFe, options.typeEmission, options.dateEmission, options.document, this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    getCertificates() {
        const NFeGetCertificates = this.ACBrLib.func('NFE_ObterCertificados', 'int', this.ACBrTypeResponse);
        const data = NFeGetCertificates(this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    getPath(options) {
        const NFeGetPath = this.ACBrLib.func('NFE_GetPath', 'int', ['int', ...this.ACBrTypeResponse]);
        const data = NFeGetPath(options.pathType, this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    getEventPath(options) {
        const NFeGetEventPath = this.ACBrLib.func('NFE_GetPathEvento', 'int', ['int', ...this.ACBrTypeResponse]);
        const data = NFeGetEventPath(options.eventCode, this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    checkServiceStatus() {
        const NFeCheckServiceStatus = this.ACBrLib.func('NFE_StatusServico', 'int', this.ACBrTypeResponse);
        const data = NFeCheckServiceStatus(this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    consult(options) {
        const NFeConsult = this.ACBrLib.func('NFE_Consultar', 'int', ['string', 'bool', ...this.ACBrTypeResponse]);
        const data = NFeConsult(options.keyOrContent, options.isEventsExtract, this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    consultReceipt(options) {
        const NFeConsultReceipt = this.ACBrLib.func('NFE_ConsultarRecibo', 'int', ['string', ...this.ACBrTypeResponse]);
        const data = NFeConsultReceipt(options.receipt, this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    consultRegistration(options) {
        const NFeConsultRegistration = this.ACBrLib.func('NFE_ConsultaCadastro', 'int', ['string', 'string', 'bool', ...this.ACBrTypeResponse]);
        const data = NFeConsultRegistration(options.UF, options.document, options.isIECode, this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    makeUnusable(options) {
        const NFeMakeUnusable = this.ACBrLib.func('NFE_Inutilizar', 'int', ['string', 'string', 'int', 'int', 'int', 'int', 'int', ...this.ACBrTypeResponse]);
        const data = NFeMakeUnusable(options.document, options.justification, options.year, options.model, options.serie, options.initialNumber, options.finalNumber, this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    send(options) {
        const NFeSend = this.ACBrLib.func('NFE_Enviar', 'int', ['int', 'bool', 'bool', 'bool', ...this.ACBrTypeResponse]);
        const data = NFeSend(options.batchNumber, options.isPrint, options.isSynchronous, options.isZipped, this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    cancel(options) {
        const NFeCancel = this.ACBrLib.func('NFE_Cancelar', 'int', ['string', 'string', 'string', 'int', ...this.ACBrTypeResponse]);
        const data = NFeCancel(options.NFeKey, options.justification, options.document, options.batchNumber, this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    eventSend(options) {
        const NFeEventSend = this.ACBrLib.func('NFE_EnviarEvento', 'int', ['int', ...this.ACBrTypeResponse]);
        const data = NFeEventSend(options.batchNumber, this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    DFeDistribution(options) {
        const NFeDFeDistribution = this.ACBrLib.func('NFE_DistribuicaoDFe', 'int', ['int', 'string', 'string', 'string', ...this.ACBrTypeResponse]);
        const data = NFeDFeDistribution(options.UFCode, options.document, options.NSU, options.fileOrContent, this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    DFeDistributionLastNSU(options) {
        const NFeDFeDistributionLastNSU = this.ACBrLib.func('NFE_DistribuicaoDFePorUltNSU', 'int', ['int', 'string', 'string', ...this.ACBrTypeResponse]);
        const data = NFeDFeDistributionLastNSU(options.UFCode, options.document, options.NSU, this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    DFeDistributionNSU(options) {
        const NFeDFeDistributionNSU = this.ACBrLib.func('NFE_DistribuicaoDFePorNSU', 'int', ['int', 'string', 'string', ...this.ACBrTypeResponse]);
        const data = NFeDFeDistributionNSU(options.UFCode, options.document, options.NSU, this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    DFeDistributionKey(options) {
        const NFeDFeDistributionKey = this.ACBrLib.func('NFE_DistribuicaoDFePorChave', 'int', ['int', 'string', 'string', ...this.ACBrTypeResponse]);
        const data = NFeDFeDistributionKey(options.UFCode, options.document, options.key, this.ACBrResponse, this.ACBrResponseLength);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    sendMail(options) {
        const NFeSendMail = this.ACBrLib.func('NFE_EnviarEmail', 'int', ['string', 'string', 'bool', 'string', 'string', 'string', 'string']);
        const data = NFeSendMail(options.from, options.XMLPath, options.isSendPDF, options.subject, options.CC, options.attachments, options.message);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'E-mail enviado corretamente.'
        };
    }
    sendEventMail(options) {
        const NFeSendEventMail = this.ACBrLib.func('NFE_EnviarEmailEvento', 'int', ['string', 'string', 'string', 'bool', 'string', 'string', 'string', 'string']);
        const data = NFeSendEventMail(options.from, options.eventPath, options.XMLPath, options.isSendPDF, options.subject, options.CC, options.attachments, options.message);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'E-mail enviado corretamente.'
        };
    }
    print(options) {
        const NFePrint = this.ACBrLib.func('NFE_Imprimir', 'int', ['string', 'int', 'string', 'string', 'string', 'string', 'string']);
        const data = NFePrint(options.printName, options.numberCopies, options.protocol, options.isShowPreview, options.pathWaterMark, options.isViaConsumer, options.isSimplified);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Impresso corretamente.'
        };
    }
    printPDF() {
        const NFePrintPDF = this.ACBrLib.func('NFE_ImprimirPDF', 'int', []);
        const data = NFePrintPDF();
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'PDF Impresso corretamente.'
        };
    }
    savePDF() {
        const NFeSavePDF = this.ACBrLib.func('NFE_SalvarPDF', 'int', this.ACBrTypeResponse);
        const data = NFeSavePDF();
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : this.ACBrResponse.toString()
        };
    }
    eventPrint(options) {
        const NFeEventPrint = this.ACBrLib.func('NFE_ImprimirEvento', 'int', ['string', 'string']);
        const data = NFeEventPrint(options.fileOrContent, options.eventFileOrContent);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Evento impresso corretamente.'
        };
    }
    eventPrintPDF(options) {
        const NFeEventPrintPDF = this.ACBrLib.func('NFE_ImprimirEventoPDF', 'int', ['string', 'string']);
        const data = NFeEventPrintPDF(options.fileOrContent, options.eventFileOrContent);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'PDF do evento impresso corretamente.'
        };
    }
    saveEventPDF(options) {
        const NFeSaveEventPDF = this.ACBrLib.func('NFE_SalvarEventoPDF', 'int', ['string', 'string']);
        const data = NFeSaveEventPDF(options.fileOrContent, options.eventFileOrContent);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'PDF do evento impresso corretamente.'
        };
    }
    printUnusable(options) {
        const NFePrintUnusable = this.ACBrLib.func('NFE_ImprimirInutilizacao', 'int', ['string']);
        const data = NFePrintUnusable(options.pathXMLFile);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'Inutilização impressa corretamente.'
        };
    }
    printUnusablePDF(options) {
        const NFePrintUnusablePDF = this.ACBrLib.func('NFE_ImprimirInutilizacaoPDF', 'int', ['string']);
        const data = NFePrintUnusablePDF(options.pathXMLFile);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'PDF da inutilização impresso corretamente.'
        };
    }
    saveUnusablePDF(options) {
        const NFeSaveUnusablePDF = this.ACBrLib.func('NFE_SalvarInutilizacaoPDF', 'int', ['string']);
        const data = NFeSaveUnusablePDF(options.pathXMLFile);
        return {
            ACBrCode: data,
            ACBrResponse: data !== 0 ? (0, _errors_1.libError)(data) : 'PDF da inutilização salvo corretamente.'
        };
    }
}
exports.ACBrLibNFe = ACBrLibNFe;
