const amqp = require('amqplib')

let instance

/**
 * Broker for async messaging
 */
class MessageBroker {
  /**
   * Trigger init connection method
   */
  constructor(options) {
    this.vhost = options.vhost || ''
    this.connection = null
    this.channel = null
    this.exchange = options.exchange || 'exchange'
    this.exType = options.exType || 'direct'
    this.durable = options.durable || true
    this.routeKey = options.routeKey || ''
    this.autoDelete = options.autoDelete || false
  }

  /**
   * Initialize connection to rabbitMQ
   */
  async init() {
    this.connection = await amqp.connect(config.mqUrl)
    this.channel = await this.connection.createChannel()

    return this
  }

  /**
   * Send message
   * @param {Object} msg Message as Buffer
   */
  async send(msg) {
    if (!this.connection) {
      await this.init()
    }

    console.log('=======send=======')
    console.log(this.exchange, this.exType, this.routeKey)

    await this.channel.assertExchange(this.exchange, this.exType, {
      durable: this.durable
    })

    this.channel.publish(this.exchange, this.routeKey, Buffer.from(msg))
  }
}

/**
 * @return {Promise<MessageBroker>}
 */
async function getInstance(options) {
  if (!instance) {
    const broker = new MessageBroker(options)
    instance = await broker.init()
  }

  return instance
}

module.exports = {
  getInstance
}
