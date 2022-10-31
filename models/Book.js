const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  isbn: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  idJenis: {
    type: ObjectId,
    ref: "Jenis",
  },
  idKategori: {
    type: ObjectId,
    ref: "Kategori",
  },
});

module.exports = mongoose.model("Book", bookSchema);
