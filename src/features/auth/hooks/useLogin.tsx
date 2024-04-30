import { useState, ChangeEvent } from "react";
import getError from "../../../utils/GetError";
import { API } from "../../../utils/api";
import { toast } from "react-toastify";

export function useLogin() {
  const [form, setForm] = useState<Login>({
    email: "",
    password: "",
  });
  //menangani penginputan backend ke frontend
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [Error, setError] = useState<string>("");
  const [isLoginSuccess, setisLoginSuccess] = useState<boolean>(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }
  async function handleLogin() {
    try {
      setIsLoading(true);

      const response = await API.post("login", form);
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      localStorage.setItem("jwtToken", response.data.token);
      setIsError(false);
      setError("");
      setisLoginSuccess(true);
    } catch (error: any) {
      setIsError(true);
      setError(getError(error));
    } finally {
      setIsLoading(false);
    }
  }
  return {
    form,
    handleChange,
    handleLogin,
    isLoading,
    isError,
    Error,
    isLoginSuccess,
  };
}
