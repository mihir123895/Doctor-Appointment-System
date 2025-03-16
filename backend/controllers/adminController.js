import bcrypt from 'bcrypt';
import validator from 'validator';
import doctorModel from '../models/doctorModel.js';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// API for adding doctors
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        // Checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imageFile) {
            return res.status(400).json({ success: false, message: "Missing data" });
        }

        // Validating email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password should be at least 8 characters long" });
        }

        // Hashing doctor password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;
        

        const doctorsData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address), 
            date: Date.now(),
        };

        const newDoctor = new doctorModel(doctorsData);
        await newDoctor.save();

       res.json({ success: true, message: "Doctor added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

//api for admin login
const loginAdmin = async (req,res) =>{
    try {

        const {email,password} = req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})

        }else{
            return res.status(400).json({ success: false, message: "Invalid email or password"})
        }

        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

//API to get doctors list for admin

const allDoctors = async (req,res) =>{
    try {
        const doctors = await doctorModel.find({}).select("-password");
        res.json({success:true,doctors})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})  
    }
}

export { addDoctor,loginAdmin,allDoctors }; 


