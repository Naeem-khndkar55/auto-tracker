import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ViewVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVehicles = async () => {
    try {
      const { data } = await axios.get(`/api/vehicles?page=${currentPage}`);
      setVehicles(data.vehicles);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Failed to load vehicles");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [currentPage]);

  return (
    <div className="p-4">
      {vehicles.map((vehicle) => (
        <div key={vehicle._id} className="border p-4 mb-4">
          <h3>{vehicle.ownerName}</h3>
          <a
            href={vehicle.qrCode}
            download
            className="bg-blue-500 text-white p-2 rounded"
          >
            Download QR
          </a>
        </div>
      ))}
      {/* Pagination Controls */}
      <div className="flex gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
