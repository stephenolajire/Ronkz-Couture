import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Star,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";
import React, { useState } from "react";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden px-4 sm:px-8 md:px-16 lg:px-32 ">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen py-10">
        <div className="w-full">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-full mb-6 shadow-lg">
              <Star className="w-5 h-5 mr-3" />
              <span className="font-semibold text-sm md:text-base">
                Let's Create Something Beautiful Together
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Get In
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                {" "}
                Touch
              </span>
            </h1>

            <p className="text-xl text-gray-200 font-light max-w-3xl mx-auto leading-relaxed">
              Ready to bring your fashion vision to life? Whether it's a bespoke
              wedding gown, custom tailoring, or a complete wardrobe makeover,
              let's discuss your dream project.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-black border-opacity-20 shadow-2xl">
              <h2 className="text-3xl font-bold text-black mb-6">
                Send a Message
              </h2>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-700">
                    Thank you for reaching out. We'll get back to you within 24
                    hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-black font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white bg-opacity-10 border border-black border-opacity-30 rounded-lg px-4 py-3 text-black placeholder-gray-700 focus:outline-none focus:border-yellow-400 focus:bg-opacity-20 transition-all duration-300"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-black font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white bg-opacity-10 border border-black border-opacity-30 rounded-lg px-4 py-3 text-black placeholder-gray-700 focus:outline-none focus:border-yellow-400 focus:bg-opacity-20 transition-all duration-300"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-black font-medium mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-white bg-opacity-10 border border-black border-opacity-30 rounded-lg px-4 py-3 text-black placeholder-gray-700 focus:outline-none focus:border-yellow-400 focus:bg-opacity-20 transition-all duration-300"
                        placeholder="+234 xxx xxx xxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-black font-medium mb-2">
                        Service Needed
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white bg-opacity-10 border border-black border-opacity-30 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-yellow-400 focus:bg-opacity-20 transition-all duration-300"
                      >
                        <option value="" className="bg-black">
                          Select a service
                        </option>
                        <option value="bridal" className="bg-black">
                          Bridal Couture
                        </option>
                        <option value="custom" className="bg-black">
                          Custom Tailoring
                        </option>
                        <option value="alterations" className="bg-black">
                          Alterations
                        </option>
                        <option value="consultation" className="bg-black">
                          Design Consultation
                        </option>
                        <option value="other" className="bg-black">
                          Other
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-black font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full bg-white bg-opacity-10 border border-black border-opacity-30 rounded-lg px-4 py-3 text-black placeholder-gray-700 focus:outline-none focus:border-yellow-400 focus:bg-opacity-20 transition-all duration-300 resize-none"
                      placeholder="Tell us about your project, timeline, budget, or any specific requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold text-lg px-8 py-4 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-black border-opacity-20 shadow-2xl">
                <h2 className="text-3xl font-bold text-black mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-black font-semibold mb-1">
                        Studio Address
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Plot 123, Fashion District
                        <br />
                        Wuse II, Abuja, FCT
                        <br />
                        Nigeria
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-black font-semibold mb-1">
                        Phone & WhatsApp
                      </h3>
                      <p className="text-gray-700">+234 813 456 7890</p>
                      <p className="text-gray-700">+234 909 123 4567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-black font-semibold mb-1">Email</h3>
                      <p className="text-gray-700">hello@fashiondesigner.com</p>
                      <p className="text-gray-700">
                        bridal@fashiondesigner.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-black font-semibold mb-1">
                        Studio Hours
                      </h3>
                      <div className="text-gray-700 space-y-1">
                        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p>Saturday: 10:00 AM - 4:00 PM</p>
                        <p>Sunday: By Appointment Only</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media & Quick Actions */}
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-black border-opacity-20 shadow-2xl">
        <h3 className="text-2xl font-bold text-black mb-6">
          Follow Our Journey
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-pink-600 text-black font-medium px-6 py-3 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Instagram className="w-5 h-5" />
            Instagram
          </button>

          <button className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-black font-medium px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Facebook className="w-5 h-5" />
            Facebook
          </button>
        </div>

        <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-black font-medium px-6 py-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          <MessageCircle className="w-5 h-5" />
          Chat on WhatsApp
        </button>

        <div className="mt-6 pt-6 border-t border-black border-opacity-20">
          <p className="text-gray-700 text-sm text-center leading-relaxed">
            Typically replies within 2-4 hours during business hours. For urgent
            requests, please call or WhatsApp us directly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
