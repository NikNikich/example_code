// noinspection SpellCheckingInspection
module.exports = {
  server: {
    port: 3002,
    url: 'http://localhost',
  },
  swagger: {
    scheme: 'http',
  },
  db: {
    port: '5800',
    host: 'localhost',
    username: 'postgres',
    password: 'postgres',
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
