const amqp = require('amqplib')

let instance

/**
 * Broker for async messaging
 */
class MessageBroker {
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
    try {
      this.connection = await amqp.connect(`${config.mqUrl}/${this.vhost}`)
      this.channel = await this.connection.createChannel()

      return this
    } catch (err) {
      logger.log(err)
    }
  }

  /**
   * Send message
   * @param {Object} msg Message as Buffer
   */
  async send(msg) {
    try {
      if (!this.connection) {
        await this.init()
      }
  
      await this.channel.assertExchange(this.exchange, this.exType, {
        durable: this.durable
      })
  
      this.channel.publish(this.exchange, this.routeKey, Buffer.from(JSON.stringify(msg)))
    } catch (err) {
      logger.log(err)
    }
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
