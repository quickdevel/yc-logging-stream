const { once } = require('events')
const build = require('pino-abstract-transport')
const { createWriteStream } = require('.')

const {
  cloudApi: {
    logging: {
      log_entry: {
        LogLevel_Level: LogLevels
      }
    }
  }
} = require('@yandex-cloud/nodejs-sdk')

const levelMapping = {
  10: LogLevels.TRACE,
  20: LogLevels.DEBUG,
  30: LogLevels.INFO,
  40: LogLevels.WARN,
  50: LogLevels.ERROR,
  60: LogLevels.FATAL,
  default: LogLevels.LEVEL_UNSPECIFIED
}

module.exports = async (options) => {
  const destination = createWriteStream(options)

  return build(async function (source) {
    for await (let item of source) {
      const { level, msg: message, time, ...jsonPayload } = item

      const toDrain = !destination.write({
        timestamp: new Date(item.time),
        level: levelMapping[level] || levelMapping.default,
        message,
        jsonPayload
      })

      if (toDrain) {
        await once(destination, 'drain')
      }
    }
  }, {
    async close () {
      destination.end()
      await once(destination, 'close')
    }
  })
}
