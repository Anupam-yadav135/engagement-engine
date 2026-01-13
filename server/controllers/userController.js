// this is basically for giving the dynamic likes and followers to the post that have been posted 
import imagekit from "../configs/imagekit.js"
import User from "../models/User.js"
import fs from "fs"

// Get user data using userId
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth

    const user = await User.findById(userId)
    if (!user) {
      return res.json({ success: false, message: "User not found" })
    }

    res.json({ success: true, user })
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

// Update user data
export const updateUserData = async (req, res) => {
  try {
    const { userId } = req.auth
    let { username, bio, location, full_name } = req.body

    const tempUser = await User.findById(userId)
    if (!tempUser) {
      return res.json({ success: false, message: "User not found" })
    }

    // keep old username if empty
    if (!username) username = tempUser.username

    // check if username already exists
    if (tempUser.username !== username) {
      const userExists = await User.findOne({ username })
      if (userExists) {
        username = tempUser.username
      }
    }

    const updatedUser = {
      username,
      bio,
      location,
      full_name,
    }

    const profile = req.files?.profile?.[0]
    const cover = req.files?.cover?.[0]

    if (profile) {
      const buffer = fs.readFileSync(profile.path)
      const response = await imagekit.upload({
        file: buffer,
        filename: profile.originalname,
      })

      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "512" },
        ],
      })

      updatedUser.profile_picture = url
    }

    if (cover) {
      const buffer = fs.readFileSync(cover.path)
      const response = await imagekit.upload({
        file: buffer,
        filename: cover.originalname,
      })

      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      })

      updatedUser.cover_photo = url
    }

    const user = await User.findByIdAndUpdate(userId, updatedUser, {
      new: true,
    })

    res.json({ success: true, user, message: "Profile updated successfully" })
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

// Find users using username, email, location, name
export const discoverUsers = async (req, res) => {
  try {
    const { userId } = req.auth
    const { input } = req.body

    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    })

    const filteredUsers = allUsers.filter(
      (user) => user._id.toString() !== userId
    )

    res.json({ success: true, users: filteredUsers })
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

// Follow user
export const followUser = async (req, res) => {
  try {
    const { userId } = req.auth
    const { id } = req.body

    const user = await User.findById(userId)
    if (user.following.includes(id)) {
      return res.json({
        success: false,
        message: "You are already following this user",
      })
    }

    user.following.push(id)
    await user.save()

    const toUser = await User.findById(id)
    toUser.followers.push(userId)
    await toUser.save()

    res.json({ success: true, message: "Now you are following this user" })
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

// Unfollow user
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.auth
    const { id } = req.body

    const user = await User.findById(userId)
    user.following = user.following.filter((uid) => uid !== id)
    await user.save()

    const toUser = await User.findById(id)
    toUser.followers = toUser.followers.filter((uid) => uid !== userId)
    await toUser.save()

    res.json({
      success: true,
      message: "Now you are no longer following this user",
    })
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}
