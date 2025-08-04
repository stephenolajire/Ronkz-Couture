import React from 'react'

const NewsLetter: React.FC = () => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md h-auto py-15 md:py-20 lg:py-25 px-4 sm:px-5 md:px-15 lg:px-25">
      <h2 className="text-2xl md:text-4xl lg:text-6xl  text-gray-900 text-center">
        Subscribe to Newsletter
      </h2>
      <p className="mt-4 text-lg md:text-2xl text-gray-500 text-center">
        Stay updated with the latest news and exclusive offers from Ronkz
        Couture.
      </p>
      <form className="flex flex-col md:flex-row mt-5 w-full">
        <input
          type="email"
          placeholder="Enter your email"
          className="p-3 md:p-3 rounded-md border border-gray-300 mb-4 md:mb-0 md:mr-4 md:w-[70%] focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg md:text-xl"
        />
        <button className="bg-yellow-500 text-white p-3 md:p-3 rounded-md md:w-[30%] hover:bg-yellow-600 transition duration-300  text-lg md:text-xl">
          Subscribe
        </button>
      </form>
    </div>
  );
}

export default NewsLetter
