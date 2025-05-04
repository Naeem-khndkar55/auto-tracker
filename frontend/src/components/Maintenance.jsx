import React from "react";

const Maintenance = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        🚧 Under Maintenance
      </h1>
      <p className="text-lg text-gray-700 mb-2">
        Our server is temporarily shut down for development.
      </p>
      <p className="text-gray-600">
        Please check back later. Thank you for your patience.
      </p>
    </div>
  );
};

export default Maintenance;
