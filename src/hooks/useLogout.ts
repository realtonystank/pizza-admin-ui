import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store";
import { logout } from "../http/api";

export const useLogout = () => {
  const { logout: logoutFromStore } = useAuthStore();
  const { mutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      logoutFromStore();
    },
  });
  return { logout: mutate };
};
