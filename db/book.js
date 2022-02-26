/**
{
    doubanId: Number,
    url: String,
    isbn: String,
    name: String,
    author: String,
    publisher: String,
    publishDate: String,
    price: Number,
    introduction: String,
    imageSrc: String,
    catalogue: String
}
 */
const bookCollection = mongoDb.collection('book')
module.exports = bookCollection
