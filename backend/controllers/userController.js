import User from '../models/User.js';

export const createUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email or username already exists' 
      });
    }

    const user = new User({
      email,
      username,
      password, // Note: In production, this should be hashed
    });

    await user.save();
    
    res.status(201).json({
      message: 'User created successfully',
      userId: user._id
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

export const updateUsername = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username } = req.body;

    // Check if username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { username } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Username updated successfully', user });
  } catch (error) {
    console.error('Update username error:', error);
    res.status(500).json({ message: 'Error updating username' });
  }
};

export const updatePfp = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { pfp: req.file.buffer } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Profile picture updated successfully'
    });
  } catch (error) {
    console.error('Update profile picture error:', error);
    res.status(500).json({ message: 'Error updating profile picture' });
  }
};

export const addTaskImage = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $push: { 
          taskImg: {
            data: req.file.buffer,
            timestamp: new Date()
          }
        } 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Task image added successfully',
      timestamp: user.taskImg[user.taskImg.length - 1].timestamp
    });
  } catch (error) {
    console.error('Add task image error:', error);
    res.status(500).json({ message: 'Error adding task image' });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert Buffer to Base64 for response
    const response = {
      ...user.toObject(),
      pfp: user.pfp ? user.pfp.toString('base64') : null,
      taskImg: user.taskImg.map(img => ({
        data: img.data.toString('base64'),
        timestamp: img.timestamp
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error retrieving user' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, profilePic, sadPic } = req.body;
    const userId = req.user.id;

    const updateFields = {};
    if (username) updateFields.username = username;
    if (profilePic) updateFields.profilePic = profilePic;
    if (sadPic) updateFields.sadPic = sadPic;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Error getting user' });
  }
};
