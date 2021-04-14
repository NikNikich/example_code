// noinspection SpellCheckingInspection
module.exports = {
  server: {
    port: 3001,
    url: 'http://localhost',
  },
  swagger: {
    scheme: 'http',
  },
  db: {
    port: '5432',
    host: '',
    username: 'postgres',
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
    sendRealSms: false,
  },
  notifications: {
    sendImportant: false,
    sendCommon: false,
  },
};
