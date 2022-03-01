const amqp = require('amqplib/callback_api')

amqp.connect(config.mqUrl, function(error0, connection) {
  if (error0) {
    throw error0
  }

  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1
    }

    const exchange = 'logs'
    const key = 'info.log'
    const msg = 'Hello logCenter!'

    channel.assertExchange(exchange, 'topic', {
      durable: false
    })

    channel.publish(exchange, key, Buffer.from(msg))

    console.log(" [x] Sent %s:'%s'", key, msg)
  })
})
