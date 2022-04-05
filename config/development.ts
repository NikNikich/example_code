// noinspection SpellCheckingInspection
module.exports = {
  server: {
    port: 3000,
    url: 'http://localhost',
  },
  swagger: {
    scheme: 'https',
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
  influxDB: {
    host: 'https://unitedwater-influxdb.psrv5.citronium.com',
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
    trfrom: 'lk@watwell.ru',
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
