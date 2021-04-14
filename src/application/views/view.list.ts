import * as path from 'path';

export const resetPasswordEmailTemplatePath = path.join(
  __dirname,
  '/email/reset.password.email.ejs',
);

export const giftCertificateTemplatePath = path.join(
  __dirname,
  '/email/gift.certificate.ejs',
);
