import { User } from "../models/userSchema.js";
import Account from "../models/accountSchema.js"
import bcrypt from "bcryptjs"; // or "bcryptjs" if that's the installed package
import jwt from "jsonwebtoken";


function createToken(user, secret) {
  return jwt.sign({ userId: user._id }, secret, { expiresIn: '1d' })
}

function publicUser(user) {
  return {
    id: user._id,
    username: user.username,
    firstname: user.firstName,
    lastname: user.lastName,
  }
}

export async function signUp(req, res) {
  try {
    const { firstName, username, lastName, password } = req.body;

    if (!firstName || !lastName ||!username || !password) {
      return res.status(400).json({ message: "All fields are required"})
    }

    const normalizedUsername = username.trim().toLowerCase();
    const existingUser = await User.findOne({ username: normalizedUsername });

    if (existingUser) {
      return res.status(400).json({message: "Username already exists"})
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      username: normalizedUsername,
      password: hashedPassword,
    });

    await Account.create({
      userID: user._id,
      balance: 0,
    });

    return res.status(201).json({
      token: createToken(user, req.app.locals.JWT_SECRET),
      user: publicUser(user),
    })
  } catch (error) {
    console.error('Signup failed:', error.message);
    return res.status(500).json({ message: 'Signup failed' });
  }
}

export async function signIn(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({
      username: username.trim().toLowerCase(),
    });


    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    return res.json({
      token: createToken(user, req.app.locals.JWT_SECRET),
      user: publicUser(user),
    });
  } catch (error) {
    console.error('Signin failed:', error);
    return res.status(500).json({ message: "Unable to sign in" });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.userId).select("username firstName lastName")

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" })
    }

    return res.json({ user: publicUser(user) })
  } catch (error) {
    console.error("User lookup failed:", error);
    return res.status(500).json({ message: "Unable to get user" });
  }
}

export async function searchUser(req, res) {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username query is required" });
    }

    const user = await User.findOne({
      username: username.trim().toLowerCase(),
    }).select("_id username firstName lastName");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error("User search failed:", error);
    return res.status(500).json({ message: "Unable to search user" });
  }
}
