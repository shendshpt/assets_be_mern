import User from '../models/userModel.js'
import ErrorResponse from '../utils/errorResponse.js'
import sendEmail from '../utils/sendEmail.js'
import crypto from 'crypto'

/*
API Url : POST /api/auth/register
Route access : public
 */
export const register = async (req, res, next) => {
  const { name, email, password } = req.body

  try {
    const user = await User.create({
      name,
      email,
      password,
    })

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } catch (error) {
    next(error)
  }
}

/*
API Url : POST /api/auth/login
Route access : public
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400))
  }

  try {
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return next(new ErrorResponse('Email not found', 404))
    }

    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return next(new ErrorResponse('Password invalid', 401))
    }

    res.status(200).json(
      {
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      sendToken(200, true, user)
    )
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

/*
API Url : POST /api/auth/forgotpassword
Route access : private
 */
export const forgotpassword = async (req, res, next) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return next(new ErrorResponse('Email could not be sent', 404))
    }

    const resetToken = user.getResetPasswordToken()

    await user.save()

    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`

    const message = `
    <h1>You have requested a password reset</h1>
    <p>Please go to this  link  to reset  your password</p>
    <a href=${resetUrl} clicktacking=off>${resetUrl}</a>
    `
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: message,
      })

      res.status(200).json({ success: true, data: 'Email sent' })
    } catch (error) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined

      await user.save()

      return next(new ErrorResponse('Email could not be send', 500))
    }
  } catch (error) {
    next(error)
  }
}

/*
API Url : PUT /api/auth/resetpassword/:resetToken
Route access : private
 */
export const resetpassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex')

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return next(new ErrorResponse('Invalid Reset Token', 400))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    res.status(201).json({
      success: true,
      data: 'Password reset success',
    })
  } catch (error) {
    next(error)
  }
}

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken()
  res.status(statusCode).json({ success: true, token })
}
