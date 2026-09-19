import axios from "axios";
const baseUrl = "http://localhost:3002/api/login";

const login = async (credentials) => {
  console.log("here");
  const response = await axios.post(baseUrl, credentials);
  console.log(response);
  return response.data;
};

export default { login };
