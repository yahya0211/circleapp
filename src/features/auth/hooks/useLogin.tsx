import { useState, ChangeEvent } from "react";
import getError from "../../../utils/GetError";
import { API } from "../../../utils/api";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../redux/store";
import { getDetailUser } from "../../../redux/user/detailUserSlice";
import { loginAsync } from "../../../redux/auth";
import { useNavigate } from "react-router-dom";
import { SubmitHandler } from "react-hook-form";
import { IFormInput, useLoginModal, useLoginValidation } from "../../../lib/loginValidation";
import { getProfile } from "../../../redux/user/profileSlice";

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  interface ILoginFormProps {
    callback: () => void;
  }

  const LoginForm: React.FC<ILoginFormProps> = ({ callback }) => {
    const dispatch = useAppDispatch();
    const { control, reset, handleSubmit } = useLoginValidation();
  };

  const handleLogin: SubmitHandler<IFormInput> = async (data) => {
    try {
      const token = (await dispatch(loginAsync(data))).payload;

      console.log("token get before get profile", token);
      await dispatch(loginAsync(form));

      callback();

      toast.success("Login Success", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setIsError(false);
      setError("");
      setisLoginSuccess(true);
      navigate("/");
    } catch (error: any) {
      setIsError(true);
      setError(getError(error));
    } finally {
      setIsLoading(false);
      // window.setTimeout(() => location.reload(), 3000);
    }
  };
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
