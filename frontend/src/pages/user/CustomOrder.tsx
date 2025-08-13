import React from "react";
import Header from "../../component/shop/Header";

const CustomOrder: React.FC = () => {
  return (
    <div className="">
      <div className="bg-yellow-50 px-4 sm:px-5 md:px-15 lg:px-25 ">
        <Header
          header="Custom"
          headerTwo="Design"
          text="Create a one-of-a-kind piece tailored perfectly to your measurements, style, and"
          textTwo="vision. Let's bring your dream garment to life."
        />
      </div>
      <div className="w-full flex items-center justify-center my-8 md:my-10 lg:my-15 px-4 md:px-0">
        <div className="w-full md:w-[50%]">
          <form className="w-full h-auto">
            <div className="border border-gray-200 rounded-xl p-5 mb-5">
              <h3 className="text-gray-900 text-2xl md:text-3xl md:my-5 mt-0 my-3">
                Contact Information
              </h3>
              <div className="flex flex-col space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstname" className="text-gray-500">
                      Firstname
                    </label>
                    <input
                      type="text"
                      placeholder="Pls enter your firstname"
                      className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="Lastname" className="text-gray-500">
                      Lastname
                    </label>
                    <input
                      type="text"
                      placeholder="Pls enter your lastname"
                      className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstname" className="text-gray-500">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Pls enter your email address"
                      className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="Lastname" className="text-gray-500">
                      Whatsapp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Pls enter your whatsapp number"
                      className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-5 mb-5">
              <h3 className="text-gray-900 text-2xl md:text-3xl md:my-5 mt-0 my-3">
                Design Information
              </h3>
              <div className="flex flex-col space-y-5">
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label htmlFor="firstname" className="text-gray-500">
                      Style Description
                    </label>
                    <textarea
                      cols={4}
                      rows={3}
                      placeholder="Pls write short description for the style"
                      className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                    ></textarea>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstname" className="text-gray-500">
                      Occassion
                    </label>
                    <select className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1">
                      <option value=" ">Select Occassion</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Burial">Burial</option>
                      <option value="Graduation">Graduation</option>
                      <option value="Office">Office</option>
                      <option value="Wedding">Wedding</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="firstname" className="text-gray-500">
                      Budget
                    </label>
                    <select className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1">
                      <option value=" ">Select Budget</option>
                      <option value="Birthday">₦15,000 - ₦25,000</option>
                      <option value="Burial">₦25,000 - ₦30,000</option>
                      <option value="Graduation">₦30,000 - ₦40,000</option>
                      <option value="Office">₦40,000 - ₦50,000</option>
                      <option value="Wedding">₦50,000 +</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="Timeline" className="text-gray-500">
                      Timeline
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-5 mb-5">
              <h3 className="text-gray-900 text-2xl md:text-3xl md:my-5 mt-0 my-3">
                Measurements
              </h3>
              <p className="text-gray-500 my-3">
                Please provide your measurements in inches. If you're unsure, we
                can schedule a fitting consultation.
              </p>
              <div className="flex flex-col space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div>
                    <label htmlFor="chest" className="text-gray-500">
                      Bust/Chest
                    </label>
                    <input
                      type="text"
                      placeholder="inches"
                      className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="waist" className="text-gray-500">
                      Waist
                    </label>
                    <input
                      type="text"
                      placeholder="inches"
                      className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="hips" className="text-gray-500">
                      Hips
                    </label>
                    <input
                      type="text"
                      placeholder="inches"
                      className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="height" className="text-gray-500">
                      Height
                    </label>
                    <input
                      type="text"
                      placeholder="inches"
                      className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div>
                    <label htmlFor="inseam" className="text-gray-500">
                      Inseam
                    </label>
                    <input
                      type="text"
                      placeholder="inches"
                      className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="neck" className="text-gray-500">
                      Neck
                    </label>
                    <input
                      type="text"
                      placeholder="inches"
                      className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="arms" className="text-gray-500">
                      Arms
                    </label>
                    <input
                      type="text"
                      placeholder="inches"
                      className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="shoulders" className="text-gray-500">
                      Shoulders
                    </label>
                    <input
                      type="text"
                      placeholder="inches"
                      className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-5 mb-5">
              <h3 className="text-gray-900 text-2xl md:text-3xl md:my-5 mt-0 my-3">
                Style Image
              </h3>
              <p className="text-gray-500 my-3">
                Please provide the image of the style you want to sew
              </p>
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label htmlFor="image" className="text-gray-500">
                    Image
                  </label>
                  <input
                    type="file"
                    placeholder="provide the style image"
                    className="w-full border h-30 border-gray-300 border-dashed flex items-center justify-center px-2 py-10 outline-yellow-500 rounded-lg mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-5 mb-5">
              <h3 className="text-gray-900 text-2xl md:text-3xl md:my-5 mt-0 my-3">
                Personal Image
              </h3>
              <p className="text-gray-500 my-3">
                Please provide your full picture for reference
              </p>
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label htmlFor="chest" className="text-gray-500">
                    Picture
                  </label>
                  <input
                    type="file"
                    placeholder="provide the style image"
                    className="w-full border border-gray-300 border-dashed flex items-center justify-center px-2 py-10 outline-yellow-500 rounded-lg mt-1"
                  />
                </div>
              </div>
            </div>
            <button className="bg-yellow-500 p-3 text-center w-full rounded-xl text-lg md:text-xl text-white">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomOrder;
