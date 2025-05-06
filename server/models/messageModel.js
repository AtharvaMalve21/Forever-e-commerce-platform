const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messsageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messsageSchema);
module.exports = Message;
