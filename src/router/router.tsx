import { useEffect, useState, ReactNode } from "react";
import Register from "../features/auth/component/register";
import LoginPage from "../pages/LoginPage";
import { API } from "../utils/api";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import HomePage from "../pages/HomePage";
import Main from "../layout/Main";
import Login from "../features/auth/component/login";
import RegisterPage from "../pages/RegisterPage";

function router() {
  const [checkAuthFinish, setCheckAuthFinish] = useState<boolean>(true);
  const jwtToken = localStorage.getItem("jwtToken");

  async function authCheck() {
    try {
      await API.get("check", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
    } catch (error) {
      localStorage.clear();
      return <Navigate to="/login" />;
    }
  }

  useEffect(() => {
    // Jika user melakukan login, akan mengecek apakah jwt token ada
    // jika ada akan menjalankan fungsi check
    // jika tidak ada maka setCheckFinish menjadi false
    if (jwtToken) {
      authCheck();
    } else {
      setCheckAuthFinish(false);
    }
  }, [jwtToken]);

  function IsLogin({ children }: { children: ReactNode }) {
    if (jwtToken) {
      return <>{children}</>;
    }
    return <Navigate to="/login" />;
  }
  function IsNotLogin({ children }: { children: ReactNode }) {
    if (!jwtToken) {
      return <>{children}</>;
    }
    return <Navigate to="/" />;
  }

  return (
    <>
      {checkAuthFinish && (
        <Flex justifyContent={"center"} alignItems={"center"} h={"100vh"} w={"100vh"}>
          <Spinner thickness="4px" speed="0.80s" emptyColor="grey.200" color="blue.500" w={"70px"} h={"70px"} />
        </Flex>
      )}
      {!checkAuthFinish && (
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route
                index
                element={
                  <IsLogin>
                    <Main>
                      <HomePage />
                    </Main>
                  </IsLogin>
                }
              />
            </Route>
            <Route path="/login">
              <Route
                index
                element={
                  <IsNotLogin>
                    <LoginPage />
                  </IsNotLogin>
                }
              />
            </Route>
            <Route path="/register">
              <Route
                index
                element={
                  <IsNotLogin>
                    <RegisterPage />
                  </IsNotLogin>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default router;
