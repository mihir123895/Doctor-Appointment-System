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

 // API to mark appointment as completed for the doctor panel
const appointmentComplete = async (req,res) => {
  try {
    const { docId, appointmentId } = req.body;

    // Retrieve appointment data
    const appointmentData = await appointmentModel.findById(appointmentId);

 

    // Check if appointment exists and the docId matches
    if (appointmentData && appointmentData.docId === docId) {
      // Update the appointment to mark as completed
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });

      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Marking Appointment as Completed Failed" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};


  const appointmentCancel = async (req,res) => {
    try {
      const { docId, appointmentId } = req.body;
  
      // Await the appointment data retrieval
      const appointmentData = await appointmentModel.findById(appointmentId);


  
      // Check if appointment data exists and if docId matches
      if (appointmentData && appointmentData.docId === docId) {
        // Cancel the appointment
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
        return res.json({ success: true, message: "Appointment Cancelled" });
      } else {
        return res.json({ success: false, message: "Cancellation Failed" });
      }
    } catch (error) {
      console.log(error);
      return res.json({ success: false, message: error.message });
    }
  };
  
  const doctorDashboard = async (req, res) => {
    try {
      const { docId } = req.body;
  
      const appointments = await appointmentModel.find({ docId });
  
      if (!appointments || appointments.length === 0) {
        return res.json({ success: false, message: "No appointments found" });
      }
  
      let earnings = 0;
  
      // Using map to calculate earnings
      appointments.map((item) => {
        if (item.isCompleted === true) {
          earnings += item.amout;
        }
        return item; // Return something to satisfy map
      });
  
      let patients = [];
  
      // Using map to get unique patients
      appointments.map((item) => {
        if (!patients.includes(item.userId)) {
          patients.push(item.userId);
        }
        return item; // Return something to satisfy map
      });
  
      // Prepare dashData after processing all appointments
      const dashData = {
        earnings,
        appointments: appointments.length,
        patients: patients.length,
        latestAppointments: [...appointments].reverse().slice(0, 5), // Use slice and reverse without mutating the original array
      };
  
      // Send response with dashboard data
      return res.json({ success: true, data: dashData });
  
    } catch (error) {
      console.log(error);
      return res.json({ success: false, message: error.message });
    }
  };
  

  //api to get doctor profile for doctor anel
  const doctorProfile = async (req,res)=>{
    try {
      const {docId} = req.body
      const profileData = await doctorModel.findById(docId).select('-password')

      res.json({success:true,profileData})

      
    } catch (error) {
      console.log(error);
      return res.json({ success: false, message: error.message });
      
    }
  }

  const updateDoctorProfile = async (req, res) => {
    try {
      const {docId,fees,address,available} = req.body

      await doctorModel.findByIdAndUpdate(docId,{fees,address,available})

      res.json({success:true,message:"Profile Updated"})

    } catch (error) {
      console.log(error);
      return res.json({ success: false, message: error.message });
      
    }
  }
  
export { changeAvailablity, doctorList , loginDoctors , appointmentsDoctor,appointmentComplete,appointmentCancel,doctorDashboard,updateDoctorProfile,doctorProfile}