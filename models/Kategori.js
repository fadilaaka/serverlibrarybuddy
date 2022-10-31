const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const kategoriSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  idJenis: {
    type: ObjectId,
    ref: "Jenis",
  },
  books: [
    {
      type: ObjectId,
      ref: "Book",
    },
  ],
});

module.exports = mongoose.model("Kategori", kategoriSchema);
