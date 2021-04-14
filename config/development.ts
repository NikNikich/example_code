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
};
