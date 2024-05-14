import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export interface IFormInput {
  email: string;
  password: string;
}

export const useLoginValidation = () => {
  const initialValue: IFormInput = {
    email: "",
    password: "",
  };

  const schema = yup.object().shape({
    email: yup.string().required("Isi email yang benar"),
    password: yup.string().required("Password tidak boleh kosong"),
  });

  return useForm<IFormInput>({
    defaultValues: initialValue,
    resolver: yupResolver(schema),
    mode: "all",
    reValidateMode: "onSubmit",
  });
};
