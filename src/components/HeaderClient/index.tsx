import { Divider, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useColors } from "../../hooks/useColors";
import { api } from "../../services/apiClient";
import { MenuUser } from "../MenuUser";
import { ThemeSwitcher } from "../ThemeSwitcher";

export function HeaderClient() {
  const { colors } = useColors();
  const { user } = useAuth();
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    function searchUserData() {
      api.get("/me").then((response) => {
        setUserName(response.data.name + " " + response.data.lastName);
      });
    }

    searchUserData();
  }, []);

  function profile() {
    router.push("/client/profile");
  }

  return (
    <Flex
      w={[
        "calc(100vw - 50px)",
        "calc(100vw - 50px)",
        "calc(100vw - 50px)",
        "calc(100vw - 250px)",
      ]}
      h="60px"
      align="center"
      justify="flex-end"
      bg={colors.bgHover}
      p={2}
      gap={4}
    >
      <ThemeSwitcher color={colors.color} />

      <Divider orientation="vertical" />

      <Flex flexDir="column" mr={2}>
        <Text color={colors.color}>{user?.name}</Text>
        <Text fontSize="14px" color={colors.divider}>
          {user?.email}
        </Text>
      </Flex>

      <MenuUser userName={userName} profile={profile} />
    </Flex>
  );
}
