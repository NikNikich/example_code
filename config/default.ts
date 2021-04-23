// noinspection SpellCheckingInspection
module.exports = {
  version: '0.0.1',
  jwt: {
    expiresIn: 3600000,
    secret: 'JwtSecretString',
  },
  swagger: {
    enable: true,
    path: 'swagger',
  },
  db: {
    migrations: [
      './src/infrastructure/database/typeorm/migrations/*.ts',
      './src/infrastructure/database/typeorm/migrations/*.js',
    ],
    migrationsDir: './src/infrastructure/database/typeorm/migrations/',
    cli: {
      migrationsDir: 'src/infrastructure/database/typeorm',
    },
  },
  sms: {
    minRepeatTime: 60000,
    codeLifetime: 5 * 60000,
    notRandom: '1234',
    phoneWithoutSms: '73141592653',
    codeWithoutSms: '0112',
    backdoorPhones: ['79024545454', '79026565656'],
    backdoorCodes: ['4545', '6565'],
  },
  notifications: {
    token: '',
    chatId: '',
  },
  showErrorStackTrace: true,
};
