const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const peminjamanSchema = new mongoose.Schema({
  tanggalPeminjaman: {
    type: Date,
    require: true,
  },
  tanggalPengembalian: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "belum dikonfirmasi",
  },
  anggota: {
    type: ObjectId,
    ref: "Anggota",
  },
  book: {
    type: ObjectId,
    ref: "Book",
  },
});

module.exports = mongoose.model("Peminjaman", peminjamanSchema);
