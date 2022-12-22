const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ObjectId } = mongoose.Schema;

const anggotaSchema = new mongoose.Schema({
  code: {
    type: String,
    require: true,
    unique: true,
  },
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true, unique: true },
  name: {
    type: String,
    required: true,
  },
  telp: {
    type: String,
    required: true,
  },
  alamat: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  books: [
    {
      type: ObjectId,
      ref: "Book",
    },
  ],
  peminjaman: [
    {
      type: ObjectId,
      ref: "Peminjaman",
    },
  ],
  pengembalian: [
    {
      type: ObjectId,
      ref: "Pengembalian",
    },
  ],
});

anggotaSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

module.exports = mongoose.model("Anggota", anggotaSchema);
