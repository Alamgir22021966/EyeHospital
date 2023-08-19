import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfmakeService {
  pdfMake: any;
  constructor() {

  }

  public async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
      this.pdfMake.fonts = {
        'Roboto': {
          normal: 'Roboto-Regular.ttf',
          bold: 'Roboto-Medium.ttf',
          italics: 'Roboto-Italic.ttf',
          bolditalics: 'Roboto-Italic.ttf'
        }
      };
    }
  }

 


}
