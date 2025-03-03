import User from '../models/User.js';

// Helper function to generate a random 7-digit tag ID
const generateTagId = () => {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
};

// Helper function to check if a tag ID already exists
const isTagIdUnique = async (tagId) => {
  const user = await User.findOne({ tagId });
  return !user;
};

// Handle Google sign-in
export const googleSignIn = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, return user info
      return res.status(200).json({
        message: 'User logged in successfully',
        userId: user._id,
        username: user.username,
        tagId: user.tagId,
        hasCompletedSetup: user.profilePicture && user.sadImg ? true : false
      });
    }

    // User doesn't exist, create a temporary user record
    // The username and tagId will be set later in the setup process
    user = new User({
      email,
      username: `user_${Date.now()}`, // Temporary username
      tagId: await generateUniqueTagId(), // Generate a unique tag ID
      password: null // No password for Google sign-in
    });

    await user.save();
    
    res.status(201).json({
      message: 'User created successfully',
      userId: user._id,
      needsSetup: true
    });
  } catch (error) {
    console.error('Google sign-in error:', error);
    res.status(500).json({ message: 'Error during Google sign-in' });
  }
};

// Generate a unique tag ID
const generateUniqueTagId = async () => {
  let tagId;
  let isUnique = false;
  
  while (!isUnique) {
    tagId = generateTagId();
    isUnique = await isTagIdUnique(tagId);
  }
  
  return tagId;
};

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

    // Generate a unique tag ID
    const tagId = await generateUniqueTagId();

    const user = new User({
      email,
      username,
      tagId,
      password, // Note: In production, this should be hashed
    });

    await user.save();
    
    res.status(201).json({
      message: 'User created successfully',
      userId: user._id,
      tagId: user.tagId
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

    res.json({ 
      message: 'Username updated successfully', 
      user: {
        username: user.username,
        tagId: user.tagId
      } 
    });
  } catch (error) {
    console.error('Update username error:', error);
    res.status(500).json({ message: 'Error updating username' });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { profilePicture: req.file.buffer } },
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

export const updateSadPic = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { sadImg: req.file.buffer } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Sad picture updated successfully'
    });
  } catch (error) {
    console.error('Update sad picture error:', error);
    res.status(500).json({ message: 'Error updating sad picture' });
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
      profilePicture: user.profilePicture ? user.profilePicture.toString('base64') : null,
      sadImg: user.sadImg ? user.sadImg.toString('base64') : null,
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
