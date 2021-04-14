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
};
