/**
{
    openid: String,
    session_key: String
}
 */
const userCollection = mongoDb.collection('user')
module.exports = userCollection
