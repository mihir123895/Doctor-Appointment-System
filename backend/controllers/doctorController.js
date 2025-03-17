import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"

const changeAvailablity = async (req,res) =>{
  try {

    const {docId} = req.body

    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
    res.json({success:true,message:"Availability Changed"})
    
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
    
  }
}

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email']);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

    //api for login doctors
    const loginDoctors = async (req,res) =>{
      try {

        const {email,password} = req.body

        const doctor = await doctorModel.findOne({email})

        if(!doctor){
          return res.json({sucess:false,message:"Invalide creadentials"})
        }

        const isMatch = await bcrypt.compare(password,doctor.password)

        if(isMatch){
          const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)

          res.json({success:true,token})
        }else {
          res.json({success:false,message:"Invalide Creadentials"})
        }

          
      } catch (error) {
        console.log(error);
    res.json({ success: false, message: error.message });
          
      }
  }

  const appointmentsDoctor = async (req,res) =>{
    try {

      const {docId} = req.body 
      const appointments = await appointmentModel.find({docId})

      res.json({success:true,appointments})
      
    } catch (error) {
      console.log(error);
    res.json({ success: false, message: error.message });
      
    }
  }

export { changeAvailablity, doctorList , loginDoctors , appointmentsDoctor}