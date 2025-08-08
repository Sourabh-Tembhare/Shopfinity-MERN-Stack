import React from 'react';
import { FaInstagram, FaEnvelope, FaShippingFast, FaShieldAlt, FaMobileAlt, FaHeadset, FaCode, FaLaptopCode } from 'react-icons/fa';
import { GiTakeMyMoney, GiShoppingCart } from 'react-icons/gi';
import founderImage from "../assets/myImage77.jpg";
import { Link } from 'react-router-dom';
import Footer from '../components/common/Footer';

const AboutUs = () => {
  return (
    <div className=" text-richblack-5">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-richblack-800 to-richblue-900 py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl font-inter mb-6">
            Welcome to <span className="text-yellow-50">Shopfinity</span>
          </h1>
          <p className="text-xl text-richblack-200 max-w-3xl mx-auto leading-relaxed">
            A one-developer revolution in e-commerce technology
          </p>
        </div>
      </div>

      {/* Founder Spotlight */}
      <div className="py-20 bg-richblack-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between gap-12">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <img 
                src={founderImage} 
                alt="Sourabh Tembhare"
                className="rounded-lg shadow-xl w-full h-auto object-cover max-w-md mx-auto"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6 font-inter">
                Built by <span className="text-caribbeangreen-100">Sourabh Tembhare</span>
              </h2>
              <p className="text-richblack-100 mb-4">
                As the sole developer and founder of Shopfinity, I've combined my passion for coding with e-commerce expertise to create a full-featured shopping platform from the ground up.
              </p>
              <p className="text-richblack-100 mb-6">
                Every line of code, every design element, and every customer interaction has been carefully crafted by me to deliver a seamless shopping experience that rivals established platforms.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://www.instagram.com/sourabh_tembhare18?igsh=N2R1Zjk4d3hrZnlk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-pink-100 text-pink-900 px-4 py-2 rounded-lg flex items-center hover:bg-pink-200 transition-colors"
                >
                  <FaInstagram  />
                </a>
                <a 
                  href="mailto:sourabhtembhare65@gmail.com" 
                  className="bg-richblue-100 text-richblue-900 px-4 py-2 rounded-lg flex items-center hover:bg-richblue-200 transition-colors"
                >
                  <FaEnvelope  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Development Highlights */}
      <div className="py-20 bg-richblack-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 font-inter">
            Built With <span className="text-yellow-50">Cutting-Edge Technology</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-richblack-800 p-6 rounded-lg shadow-lg border-l-4 border-yellow-50">
              <div className="text-yellow-50 mb-4 text-3xl">
                <FaCode />
              </div>
              <h3 className="text-xl font-bold mb-3">Full-Stack Mastery</h3>
              <p className="text-richblack-200">
                Developed the complete MERN stack solution - MongoDB, Express.js, React, and Node.js powering every aspect of Shopfinity.
              </p>
            </div>
            
            <div className="bg-richblack-800 p-6 rounded-lg shadow-lg border-l-4 border-caribbeangreen-100">
              <div className="text-caribbeangreen-100 mb-4 text-3xl">
                <FaLaptopCode />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-World Features</h3>
              <p className="text-richblack-200">
                Implemented payment gateways, inventory management, user authentication, and responsive design - all as a solo developer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-20 bg-richblack-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 font-inter">
            Shopfinity <span className="text-yellow-50">Features</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-richblack-700 p-6 rounded-lg shadow-lg">
              <div className="text-yellow-50 mb-4 text-3xl">
                <GiShoppingCart />
              </div>
              <h3 className="text-xl font-bold mb-3">Complete Product System</h3>
              <p className="text-richblack-200">
                Built product listings, categories, search, and filtering from scratch with React and Redux.
              </p>
            </div>
            
            <div className="bg-richblack-700 p-6 rounded-lg shadow-lg">
              <div className="text-caribbeangreen-100 mb-4 text-3xl">
                <GiTakeMyMoney />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
              <p className="text-richblack-200">
                Integrated Razorpay and other payment methods with proper order verification flow.
              </p>
            </div>
            
            <div className="bg-richblack-700 p-6 rounded-lg shadow-lg">
              <div className="text-richblue-200 mb-4 text-3xl">
                <FaShippingFast />
              </div>
              <h3 className="text-xl font-bold mb-3">Order Management</h3>
              <p className="text-richblack-200">
                Developed complete order tracking with status updates and history.
              </p>
            </div>
            
            <div className="bg-richblack-700 p-6 rounded-lg shadow-lg">
              <div className="text-pink-200 mb-4 text-3xl">
                <FaShieldAlt />
              </div>
              <h3 className="text-xl font-bold mb-3">User Authentication</h3>
              <p className="text-richblack-200">
                Secure JWT-based login system with protected routes and admin controls.
              </p>
            </div>
            
            <div className="bg-richblack-700 p-6 rounded-lg shadow-lg">
              <div className="text-blue-200 mb-4 text-3xl">
                <FaMobileAlt />
              </div>
              <h3 className="text-xl font-bold mb-3">Responsive Design</h3>
              <p className="text-richblack-200">
                Mobile-first approach using Tailwind CSS for flawless cross-device experience.
              </p>
            </div>
            
            <div className="bg-richblack-700 p-6 rounded-lg shadow-lg">
              <div className="text-caribbeangreen-200 mb-4 text-3xl">
                <FaHeadset />
              </div>
              <h3 className="text-xl font-bold mb-3">Admin Dashboard</h3>
              <p className="text-richblack-200">
                Comprehensive backend for product, order, and user management.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-richblue-900 to-richblack-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 font-inter">
            Experience <span className="text-yellow-50">Solo-Developed Excellence</span>
          </h2>
          <p className="text-lg text-richblack-200 mb-8 max-w-3xl mx-auto">
            See what one dedicated developer can build with passion and technical skill.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={"/"}   className="bg-yellow-50 text-richblack-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-100 transition-colors">
            Explore Products
            </Link>
            <a 
              href="mailto:sourabhtembhare65@gmail.com" 
              className="bg-transparent border-2 border-yellow-50 text-yellow-50 font-bold py-3 px-8 rounded-lg hover:bg-yellow-50 hover:text-richblack-900 transition-colors"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default AboutUs;