import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { getDetailUser } from "../../../redux/user/detailUserSlice";
import { getProfile } from "../../../redux/user/profileSlice";
import { API } from "../../../utils/api";
import { Alert, AlertDescription, AlertIcon, Box, Button, Card, CardBody, Flex, Image, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import getError from "../../../utils/GetError";

// icon
import { FiEdit3 } from "react-icons/fi";

export default function Profile() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const jwtToken = localStorage.getItem("jwtToken");

  const { data: detailUser, isLoading, isError, error } = useAppSelector((state) => state.detailUser);
  const { data: profile } = useAppSelector((state) => state.profile);

  // const { data: profile_pict } = useAppSelector((state) => state.profile_pict);

  const [followerArray, setFollowerArray] = useState<any[]>([]);
  const [followingArray, setFollowingArray] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getDetailUser(params.userId || ""));
  }, [params]);

  useEffect(() => {
    const fetchFollowerData = async () => {
      const fetchedFollowerArray = await Promise.all(
        detailUser?.follower.map(async (follower: any) => {
          try {
            const response = await API.get("findByUserId/" + follower.followingId, {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            });
            return response.data.data;
          } catch (error) {
            console.error("Error fetching follower data:", getError(error));
            return null;
          }
        })
      );
      setFollowerArray(fetchedFollowerArray.filter(Boolean));
    };

    const fetchFollowingData = async () => {
      const fetchedFollowingArray = await Promise.all(
        detailUser?.followwing.map(async (followwing) => {
          try {
            const response = await API.get("findByUserId/" + followwing.followerId, {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            });
            return response.data.data;
          } catch (error) {
            console.error("Error fetching following data:", getError(error));
            return null;
          }
        })
      );
      setFollowingArray(fetchedFollowingArray.filter(Boolean));
    };

    if (detailUser) {
      fetchFollowerData();
      fetchFollowingData();
    }
  }, [detailUser, jwtToken]);

  const followAndUnfollow = async () => {
    try {
      await API.post("follow/" + params.userId, "", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      dispatch(getDetailUser(params.userId || ""));
      dispatch(getProfile());
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
      <Box flex={1} px={5} py={10} overflow={"auto"} className="hide-scroll">
        <Card bg={"#3a3a3a"} color={"white"} mb={"15px"}>
          <CardBody py={4} px={5}>
            <Text fontSize={"2xl"} mb={"10px"}>
              Profile
            </Text>
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                {isError ? (
                  <Alert status="error" bg={"#FF6969"} mb={3} borderRadius={5}>
                    <AlertIcon color={"white"} />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Box position={"relative"}>
                      <Image src="https://assets-global.website-files.com/5a9ee6416e90d20001b20038/635ab99b5920d1d2c6e04397_horizontal%20(66).svg" alt="Green Gradient" borderRadius={"10px"} w={"100%"} h={"80px"} objectFit={"cover"} />

                      <Image
                        borderRadius={"full"}
                        bgColor={"#3a3a3a"}
                        border={"5px solid #3a3a3a"}
                        boxSize={"75px"}
                        objectFit={"cover"}
                        src={detailUser?.photo_profile}
                        alt={detailUser?.fullname}
                        position={"absolute"}
                        top={"40px"}
                        left={"20px"}
                      />

                      {profile?.id === detailUser?.id && (
                        <Link to={`/edit-profile`}>
                          <Button color={"white"} _hover={{ bg: "#38a169", borderColor: "#38a169" }} size={"sm"} borderRadius={"full"} variant={"outline"} position={"absolute"} bottom={"-50px"} right={"0px"}>
                            <Text fontSize={"lg"}>
                              <FiEdit3 />
                            </Text>
                          </Button>
                        </Link>
                      )}
                      {profile?.id !== detailUser?.id && (
                        <>
                          <Button color={"white"} _hover={{ bg: "#38a169", borderColor: "#38a169" }} size={"sm"} borderRadius={"full"} variant="outline" position={"absolute"} bottom={"-50px"} right={"0px"} onClick={followAndUnfollow}>
                            {" "}
                            {followerArray.map((follower) => follower.id).includes(profile?.id || "") ? "Unfollow" : "Follow"}
                          </Button>
                        </>
                      )}
                    </Box>
                    <Box mt={"75px"}>
                      <Text fontSize={"sm"} color={"gray.400"}>
                        {detailUser?.fullname}
                      </Text>
                      <Text fontSize={"sm"} color={"gray.400"}>
                        @{detailUser?.username}
                      </Text>
                      <Text fontSize={"sm"} color={"gray.400"}>
                        {detailUser?.bio}
                      </Text>
                    </Box>
                    <Flex mt={"10px"} gap={3} mb={5}>
                      <Box fontSize={"md"}>
                        {detailUser?.follower.length}{" "}
                        <Text display={"inline"} color={"grey.400"}>
                          Followers
                        </Text>
                      </Box>
                      <Box fontSize={"md"}>
                        {detailUser?.followwing.length}{" "}
                        <Text display={"inline"} color={"grey.400"}>
                          Following
                        </Text>
                      </Box>
                    </Flex>
                    <Tabs variant="solid-rounded" colorScheme="green">
                      <TabList>
                        <Tab color={"white"}>Follower</Tab>
                        <Tab color={"white"}>Following</Tab>
                      </TabList>
                      <TabPanels>
                        <TabPanel>
                          <Box bg={"#2b2b2b"} px={5} py={3}>
                            {!detailUser?.follower.length ? (
                              <Text fontSize={"md"}>No Follower Found</Text>
                            ) : (
                              <>
                                {followerArray.map((follower, index) => (
                                  <Flex key={index} justifyContent={"space-between"} alignItems={"center"} my={4} display={{ base: "block", sm: "flex" }}>
                                    <Flex gap={2} alignItems={"center"} mb={{ base: 3, sm: 0 }}>
                                      <Text>
                                        <Image borderRadius="full" boxSize="45px" objectFit="cover" src={follower?.photo_profile} alt={follower.fullname} />
                                      </Text>
                                      <Box>
                                        <Text fontSize={"sm"}>{follower.fullname}</Text>
                                        <Text fontSize={"sm"} color={"gray.400"}>
                                          @{follower.username}
                                        </Text>
                                      </Box>
                                    </Flex>
                                    <Text>
                                      <Link to={`/profile/${follower.id}`}>
                                        <Button
                                          color={"white"}
                                          _hover={{
                                            bg: "#38a169",
                                            borderColor: "#38a169",
                                          }}
                                          size="sm"
                                          borderRadius={"full"}
                                          variant="outline"
                                        >
                                          Visit Profile
                                        </Button>
                                      </Link>
                                    </Text>
                                  </Flex>
                                ))}
                              </>
                            )}
                          </Box>
                        </TabPanel>
                        <TabPanel>
                          <Box bg={"#2b2b2b"} px={5} py={3}>
                            {detailUser?.follower.length ? (
                              <Text fontSize={"md"}>No Following Found</Text>
                            ) : (
                              <>
                                {followingArray.map((followwing, index) => (
                                  <Flex key={index} justifyContent={"space-between"} alignItems={"center"} my={4} display={{ base: "block", sm: "flex" }}>
                                    <Flex gap={2} alignItems={"center"} mb={{ base: 3, sm: 0 }}>
                                      <Text>
                                        <Image borderRadius="full" boxSize="45px" objectFit="cover" src={followwing.photo_profile} alt={followwing.fullname} />
                                      </Text>
                                      <Box>
                                        <Text fontSize={"sm"}>{followwing.fullname}</Text>
                                        <Text fontSize={"sm"} color={"gray.400"}>
                                          @{followwing.username}
                                        </Text>
                                      </Box>
                                    </Flex>
                                    <Text>
                                      <Link to={`/profile/${followwing.id}`}>
                                        <Button
                                          color={"white"}
                                          _hover={{
                                            bg: "#38a169",
                                            borderColor: "#38a169",
                                          }}
                                          size="sm"
                                          borderRadius={"full"}
                                          variant="outline"
                                        >
                                          Visit Profile
                                        </Button>
                                      </Link>
                                    </Text>
                                  </Flex>
                                ))}
                              </>
                            )}
                          </Box>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </Box>
    </Fragment>
  );
}
