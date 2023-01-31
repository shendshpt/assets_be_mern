import express from 'express'
import {
  getPrivateData,
  getUserProfile,
  updateUserProfile,
} from '../controllers/private.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.route('/').get(protect, getPrivateData)
router.route('/:id').get(protect, getUserProfile)
router.route('/profile').put(protect, updateUserProfile)

export default router
