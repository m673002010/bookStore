/**
{
    openid: String,
    bookId: Number,
    isbn: String
}
 */
const userBookCollection = mongoDb.collection('userBook')
module.exports = userBookCollection
