import { ChakraProvider, Flex } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { AuthProvider } from "../context/AuthContext";
import { ColorsProvider } from "../hooks/useColors";
import { theme } from "../styles/theme";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ChakraProvider theme={theme}>
      <ColorsProvider>
        <AuthProvider>
          <Flex>
            {router.pathname === "/" ||
            router.pathname === "/cliente/register" ||
            router.pathname === "/nutricionista/register" ||
            router.pathname === "/nutricionista/files" ? null : (
              <Sidebar />
            )}
            <Flex flexDir="column">
              {router.pathname === "/" ||
              router.pathname === "/cliente/register" ||
              router.pathname === "/nutricionista/register" ||
              router.pathname === "/nutricionista/files" ? null : (
                <Header />
              )}
              <Component {...pageProps} />
            </Flex>
          </Flex>
        </AuthProvider>
      </ColorsProvider>
    </ChakraProvider>
  );
}

export default MyApp;
