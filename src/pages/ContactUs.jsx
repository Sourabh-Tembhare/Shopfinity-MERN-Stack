import React, { useState } from 'react';
import { FaMapMarkerAlt, FaInstagram, FaEnvelope, FaPaperPlane, FaClock, FaHeadset } from 'react-icons/fa';
import { FiAlertCircle } from 'react-icons/fi';
import Footer from '../components/common/Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
    
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 1500);
    }
  };

  return (
    <div className="bg-richblack-900 min-h-screen text-richblack-5">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-richblack-800 to-richblue-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl font-inter mb-6">
            24/7 <span className="text-yellow-50">Customer Support</span>
          </h1>
          <p className="text-xl text-richblack-200 max-w-3xl mx-auto leading-relaxed">
            We're always here to help you with any questions or concerns
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="py-16 bg-richblack-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold font-inter mb-6">
                Bhopal <span className="text-yellow-50">Headquarters</span>
              </h2>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaMapMarkerAlt className="w-6 h-6 text-richblue-200" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-richblack-5">Our Location</h3>
                    <p className="mt-1 text-richblack-200">
                      Shopfinity Headquarters<br />
                      E-Commerce Park, Bhopal<br />
                      Madhya Pradesh, 462001
                    </p>
                  </div>
                </div>

                {/* Support */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaHeadset className="w-6 h-6 text-caribbeangreen-200" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-richblack-5">Customer Support</h3>
                    <p className="mt-1 text-richblack-200">
                      Available 24 hours, 7 days a week
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaEnvelope className="w-6 h-6 text-pink-200" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-richblack-5">Email Us</h3>
                    <p className="mt-1 text-richblack-200">
                      <a href="mailto:sourabhtembhare65@gmail.com" className="hover:text-yellow-50 transition-colors">
                        sourabhtembhare65@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaClock className="w-6 h-6 text-yellow-50" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-richblack-5">Always Open</h3>
                    <p className="mt-1 text-richblack-200">
                      Our digital doors never close<br />
                      Support available round the clock
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <h3 className="text-lg font-medium text-richblack-5 mb-4">Connect Directly</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://www.instagram.com/sourabh_tembhare18?igsh=N2R1Zjk4d3hrZnlk" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-richblack-800 p-3 rounded-full hover:bg-richblack-700 transition-colors"
                  >
                    <FaInstagram className="w-5 h-5 text-pink-200" />
                  </a>
                  <a 
                    href="mailto:sourabhtembhare65@gmail.com" 
                    className="bg-richblack-800 p-3 rounded-full hover:bg-richblack-700 transition-colors"
                  >
                    <FaEnvelope className="w-5 h-5 text-richblue-200" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-richblack-800 rounded-lg shadow-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold font-inter mb-6">
                Quick <span className="text-yellow-50">Response</span>
              </h2>
              
              {submitSuccess ? (
                <div className="bg-caribbeangreen-900 text-caribbeangreen-100 p-4 rounded-lg mb-6">
                  Thank you for your message! We typically respond within 1 hour, 24/7.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-richblack-200 mb-1">
                      Your Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`bg-richblack-700 border ${errors.name ? 'border-pink-500' : 'border-richblack-600'} rounded-lg w-full p-3 text-richblack-5 focus:ring-2 focus:ring-yellow-50 focus:border-transparent`}
                        placeholder="Enter your name"
                      />
                      {errors.name && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiAlertCircle className="h-5 w-5 text-pink-500" />
                        </div>
                      )}
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-pink-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-richblack-200 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`bg-richblack-700 border ${errors.email ? 'border-pink-500' : 'border-richblack-600'} rounded-lg w-full p-3 text-richblack-5 focus:ring-2 focus:ring-yellow-50 focus:border-transparent`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiAlertCircle className="h-5 w-5 text-pink-500" />
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-pink-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-richblack-200 mb-1">
                      Subject
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`bg-richblack-700 border ${errors.subject ? 'border-pink-500' : 'border-richblack-600'} rounded-lg w-full p-3 text-richblack-5 focus:ring-2 focus:ring-yellow-50 focus:border-transparent`}
                        placeholder="What's this about?"
                      />
                      {errors.subject && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiAlertCircle className="h-5 w-5 text-pink-500" />
                        </div>
                      )}
                    </div>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-pink-500">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-richblack-200 mb-1">
                      Your Message
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        className={`bg-richblack-700 border ${errors.message ? 'border-pink-500' : 'border-richblack-600'} rounded-lg w-full p-3 text-richblack-5 focus:ring-2 focus:ring-yellow-50 focus:border-transparent`}
                        placeholder="How can we help you?"
                      ></textarea>
                      {errors.message && (
                        <div className="absolute top-3 right-3">
                          <FiAlertCircle className="h-5 w-5 text-pink-500" />
                        </div>
                      )}
                    </div>
                    {errors.message && (
                      <p className="mt-1 text-sm text-pink-500">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-yellow-50 text-richblack-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-100 transition-colors flex items-center justify-center w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-richblack-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="mr-2" />
                          Send Message (24/7 Response)
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-richblack-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold font-inter mb-6 text-center">
            Our <span className="text-yellow-50">Bhopal Location</span>
          </h2>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <iframe
              title="Shopfinity Bhopal Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.716347968358!2d77.41288931502967!3d23.18535588486826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c428f8fd68fbd%3A0x21543965c50c2c21!2sBhopal%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ContactUs;