import express from 'express'
import { bookAppointment, getProfile, listAppointment, loginUser, registerUser, updateProfile,cancelAppoitment, paymentRazorpay, verifyRazorpay, sendResetOtp, resetPassword } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)

userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppoitment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
userRouter.post('/verifyRazorpay',verifyRazorpay)
userRouter.post('/send-reset-otp',sendResetOtp)
userRouter.post('/reset-password',resetPassword)


export default userRouter 