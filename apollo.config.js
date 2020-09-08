import * as config from './config.json'

module.exports = {
  client: {
    service: {
      name: "Application Manager",
      url: config.server
    }
  }
}