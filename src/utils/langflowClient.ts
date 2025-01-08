import axios from 'axios';

export const runFlow = async (message: string) => {
  try {
    const payload = { message }; // Ensure it matches the backend Pydantic model
    const response = await axios.post('https://quantify-c5sn.onrender.com', payload);
    console.log("API Response:", response.data); // Debugging purpose
    return response.data.outputs[0].outputs[0].results.message.text;
  } catch (error) {
    console.error("Error calling backend:", error);
    throw new Error("Failed to fetch response from the server.");
  }
};
