import { ACBrLibNFe } from "@ACBrLibNFe";
import { INFe } from "@interfaces";
import { NFeConsultData } from "@types";


/**
 * Class to manipulate NFe
 *
 * @export
 * @class NFe
 * @implements {INFe}
 */
export class NFe implements INFe {
  
  /**
   * Method to consult NFe in SEFAZ WebService
   *
   * @param {NFeConsultData} {keyOrContent, isEventsExtract}
   * @memberof NFe
   */
  consult({keyOrContent, isEventsExtract}: NFeConsultData): void {
    throw new Error("Method not implemented.");
  }
  
  send(): void {
    throw new Error("Method not implemented.");
  }
  cancel(): void {
    throw new Error("Method not implemented.");
  }
  unusable(): void {
    throw new Error("Method not implemented.");
  }
  correction(): void {
    throw new Error("Method not implemented.");
  }

}

const teste = new ACBrLibNFe({
  ACBrLibPath: '',
  ACBrOptions: {
    fileConfigINI: '',
    keyCrypt: ''  
  }
})