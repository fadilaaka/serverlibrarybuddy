const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const jenisSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  idKategori: [
    {
      type: ObjectId,
      ref: "Kategori",
    },
  ],
});

module.exports = mongoose.model("Jenis", jenisSchema);
