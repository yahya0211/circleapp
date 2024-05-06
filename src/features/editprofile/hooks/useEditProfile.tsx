import { useState, ChangeEvent, useEffect } from "react";
import { API } from "../../../utils/api";
import { toast } from "react-toastify";
import getError from "../../../utils/GetError";
import { useAppSelector } from "../../../redux/store";

export function useEditProfile() {
  const profile = useAppSelector((state) => state.profile);
  const [form, setForm] = useState<EditProfileType>({
    fullname: "",
    password: "",
    bio: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isEditProfileSuccess, setIsEditProfileSuccess] = useState<boolean>(false);

  useEffect(() => {
    fullname: profile.data?.fullname;
    passsword: "";
    bio: "";
  }, [profile]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  const jwtToken = localStorage.getItem("jwtToken");
  if (!jwtToken) {
    throw new Error("JWT token not found in localStorage");
  }

  const decodeToken = jwtToken.split(".")[1];
  const userData = JSON.parse(atob(decodeToken));
  const idUser = userData?.User?.id;

  async function handleEditProfile() {
    try {
      setIsLoading(true);

      const response = await API.put(`userProfileNoImage/${idUser}`, form, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

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
      setIsError(false);
      setError("");
      setIsEditProfileSuccess(true);
    } catch (error) {
      setIsError(true);
      setError(getError(error));
    } finally {
      setIsLoading(false);
    }
  }

  return {
    form,
    handleChange,
    handleEditProfile,
    isLoading,
    isError,
    error,
    isEditProfileSuccess,
  };
}
