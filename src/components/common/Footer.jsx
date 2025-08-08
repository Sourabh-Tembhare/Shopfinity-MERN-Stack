import React from "react";
import { FaInstagram, FaEnvelope, FaLock, FaMapMarkerAlt } from "react-icons/fa";
import { SiShopify } from "react-icons/si";
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="bg-richblack-800 text-richblack-100 py-10 px-4 md:px-8 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* About */}
        <div>
        <Link to="/" className="flex items-center  mb-2">
                 <SiShopify size={30} />
                 <span className="text-2xl sm:text-3xl font-bold">hopfinity</span>
               </Link>
       
          <p className="text-sm leading-relaxed">
            Shopfinity is your trusted online marketplace for quality products at affordable prices.
            Discover top deals and categories tailored for you.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="text-sm space-y-2">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/aboutUs" className="hover:text-white transition">About Us</Link></li>
            <li><Link to="/contactUs" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3">Support</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-yellow-50" />
              <a href="mailto:sourabhtembhare65@gmail.com" className="hover:text-white">
                sourabhtembhare65@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-yellow-50" />
              <span>India</span>
            </li>
            <li className="flex items-center gap-2">
              <FaLock className="text-yellow-50" />
              <span>100% Secure Payments</span>
            </li>
          </ul>
        </div>

        {/* Social & Credits */}
        <div>
          <h4 className="text-white font-semibold mb-3">Connect with Us</h4>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/sourabh_tembhare18?igsh=N2R1Zjk4d3hrZnlk"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-200 text-xl"
            >
              <FaInstagram />
            </a>
          </div>
          <p className="mt-6 text-xs text-richblack-200">
            Built with ❤️ by <span className="text-white font-semibold">Sourabh Tembhare</span>
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-richblack-700 mt-10 pt-4 text-center text-xs text-richblack-300">
        © {new Date().getFullYear()} Shopfinity. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
