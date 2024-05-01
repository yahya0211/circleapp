import { Fragment } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../redux/store";
import { API } from "../utils/api";
import getError from "../utils/GetError";
import { IoHomeOutline, IoHome } from "react-icons/io5";
import { ImSearch } from "react-icons/im";
import { RiSearchFill } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { FaUserAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import Swal from "sweetalert2";

interface SidebarDrawerInterface {
  closeDrawer: () => void;
}

export default function SidebarDrawer(props: SidebarDrawerInterface) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: profile } = useAppSelector((state) => state.profile);
  // const deleteAccount = async () => {
  //     try{
  //         await API.delete("deleteUser")
  //     }
  // }

  return (
    <Fragment>
      <Box py={10} px={50} borderRight={"3px solid #fffff"} overflow={"auto"} className="hide-scroll" color={"white"} h={"100%"}>
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
              Profile
            </Text>
          </Box>
        </Link>

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
      </Box>
    </Fragment>
  );
}
