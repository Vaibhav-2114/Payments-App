import mongoose from "mongoose";
import Friends from "../models/friendsSchema.js";
import { User } from "../models/userSchema.js";

export async function getFriends(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    const friendRecord = await Friends.findOne({ userID: userId })
      .select("friends")
      .populate("friends", "username firstName lastName");

    return res.status(200).json({ friends: friendRecord?.friends ?? [] });
  } catch (error) {
    console.log("Error fetching friends: ", error);
    return res.status(500).json({ message: "Error getting friends" });
  }
}

export async function addFriend(req, res) {
  try {
    const userId = req.userId;
    const { friendId } = req.body;

    if (!mongoose.isValidObjectId(friendId)) {
          return res.status(400).json({ message: "A valid friend ID is required" });
    }

    if (String(userId) === String(friendId)) {
          return res.status(400).json({ message: "You cannot add yourself" });
    }

    const friendUser = await User.findById(friendId).select("_id");

    if (!friendUser) {
      return res.status(404).json({ message: "User not found" })
    }

    await Promise.all([Friends.findOneAndUpdate(
      { userID: userId },
      { $addToSet: { friends: friendId } },
      { upsert: true, new: true, runValidators: true }
    ),
    Friends.findOneAndUpdate(
      { userID: friendId },
      { $addToSet: { friends: userId } },
      { upsert: true, new: true, runValidators: true }
    ),
    ])

    return res.status(200).json({ message: "Friend add successfully" })
  } catch (error) {
    console.error("Error adding friend:", error);
    return res.status(500).json({ message: "Error adding friend" })
  }
}
