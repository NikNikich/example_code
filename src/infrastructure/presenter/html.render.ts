import * as ejs from 'ejs';
import * as fs from 'fs';
import { promisify } from 'util';
import {
  giftCertificateTemplatePath,
  resetPasswordEmailTemplatePath,
} from '../../application/views/view.list';
const readFileAsync = promisify(fs.readFile);

export class HtmlRender {
  static async renderResetPasswordEmail(data: {
    resetLink: string;
  }): Promise<string> {
    return HtmlRender.renderHtml(resetPasswordEmailTemplatePath, data);
  }

  static async renderGiftCertificate(data: {
    resetLink: string;
  }): Promise<string> {
    return HtmlRender.renderHtml(giftCertificateTemplatePath, data);
  }

  static async renderHtml(
    templatePath: string,
    data: Record<string, unknown>,
  ): Promise<any> {
    const template = await readFileAsync(templatePath);
    const options: ejs.Options = {
      filename: templatePath,
      cache: true,
    };
    return ejs.compile(template.toString(), options)(data);
  }
}
