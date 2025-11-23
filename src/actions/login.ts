import { z } from "zod";
import { LoginSchema } from "../schemas";
import axios from "axios";

const login = async (values: z.infer<typeof LoginSchema>) => {
  const { email, password } = values;

  const response = await axios.post(
    "/api/login",
    { email, password },
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = response.data;
  return data;
};

export default login;
