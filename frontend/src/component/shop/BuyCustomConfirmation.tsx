import React, { useState } from "react";
import BuyCustomModal from "./BuyCustomModal";

interface BuyConfirmationProps {
  close: () => void;
}

const BuyCustomConfirmation:React.FC <BuyConfirmationProps> = ({ close }) => {
  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false);

  const handleProceed = () => {
    setShowMeasurementsModal(true);
  };

  const handleCancel = () => {
    close();
  };

  const handleCloseMeasurements = () => {
    setShowMeasurementsModal(false);
    close(); 
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-800 mb-3">
              Buy with your own specifications
            </h1>
            <p className="text-gray-600 leading-relaxed">
              You are about to buy this product providing your own measurement.
              The measurements provided will be used to sew yours and will be
              delivered immediately after completion.
            </p>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 font-medium">
              Will you like to proceed?
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              No
            </button>
            <button
              onClick={handleProceed}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
            >
              Yes
            </button>
          </div>
        </div>
      </div>

      {showMeasurementsModal && (
        <BuyCustomModal close={handleCloseMeasurements} />
      )}
    </>
  );
};

export default BuyCustomConfirmation;
