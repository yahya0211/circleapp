// import package

import { Fragment } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../redux/store";
import { API } from "../utils/api";
import getError from "../utils/GetError";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

// import icon
import { IoHomeOutline, IoHome } from "react-icons/io5";
import { ImSearch } from "react-icons/im";
import { RiSearchFill } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { FaUserAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";

interface SidebarDrawerInterface {
  closeDrawer: () => void;
}

interface User {
  id: string;
}

interface JwtPayload {
  User: User;
}

export default function SidebarDrawer(props: SidebarDrawerInterface) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: profile } = useAppSelector((state) => state.profile);

  const jwtToken = localStorage.getItem("jwtToken");
  let idToken: string = "";

  if (jwtToken) {
    try {
      const decodeToken: JwtPayload = jwtDecode(jwtToken);
      idToken = decodeToken.User.id;
    } catch (error) {
      console.log("Error decoding JWT: ", error);
    }
  }

  const deleteAccount = async () => {
    try {
      await API.delete(`deleteUser/${idToken}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      toast.error(getError(error), {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <Fragment>
      <Box py={10} px={50} borderRight={"3px solid #fffff"} overflow={"auto"} className="hide-scroll" color={"white"} h={"100%"}>
        <Flex flexDir={"column"} justifyContent={"space-between"} h={"100%"}>
          <Box>
            <Link to={"/"}>
              <Box display={"flex"} alignItems={"center"} gap={3} mb={6}>
                <Text fontSize={"2xl"}>{location.pathname === "/" ? <IoHome /> : <IoHomeOutline />}</Text>
                <Text fontSize={"md"} mt={1}>
                  Home
                </Text>
              </Box>
            </Link>
            <Link to={"/search"}>
              <Box display={"flex"} alignItems={"center"} gap={3} mb={6}>
                <Text fontSize={"2xl"}>{location.pathname === "/search" ? <RiSearchFill /> : <ImSearch />}</Text>
                <Text fontSize={"md"} mt={1}>
                  Search
                </Text>
              </Box>
            </Link>
            <Link to={`/my-profile/${profile?.id}`}>
              <Box display={"flex"} alignItems={"center"} gap={3} mb={6}>
                <Text fontSize={"2xl"}>{location.pathname === "/my-profile" ? <FaUserAlt /> : <FaRegUser />}</Text>
                <Text fontSize={"md"} mt={1}>
                  My Profile
                </Text>
              </Box>
            </Link>
            {/* Button delete account */}
            <Button
              onClick={() => {
                props.closeDrawer();
                Swal.fire({
                  title: "Do you want to delete this account?",
                  text: "Your account will e removed permanently!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes",
                }).then((result) => {
                  if (result.isConfirmed) {
                    deleteAccount();
                  }
                });
              }}
              display={"flex"}
              gap={3}
              colorScheme="red"
              size={"md"}
              w={"220px"}
              alignItems={"center"}
              justifyContent={"left"}
              borderRadius={"full"}
            >
              <Text fontSize={"2xl"}>
                <RiDeleteBin5Fill />
              </Text>
              <Text fontSize={"md"}>Remove Account</Text>
            </Button>
          </Box>
          <Flex alignItems={"center"} gap={3} mb={6}>
            <Text fontSize={"2xl"}>
              <CiLogout />
            </Text>
            <Text
              fontSize={"md"}
              mt={1}
              cursor={"pointer"}
              onClick={() => {
                props.closeDrawer();
                Swal.fire({
                  title: "Are you sure ?",
                  text: "You will logout from app",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#A3D8FF",
                  cancelButtonColor: "#FDFFC2",
                  confirmButtonText: "Yes, logout!",
                }).then((resault) => {
                  if (resault.isConfirmed) {
                    localStorage.clear();
                    navigate("/login");
                  }
                });
              }}
            >
              Logout
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Fragment>
  );
}
