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
    username: 'admin',
    password: 'Cid2Q9p2J1BM',
    bucket: 'rabbit_dev',
    org: 'united-water',
    token:
      'Q5HlGZePqCkzFYLH8Mfp8hZoBhx_3dQk4LFPEhH-wXe9AIQgqnfm6n0IVOR7DIi0-E0ZYG_7NB6_muAwRVNc7Q==',
  },
  influxDB1: {
    host: 'https://unitedwater-influxdb.psrv5.citronium.com',
    username: 'admin',
    password: 'Cid2Q9p2J1BM',
    bucket: 'rabbit_dev_1',
    org: 'united-water',
    token:
      'Q5HlGZePqCkzFYLH8Mfp8hZoBhx_3dQk4LFPEhH-wXe9AIQgqnfm6n0IVOR7DIi0-E0ZYG_7NB6_muAwRVNc7Q==',
  },
  rabbitMQ: {
    uri: 'amqp://united_rabbit:5lIHHO5QcvdSi@psrv5.citronium.com:5672',
    exchange: 'amq.topic',
    queue1: 'devs_rpc_req',
    replacement1: 2,
    queue2: 'devs_rpc_res',
    replacement2: 2,
    queue3: 'devs_events',
    replacement3: 2,
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
