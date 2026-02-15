import { type LoginFormValues } from "../schemas";
import axios from "axios";

const login = async (values: LoginFormValues) => {
  const { email, password } = values;

  const response = await axios.post(
    "/api/login",
    { email, password },
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = response.data;
  return data;
};

export default login;
