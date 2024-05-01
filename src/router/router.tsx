import { useEffect, useState, ReactNode } from "react";
import { API } from "../utils/api";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import Main from "../layout/Main";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import SearchPage from "../pages/SearchPage";

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
    } finally {
      setCheckAuthFinish(false);
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
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" w={"70px"} h={"70px"} />
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
            <Route path="/search">
              <Route
                index
                element={
                  <IsLogin>
                    <Main>
                      <SearchPage />
                    </Main>
                  </IsLogin>
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
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default router;
