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
};
