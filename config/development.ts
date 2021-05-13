// noinspection SpellCheckingInspection
module.exports = {
  server: {
    port: 3000,
    url: 'http://localhost',
  },
  swagger: {
    scheme: 'http',
  },
  db: {
    port: '5432',
    host: 'postgres',
    username: 'postgres',
    password: 'HZz359kZoJWiQYGZ',
    database: 'water_loc', // GO TO README FILE
    synchronize: true,
    migrationsRun: true,
    logging: true,
  },
  aws: {
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
  },
  sms: {
    sendRealSms: false,
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
  restoreURL:
    'https://unitedwater-webapp.psrv5.citronium.com/reset-password/RESET_CODE',
};
