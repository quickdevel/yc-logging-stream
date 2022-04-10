const { Writable } = require('stream')

const {
  Session,
  serviceClients: {
    LogIngestionServiceClient
  },
  cloudApi: {
    logging: {
      log_ingestion_service: { WriteRequest }
    }
  }
} = require('@yandex-cloud/nodejs-sdk')

const createWriteStream = function (options) {
  const session = new Session({ oauthToken: options.oauthToken })
  const client = session.client(LogIngestionServiceClient)

  const write = async function (entries) {
    await client.write(WriteRequest.fromPartial({
      destination: options.destination,
      entries: entries instanceof Array ? entries : [entries]
    }))
  }

  return new Writable({
    objectMode: true,
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

module.exports = { createWriteStream }