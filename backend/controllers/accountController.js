import mongoose from "mongoose";
import Account from "../models/accountSchema.js";

export async function checkBalance(req, res) {
  try {
    const account = await Account.findOne(
      { userID: req.userId }).select("balance");

    if (!account) {
      return res.status(404).json({message : "Account not found"});
    }

    return res.status(200).json({ balance: account.balance });
  } catch (error) {
    console.log("Balance lookup failed: ", error.message);
    res.status(500).json({ message: "Unable to get balance" });
  }
}

export async function transferMoney(req, res) {
  const { toUserID, amount } = req.body;

  if (!mongoose.isValidObjectId(toUserID)) {
    return res
      .status(400)
      .json({ message: "A valid recipient ID is required" });
  }

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number" });
  }

  if (toUserID === String(req.userId)) {
    return res.status(400).json({ message: "Cannot transfer to yourself" });
  }

  const session = await mongoose.startSession();

  try {
    let newBalance;

    await session.withTransaction(async () => {
      const sender = await Account.findOne(
        { userID: req.userId }).session(session);
      const recipient = await Account.findOne({ userID: toUserID }).session(session);

      if (!sender || !recipient) {
        const error = new Error("Sender or recipant account not found");
        error.status = 404;
        throw error;
      }

      if (sender.balance < amount) {
        const error = new Error("Insufficient funds");
        error.status = 400;
        throw error;
      }

      sender.balance -= amount;
      recipient.balance += amount;

      await sender.save({ session });
      await recipient.save({ session });

      newBalance = sender.balance;
    });

    return res.status(200).json({
      message: "Transfer successful",
      balance: newBalance,
    });
  } catch (error) {
    console.log("Error transfering balance: ", error.message);
    res.status(500).json({ message: "Error transfering balance" });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}


// This is for adding money from external sources but for now just add balance directly
export async function addMoney(req, res) {
  try {
    const account = await Account.findOneAndUpdate(
      { userID: req.userId },
      { $inc: { balance: 5000 } },
      {
        new: true,
        runValidators: true
      },
    ).select("balance");

    if (!account) {
      return res.status(400).json({ message: "Account not found" })
    }

    return res.status(200).json({
      message: "Added 5000 to the account",
      balance: account.balance
    })
  } catch (error) {
    console.log("Error Adding money:", error)
    if (error.status) {
      return res.status(error.status).json({ message: error.message })
    }
  }
}
