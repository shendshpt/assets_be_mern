import User from '../models/userModel.js'

/**
 * @desc feth data for access private routescreen
 * @routeaccess  GET /api/private
 * @access  private
 */
export const getPrivateData = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: 'you got access to the private data in this route',
  })
}

/**
 * @desc feth data By Id User from login api
 * @routeaccess  GET /api/private/:id
 * @access  private
 */
export const getUserProfile = async (req, res, next) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('UserNot found')
  }
}

/**
 * @desc feth data update user profile byID from login api
 * @routeaccess  GET /api/private/profile
 * @access  private
 */
export const updateUserProfile = async (req, res, next) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }
    const updateUser = await user.save()

    res.status(201).json({
      success: true,
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    })
  }
}
