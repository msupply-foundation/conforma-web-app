import * as config from './src/config.json'

module.exports = {
  client: {
    service: {
      name: 'Conforma',
      url: config.server,
    },
  },
}
