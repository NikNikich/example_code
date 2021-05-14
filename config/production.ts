// noinspection SpellCheckingInspection
module.exports = {
  server: {
    port: 80,
    url: '',
  },
  swagger: {
    scheme: 'https',
  },
  db: {
    port: '5432',
    host: '',
    username: '',
    password: '',
    database: '',
    synchronize: true,
    migrationsRun: true,
    logging: false,
  },
  aws: {
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
  },
  sms: {
    sendRealSms: true,
  },
  notifications: {
    sendImportant: true,
    sendCommon: true,
  },
  email: {
    from: 'emailsmttp@mail.ru',
    transport: {
      host: 'smtp.mail.ru',
      port: 465,
      secure: true, // upgrade later with STARTTLS
      auth: {
        user: 'emailsmttp@mail.ru',
        pass: 'rAO}UPpiyo32',
      },
    },
  },
  restoreURL: 'https://unitedwater-webapp.psrv5.citronium.com/reset-password',
};
