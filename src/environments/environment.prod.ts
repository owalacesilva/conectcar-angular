export const environment = {
  production: true,
  cupomName: 'cupom',
  facebook: {
    appId: 'XXXXXXXXXXXXXXX',
  },
  api: {
    headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      }
    ],
    host: 'https://localhost',
    retryTimes: 4,
  },
};
