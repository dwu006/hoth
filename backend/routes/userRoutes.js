import express from 'express';
import { 
  createUser, 
  updateUsername, 
  updateSadPic, 
  addTaskImage, 
  getUser 
} from '../controllers/userController.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// User routes
router.post('/register', createUser);
router.get('/:userId', getUser);
router.put('/:userId/username', updateUsername);
router.put('/:userId/sad-pic', upload.single('image'), updateSadPic);
router.post('/:userId/task-image', upload.single('image'), addTaskImage);

export default router;
