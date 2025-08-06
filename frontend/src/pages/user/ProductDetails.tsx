import React from 'react'
import Header from '../../component/shop/Header'
import { BsExclamation } from 'react-icons/bs';
import Rating from '../../component/shop/Rating';

const ProductDetails:React.FC = () => {
  return (
    <div className="px-4 sm:px-5 md:px-15 lg:px-25">
      <div className="md:-mt-11">
        <Header text="" header="" headerTwo="" textTwo="" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 lg:gap-10 md:-mt-8 h-auto -mt-13 mb-10">
        <div className="w-full h-full">
          <img
            src="/ronkz.jpg"
            alt="product-image"
            className="h-full w-full object-cover rounded-2xl"
          />
        </div>
        <div className="flex flex-col space-y-3">
          <div className="background w-fit rounded-full border border-gray-200 shadow shadow-gray-200">
            <p className="text-gray-700 py-1 px-2 text-center">Gown</p>
          </div>

          <div>
            <h3 className="text-gray-900 capitalize text-2xl md:text-4xl">
              Latest Ankara Fashion Gown
            </h3>
          </div>
          <div>
            <h4 className="text-2xl md:text-4xl font-medium">₦ 20,000</h4>
          </div>
          <div className="flex flex-row space-x-3 items-center w-full background shadow shadow-gray-200 p-2 rounded-full">
            <span>
              <BsExclamation size={20} className="text-gray-500 " />
            </span>
            <p className="text-gray-500 text-base md:text-lg">
              {" "}
              Order this and get it delivered the next day
            </p>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold text-2xl md:text-3xl mb-2">
              Description
            </h4>
            <p className="text-base md:text-lg text-gray-500">
              This stunning Ankara native gown celebrates the rich heritage of
              African fashion with vibrant, hand-selected wax print fabric
              featuring bold geometric patterns in warm earth tones of
              terracotta, golden yellow, and deep indigo blue. The flowing
              silhouette honors traditional Nigerian dress while incorporating
              contemporary tailoring for a flattering, comfortable fit. The gown
              features a gracefully flared A-line cut that falls to ankle
              length, with three-quarter sleeves adorned with delicate gathered
              cuffs. The neckline is elegantly designed with a subtle V-shape,
              beautifully framed by coordinating fabric trim. A defined
              waistline creates a feminine silhouette while allowing for ease of
              movement.
            </p>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold text-2xl md:text-3xl mb-2">
              Measurements
            </h4>
            <div className="flex space-x-2 md:space-x-4 flex-wrap space-y-3">
              <p className="text-500 font-bold md:text-lg">Breast: 40cm</p>
              <p className="text-500 font-bold md:text-lg">hand: 20cm</p>
              <p className="text-500 font-bold md:text-lg">Length: 80cm</p>
              <p className="text-500 font-bold md:text-lg">Waist: 38cm</p>
            </div>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold text-2xl md:text-3xl mb-2">
              Shipping Fee
            </h4>
            <p className="text-base md:text-lg text-gray-500">
              Payment on delivery to the bus driver
            </p>
          </div>
          <div className="flex justify-between items-center w-full">
            <div className='w-[45%]'>
              <button className="bg-yellow-500 p-3 w-full text-center text-gray-50">
                Add to Cart
              </button>
            </div>

            <div className='w-[45%]'>
              <button className="bg-gray-500 p-3 w-full text-center text-gray-50">
                Custom Order
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Rating/>
      </div>
    </div>
  );
}

export default ProductDetails
