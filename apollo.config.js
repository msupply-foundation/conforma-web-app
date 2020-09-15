import * as config from './src/config.json'

module.exports = {
  client: {
    service: {
      name: "Application Manager",
      url: config.server
    }
  }
}