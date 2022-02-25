const { createClient } =  require('redis')

async function connectRedis() {
    try {
        const client = createClient({
            url: 'redis://192.168.43.144:6379',
            password: 19951227
        })
    
        if (!client) throw new Error('redis client null')
    
        // 监听错误
        client.on('error', (err) => {
            console.log('client error:', err)
        })
      
        // 等待连接
        await client.connect().catch(err => {
            console.log('redis connect error:', err)
            throw new Error('redis connect fail')
        })

        // 测试读写是否正常
        await client.set('hello', 'world')
        await client.get('hello')

        console.log('Connected successfully to redis')
        return client
    } catch (err) {
        throw err
    }
}

module.exports = {
    connectRedis
}
