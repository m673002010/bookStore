/**
{
    bookId: Number,
    isbn: Number,
    name: String,
    author: String,
    publisher: String,
    publishDate: String,
    price: Number,
    introduction: String,
    imageSrc: String
}
 */
const bookCollection = mongoDb.collection('book')
module.exports = bookCollection
