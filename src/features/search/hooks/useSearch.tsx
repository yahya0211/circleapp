import { useQuery } from "@tanstack/react-query";
import { API } from "../../../utils/api";

const jwtToken = localStorage.getItem("jwtToken");

const fetchUser = async (id: string) => {
  const response = await API.get(`findByUserName/${id}`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  return response.data;
};

export const useSearch = (name: string) => {
  return useQuery({
    queryKey: ["todos-findByUserName"],
    queryFn: () => fetchUser(name),
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};
