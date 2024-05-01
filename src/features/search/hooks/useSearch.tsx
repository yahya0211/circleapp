import { useQuery } from "@tanstack/react-query";
import getError from "../../../utils/GetError";
import { API } from "../../../utils/api";

API;
getError;

const jwtToken = localStorage.getItem("jwtToken");

const fetchUser = async (name: string) => {
  const response = await API.get(`findByUserName/${name}`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  return response.data;
};

export const useSearch = (name: string) => {
  return useQuery({
    queryKey: ["search-users"],
    queryFn: () => fetchUser(name),
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};
