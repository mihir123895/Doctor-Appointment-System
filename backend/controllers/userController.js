import validator from 'validator';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';
import {v2 as cloudinary} from 'cloudinary';
import appointmentModel from '../models/appointmentModel.js';
import doctorModel from '../models/doctorModel.js'
import razorpay from 'razorpay'
import transporter from '../config/nodemailer.js';
//API to register user

const registerUser = async (req,res) =>{
    
    try {
        const {name,email,password} = req.body

        if(!name || !password || !email){
            return res.json({success:false,message:"Missing Details"})
        }

        if (!validator.isEmail(email)){
            return res.json({success:false,message:"enter a valid email"})
        }

        if(password.length < 8){
            return res.json({success:false,message:"Password should be at least 8 characters long"})
        }

        //hashing user password
        const hashedPassword = await bcrypt.hash(password,10)

        const userData = {
            name,
            email,
            password:hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

        res.json({success:true,token})

    } catch (error) {

        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

//api for user login

const loginUser = async(req,res) =>{
    try {

        const {email,password}=req.body
        const user = await userModel.findOne({email})

        if(!user) {
           return res.json({success:false,message:"User does not exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(isMatch) {
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalide creatials"})
        }
       
    } catch (error) { 
        console.log(error)
        res.json({success:false,message:error.message}) 
    }
}

//api to get user profile data

const getProfile = async (req,res)=>{
    try {
        
        const {userId} = req.body
        const userData = await userModel.findById(userId).select('-password')
        res.json({success:true,userData})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
 
//api to update user profile
const updateProfile = async (req,res)=>{
    try {

        const {userId,name,phone,address,dob,gender} = req.body
        const imageFile = req.file
        
        if(!name || !phone || !dob || !gender){
            return res.json({success:false,message:"Data Missing"})
        }

        await userModel.findByIdAndUpdate(userId,{name,phone,address: JSON.parse(address),dob,gender})

        if(imageFile){
            //upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }

        res.json({success:true,message:"Profile Updated"})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to book appointment
const bookAppointment = async (req,res)=>{
    try {

        const { userId , docId , slotDate, slotTime } = req.body

        const docData = await doctorModel.findById(docId).select('-password')

        if(!docData.available){
            return res.json({success:false,message:"Doctor not available"})
        }

        let slots_booked = docData.slots_booked

        //checking for slots availability
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:"Slot not available"})
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate]= []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amout:docData.fees,
            slotTime,
            slotDate,
            date:Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        //save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:"Appointment Booked"}) 


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})    
    }  
}

//api to get user appointments for frontend my-appointments page
const listAppointment = async (req,res)=>{
    try {
        const {userId} = req.body
        const appointments = await appointmentModel.find({userId})

        res.json({success:true,appointments})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }  
        
    }
    //API to cancel appointment
    const cancelAppoitment = async (req,res) =>{
        try {

            const {userId,appointmentId} = req.body

            const appointmentData = await appointmentModel.findById(appointmentId)

            //verify appointment user
            if(appointmentData.userId !== userId){
                return res.json({success:false,message:"Unauthorized action"})
            }

            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

            //releasing doctor slot

            const {docId,slotDate,slotTime}= appointmentData

            const doctorData = await doctorModel.findById(docId)

            let slots_booked = doctorData.slots_booked

            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

            await doctorModel.findByIdAndUpdate(docId,{slots_booked})

            res.json({success:true,message:"Appointment Cancelled"})

        } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        }
    }
 
    const razorpayInstance = new razorpay({
        key_id:process.env.RAZORPAY_KEY_ID,
        key_secret:process.env.RAZORPAY_KEY_SECRET

    })
    //API to make payment of appointment using razorpay
    const paymentRazorpay = async (req,res) =>{

        try {
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if( !appointmentData || appointmentData.cancelled ){
            return res.json({success:false,message:"Appointment Cancelled or not found"})
        }

        

        //creating options for razorpay payment
        const options = { 
            amount:appointmentData.amout * 100,
            currency:process.env.CURRENCY,
            receipt:appointmentId, 
        }

        //creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({success:true,order})
            
        } catch (error) {
            console.log(error)
        res.json({success:false,message:error.message})
            
        }
    }

    //api to verify payment of razorpay
    const verifyRazorpay = async (req,res) =>{
        try {

            const {razorpay_order_id} = req.body

            const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

            // console.log(orderInfo)

            if(orderInfo.status === 'paid'){
                await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
                res.json({success:true,message:"Payment Successfull"})
            }else {
                res.json({success:false,message:"Payment Failed"})
            }
            
        } catch (error) {
            console.log(error)
        res.json({success:false,message:error.message})
            
        }
    }

//send password reset ootp

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Invalid email' });
    }
  
    try {
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
      user.resetOtp = otp;
      user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
      await user.save();
  
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`,
      };
  
      await transporter.sendMail(mailOptions);
  
      return res.status(200).json({ success: true, message: 'OTP sent to your email' });
  
    } catch (error) {
      console.error('OTP sending error:', error); // ✅ log it
      return res.status(500).json({ success: false, message: 'Error sending OTP' });
    }
  };
//reset user password

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success:false, message: 'Email,otp and Password require' });
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success:false, message: 'User not found' });
        }

        if(user.resetOtp === "" || user.resetOtp !== otp) {
            return res.status(400).json({ success:false, message: 'Invalid OTP' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = ""; // Clear the OTP after successful password reset
        user.resetOtpExpires = 0; // Clear the expiration time

        await user.save();

        return res.status(200).json({ success:true, message: 'Password reset successfully' });

    } catch (error) {
        
    }

}

export {registerUser , loginUser , getProfile , updateProfile,bookAppointment,listAppointment , cancelAppoitment , paymentRazorpay,verifyRazorpay}