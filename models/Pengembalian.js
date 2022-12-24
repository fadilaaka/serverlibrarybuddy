const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const pengembalianSchema = new mongoose.Schema({
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
    default: "belum dikembalikan",
  },
  waktuDikembalikan: {
    type: Date,
  },
  anggota: {
    type: ObjectId,
    ref: "Anggota",
  },
  book: {
    type: ObjectId,
    ref: "Book",
  },
  peminjaman: {
    type: ObjectId,
    ref: "Book",
  },
});

module.exports = mongoose.model("Pengembalian", pengembalianSchema);
