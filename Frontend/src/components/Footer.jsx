import React from "react";
import { assets } from "../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";

const Footer = () => {

    const navigate = useNavigate()

  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* left section  */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem ipsum dolor sit amet, sit saepe totam voluptatibus minus
            praesentium beatae consequatur vero. Eos commodi fugit eligendi
            praesentium voluptates
          </p>
        </div>

        {/* Center section  */}
        <div>
            <p className="text-xl font-medium mb-5">COMPANY</p>
            <ul className="flex flex-col gap-2 text-gray-600 cursor-pointer">
                <li onClick={()=>navigate('/')}>Home</li>
                <li onClick={()=>navigate('/about')}>About Us </li>
                <li onClick={()=>navigate('/contact')}>Contact Us</li>
                <li onClick={()=>navigate('/privacy')}>Privacy Policy</li>
            </ul>
        </div>

        {/* right section   */}
        <div>
            <p  className="text-xl font-medium mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap-2 text-gray-600">
                <li>+1-212-456-7890</li>
                <li>diyatest123@gmail.com</li>
            </ul>
        </div>
      </div>

      {/* Copyright Text  */}
      <div>
        <hr />
        <p className="py-5 test-sm text-center">Copyright 2025@Diya Patel-All Right Reserved. </p>
      </div>
    </div>
  );
};

export default Footer;
