import mongoose from "mongoose"


const accountSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    balance: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    }
  }
)

const Account = mongoose.model("Account", accountSchema)

export default Account;
