import { Star, Scissors, Heart, Award } from "lucide-react";
import React from "react";

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Content Overlay */}
      <div className="relative z-10 h-full min-h-screen flex bg-black">
        {/* Left Content */}
        <div className="w-full lg:w-3/5 flex flex-col justify-center gap-6 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-20">
          {/* Premium Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-full w-fit shadow-lg">
            <Award className="w-5 h-5 mr-3" />
            <span className="font-semibold text-sm md:text-base">
              Award-Winning Fashion Designer
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Crafting
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                Couture Dreams
              </span>
            </h1>
            <div className="flex items-center gap-3 text-yellow-400">
              <Scissors className="w-6 h-6" />
              <span className="text-lg md:text-xl font-medium">
                From Sketch to Runway
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-200 font-light max-w-2xl leading-relaxed">
            Experience the artistry of bespoke African fashion. From the first
            stitch to the final fitting, watch your vision come to life through
            masterful craftsmanship and innovative design.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
            <div className="flex items-center gap-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <Scissors className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-500 font-medium">Custom Tailoring</span>
            </div>
            <div className="flex items-center gap-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <Heart className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-500 font-medium">Bridal Couture</span>
            </div>
            <div className="flex items-center gap-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <Star className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-500 font-medium">Premium Fabrics</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={() => (window.location.href = "/shop")}
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold text-lg px-8 py-4 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View Portfolio
            </button>

            <button
              onClick={() => (window.location.href = "/consultation")}
              className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-semibold text-lg px-8 py-4 rounded-lg hover:bg-white hover:text-black transition-all duration-300"
            >
              Book Consultation
            </button>
          </div>
        </div>

        {/* Right Stats Panel */}
        <div className="hidden lg:flex lg:w-2/5 items-center justify-center">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 mx-8 border border-white border-opacity-20">
            <div className="grid grid-cols-1 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  500+
                </div>
                <div className="text-white font-medium">Happy Clients</div>
                <div className="text-gray-300 text-sm mt-1">Worldwide</div>
              </div>

              <div className="border-t border-white border-opacity-20 pt-6 text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  150+
                </div>
                <div className="text-white font-medium">Bridal Designs</div>
                <div className="text-gray-300 text-sm mt-1">Custom Made</div>
              </div>

              <div className="border-t border-white border-opacity-20 pt-6 text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  8+
                </div>
                <div className="text-white font-medium">Years Experience</div>
                <div className="text-gray-300 text-sm mt-1">
                  In Fashion Design
                </div>
              </div>

              <div className="border-t border-white border-opacity-20 pt-6 text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  15+
                </div>
                <div className="text-white font-medium">Fashion Shows</div>
                <div className="text-gray-300 text-sm mt-1">Featured In</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Stats */}
      <div className="lg:hidden relative z-10 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 px-6 py-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">500+</div>
            <div className="text-white text-sm">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">150+</div>
            <div className="text-white text-sm">Bridal Designs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">8+</div>
            <div className="text-white text-sm">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">15+</div>
            <div className="text-white text-sm">Fashion Shows</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
