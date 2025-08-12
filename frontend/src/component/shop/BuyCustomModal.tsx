import React, { useState } from "react";
import { X } from "lucide-react";

interface BuyCustomProp {
  close: () => void;
}

const BuyCustomModal:React.FC <BuyCustomProp> = ({ close }) => {
  const [measurements, setMeasurements] = useState({
    chest: "",
    waist: "",
    hips: "",
    height: "",
    inseam: "",
    neck: "",
    arms: "",
    shoulders: "",
  });

  const handleInputChange = (field:any, value:any) => {
    setMeasurements((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Handle form submission here
    console.log("Measurements submitted:", measurements);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl mx-4 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Custom Measurements
          </h2>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={close}
            aria-label="Close modal"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="border border-gray-200 rounded-xl p-5 mb-5">
            <h3 className="text-gray-900 text-2xl md:text-3xl md:my-5 mt-0 my-3">
              Measurements
            </h3>
            <p className="text-gray-500 my-3">
              Please provide your measurements in inches. If you're unsure, we
              can schedule a fitting consultation.
            </p>

            <div className="flex flex-col space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label
                    htmlFor="chest"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Bust/Chest
                  </label>
                  <input
                    id="chest"
                    type="number"
                    step="0.25"
                    min="0"
                    placeholder="inches"
                    value={measurements.chest}
                    onChange={(e) => handleInputChange("chest", e.target.value)}
                    className="w-full border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="waist"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Waist
                  </label>
                  <input
                    id="waist"
                    type="number"
                    step="0.25"
                    min="0"
                    placeholder="inches"
                    value={measurements.waist}
                    onChange={(e) => handleInputChange("waist", e.target.value)}
                    className="w-full border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="hips"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hips
                  </label>
                  <input
                    id="hips"
                    type="number"
                    step="0.25"
                    min="0"
                    placeholder="inches"
                    value={measurements.hips}
                    onChange={(e) => handleInputChange("hips", e.target.value)}
                    className="w-full border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="height"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Height
                  </label>
                  <input
                    id="height"
                    type="number"
                    step="0.25"
                    min="0"
                    placeholder="inches"
                    value={measurements.height}
                    onChange={(e) =>
                      handleInputChange("height", e.target.value)
                    }
                    className="w-full border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label
                    htmlFor="inseam"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Inseam
                  </label>
                  <input
                    id="inseam"
                    type="number"
                    step="0.25"
                    min="0"
                    placeholder="inches"
                    value={measurements.inseam}
                    onChange={(e) =>
                      handleInputChange("inseam", e.target.value)
                    }
                    className="w-full border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="neck"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Neck
                  </label>
                  <input
                    id="neck"
                    type="number"
                    step="0.25"
                    min="0"
                    placeholder="inches"
                    value={measurements.neck}
                    onChange={(e) => handleInputChange("neck", e.target.value)}
                    className="w-full border border-gray-200 p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="arms"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Arms
                  </label>
                  <input
                    id="arms"
                    type="number"
                    step="0.25"
                    min="0"
                    placeholder="inches"
                    value={measurements.arms}
                    onChange={(e) => handleInputChange("arms", e.target.value)}
                    className="w-full border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="shoulders"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Shoulders
                  </label>
                  <input
                    id="shoulders"
                    type="number"
                    step="0.25"
                    min="0"
                    placeholder="inches"
                    value={measurements.shoulders}
                    onChange={(e) =>
                      handleInputChange("shoulders", e.target.value)
                    }
                    className="w-full border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={close}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCustomModal;
