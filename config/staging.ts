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
    host: 'postgres',
    username: 'postgres',
    password: 'postgres',
    database: 'base',
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
};
