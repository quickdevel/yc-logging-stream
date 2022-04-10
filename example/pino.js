const pino = require('pino')

const options = require('./options.js')

const transport = pino.transport({
  targets: [{
    target: 'pino/file',
    options: {
      destination: 'example.log'
    }
  },{
    target: '../pino',
    options
  }]
})

const logger = pino(transport)

const run = async function () {
  for (let i = 0; i < 3; i++) {
    logger.trace(`Example ${i} trace message`)
    logger.debug(`Example ${i} debug message`)
    logger.info(`Example ${i} info message`)
    logger.warn(`Example ${i} warn message`)
    logger.error(`Example ${i} error message`)
    logger.fatal(`Example ${i} fatal message`)
  }

  await new Promise(resolve => setTimeout(resolve, 5000))
}

run()
