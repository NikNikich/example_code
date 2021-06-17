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
    from: 'lk@watwell.ru',
    transport: {
      host: 'mail.watwell.ru',
      port: 465,
      secure: true, // upgrade later with STARTTLS
      auth: {
        user: 'lk@watwell.ru',
        pass: 'W9r5W5e3',
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
  },
  restoreURL: 'https://unitedwater-webapp.psrv5.citronium.com/reset-password',
};
