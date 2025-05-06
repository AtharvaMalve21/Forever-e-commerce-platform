const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passwordSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resetOTP: {
      type: String,
    },
    resetOTPExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Password = mongoose.model("Password", passwordSchema);
module.exports = Password;
