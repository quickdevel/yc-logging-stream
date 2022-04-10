const loggingStream = require('../index.js')

const options = require('./options.js')

const stream = loggingStream.createWriteStream(options)

const run = async function () {
  for (let i = 0; i < 10; i++) {
    console.log('message #' + i)
    stream.write({
      timestamp: new Date(),
      level: loggingStream.logLevels.INFO,
      message: 'Example message #' + i,
      jsonPayload: {
        foo: 'bar',
        i
      }
    })
  }

  await new Promise(resolve => setTimeout(resolve, 5000))
}

run()
