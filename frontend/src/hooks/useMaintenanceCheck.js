import { useState, useEffect } from "react";
import axios from "../api/axios";

export const useMaintenanceCheck = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const response = await axios.get("/settings/maintenance-status");
        if (response) {
          if (response.data.is_mantainance === true) {
            setIsMaintenance(response.data.is_mantainance);
          }
        }
      } catch (error) {
        console.error("Failed to check maintenance status:", error.message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    checkMaintenance();
  }, []);

  return { isMaintenance, loading };
};
