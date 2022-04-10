# Yandex Cloud Logging Stream для Node.js

Данный модуль позволяет создать [Writable stream](https://nodejs.org/api/stream.html#writable-streams) для передачи данных в [Yandex Cloud Logging](https://cloud.yandex.ru/services/logging).
Так же модуль включает в себя transport для логгера [Pino](https://github.com/pinojs/pino).

## Установка

    npm install yc-logging-stream

## Stream

Пример использования:

    const loggingStream = require('yc-logging-stream')
    
    const stream = loggingStream.createWriteStream({
      auth: {
        oauthToken: 'OAUTH_TOKEN' // или iamToken: 'IAM_TOKEN'
      },
      destination: {
        logGroupId: 'LOG_GROUP_ID' // или folderId: 'FOLDER_ID'
      }
    })
    
    const run = async function () {
      stream.write({
        timestamp: new Date(),
        level: loggingStream.logLevels.INFO,
        message: 'Example message',
        jsonPayload: { foo: 'bar' }
      })
    
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
    
    run()


## Pino

Пример использования:

    const http = require('http')
    const pino = require('pino')
    const pinoHttp = require('pino-http')
    
    const transport = pino.transport({
      targets: [{
        target: 'yc-logging-stream/pino',
        options: {
          auth: {
            oauthToken: '' // или iamToken: ''
          },
          destination: {
            logGroupId: '' // или folderId: ''
          }
        }
      }]
    })
    
    const logger = pino(transport)
    const httpLogger = pinoHttp({ logger })
    
    const server = http.createServer((req, res) => {
      httpLogger(req, res)
      req.log.info('something else')
      res.end('hello world')
    })
    
    server.listen(3000)

## Структура options

Параметр `options` представляет собой объект с ключами `auth` и `destination`.
Параметр `auth` представляет собой объект с ключами `iamToken` или `oauthToken`, которые содержат соответствующие токены. Данный параметр передается в объект Session. Подробнее о данном параметре вы можете узнать [в документации к Node.js SDK](https://github.com/yandex-cloud/nodejs-sdk#getting-started).
Параметр `destination` представляет собой объект с ключами `logGroupId` (идентификатор лог-группы) или `folderId` (идентификатор каталога). Подробнее о данном параметре вы можете узнать [в документации к Yandex Cloud Logging](https://cloud.yandex.ru/docs/logging/concepts/log-group).