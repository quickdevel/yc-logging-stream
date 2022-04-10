const { Writable } = require('stream')

const {
  Session,
  serviceClients: {
    LogIngestionServiceClient
  },
  cloudApi: {
    logging: {
      log_ingestion_service: { WriteRequest },
      log_entry: {
        LogLevel_Level: logLevels
      }
    }
  }
} = require('@yandex-cloud/nodejs-sdk')

const createWriteStream = function (options) {
  // Init client and session
  // https://github.com/yandex-cloud/nodejs-sdk#getting-started
  const session = new Session(options.auth)

  const client = session.client(LogIngestionServiceClient)

  // https://cloud.yandex.ru/docs/logging/api-ref/grpc/log_ingestion_service#Destination
  const destination = {}
  if (options.destination.logGroupId) {
    destination.logGroupId = options.destination.logGroupId
  } else if (options.destination.folderId) {
    destination.folderId = options.destination.folderId
  }

  const write = async function (entries) {
    // https://cloud.yandex.ru/docs/logging/api-ref/grpc/log_ingestion_service#WriteRequest
    await client.write(WriteRequest.fromPartial({
      destination,
      entries: entries instanceof Array ? entries : [entries]
    }))
  }

  return new Writable({
    objectMode: true,
    // https://cloud.yandex.ru/docs/logging/api-ref/grpc/log_ingestion_service
    // IncomingLogEntry:
    //   entries:
    //     The number of elements must be in the range 1-100.
    highWaterMark: 100,
    async write (chunk, encoding, callback) {
      try {
        await write(chunk)
      } catch (error) {
        callback(error)
      }

      callback()
    },
    async writev (chunks, callback) {
      try {
        await write(chunks.map(item => item.chunk))
      } catch (error) {
        callback(error)
      }

      callback()
    }
  })
}

module.exports = { createWriteStream, logLevels }