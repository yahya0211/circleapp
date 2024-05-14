import { useEffect, useState, ReactNode } from "react";
import { API } from "../utils/api";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import Main from "../layout/Main";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import SearchPage from "../pages/SearchPage";
import ProfilePage from "../pages/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage";
import ReplyPage from "../pages/ReplyPage";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { authCheckAsync } from "../redux/auth";
import Auth from "../layout/Auth";

function Router() {
  const [checkAuthFinish, setCheckAuthFinish] = useState<boolean>(true);
  const jwtToken = localStorage.getItem("jwtToken");
  const dispatch = useAppDispatch();

  async function authCheck() {
    try {
      if (jwtToken) {
        await dispatch(authCheckAsync(jwtToken));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCheckAuthFinish(false);
    }
  }

  useEffect(() => {
    // Jika user melakukan login, akan mengecek apakah jwt token ada
    // jika ada akan menjalankan fungsi check
    // jika tidak ada maka setCheckFinish menjadi false
    authCheck();
  }, []);

  return (
    <>
      {/* {checkAuthFinish && (
        <Flex justifyContent={"center"} alignItems={"center"} h={"100vh"} w={"100vh"}>
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" w={"70px"} h={"70px"} />
        </Flex>
      )} */}
      {!checkAuthFinish && (
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route
                index
                element={
                  <>
                    <Main>
                      <HomePage />
                    </Main>
                  </>
                }
              />
            </Route>

            <Route path="/reply/:threadId">
              <Route
                index
                element={
                  <>
                    <Main>
                      <ReplyPage />
                    </Main>
                  </>
                }
              />
            </Route>
            <Route path="/search">
              <Route
                index
                element={
                  <>
                    <Main>
                      <SearchPage />
                    </Main>
                  </>
                }
              />
            </Route>

            <Route path="/profile/:userId">
              <Route
                index
                element={
                  <>
                    <Main>
                      <ProfilePage />
                    </Main>
                  </>
                }
              />
            </Route>

            <Route path="/my-profile/:userId">
              <Route
                index
                element={
                  <>
                    <Main>
                      <ProfilePage />
                    </Main>
                  </>
                }
              />
            </Route>

            <Route path="/edit-profile">
              <Route
                index
                element={
                  <>
                    <Main>
                      <EditProfilePage />
                    </Main>
                  </>
                }
              />
            </Route>

            <Route
              path="/register"
              element={
                <Auth>
                  <RegisterPage />
                </Auth>
              }
            ></Route>
            <Route
              path="/login"
              element={
                <Auth>
                  <LoginPage />
                </Auth>
              }
            ></Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default Router;
