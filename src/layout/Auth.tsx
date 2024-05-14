import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Auth: FC<Props> = ({ children }) => {
  const auth = useAppSelector((state) => state.auth);

  if (auth.isLogin) {
    return <Navigate to={"/"} />;
  }

  return <>{children}</>;
};

export default Auth;
