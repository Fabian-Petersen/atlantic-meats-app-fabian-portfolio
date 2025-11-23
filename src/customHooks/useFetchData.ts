// $ Create a custom hook to fetch data from the API
import { useState, useEffect } from "react";
import axios from "axios";

// Define the custom hook to fetch data
export const useFetchData = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Create a type for the expected response structure
  interface ApiResponse {
    body: string; // body contains the stringified JSON
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(url);
        const parsedData = response.data.body
          ? JSON.parse(response.data.body)
          : response.data;
        setData(parsedData);
        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError(String(error));
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [url]); // Re-run the effect when the URL changes

  return { data, loading, error };
};
