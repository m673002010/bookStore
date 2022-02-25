const MongoClient = require('mongodb').MongoClient

async function connectDb() {
    try {
        const client = new MongoClient(config.mongodbUrl)

        if (!client) throw new Error('mongodb client null')
        
        // 等待连接
        await client.connect().catch(err => { 
            console.log('mongodb connect error', err)
            throw new Error('mongodb connect fail')
        })
    
        console.log('Connected successfully to mongodb')
        return client.db('bookStore')    
    } catch (err) {
        throw err
    }
}

module.exports = {
    connectDb
}
