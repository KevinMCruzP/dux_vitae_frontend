import {
  Center,
  Flex,
  useBreakpointValue,
  useColorModeValue
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { Logo } from "../assets/Logo";
import { Button } from "../components/Button";
import { HomeInfo } from "../components/HomeInfo";
import { Input } from "../components/Input";
import { InputShowPassword } from "../components/InputShowPassword";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { AuthContext } from "../context/AuthContext";
import { useColors } from "../hooks/useColors";
import { useToasts } from "../hooks/useToasts";
import { withSRRGuest } from "../utils/withSSRGuest";

type SignInData = {
  email: string;
  password: string;
};

const SignInSchema = yup.object().shape({
  email: yup
    .string()
    .email("El formato debe ser email")
    .required("El email es requerido"),
  password: yup.string().required("La contraseña es requerida"),
});

export default function Home() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInData>({
    resolver: yupResolver(SignInSchema),
  });

  const { toastError } = useToasts()
  const { colors } = useColors();

  const isTabletVersion = useBreakpointValue({ base: false, md: true });

  const { signIn } = useContext(AuthContext);

  const onSubmit: SubmitHandler<SignInData> = async (data) => {
    try {
      await signIn(data);
    } catch(err) {
      toastError({ description: "Usuario con estos datos no registrado" })
    }
  };

  return (
    <Flex w="100vw" h="100vh">
      <HomeInfo />
      <Flex
        w={["100%", "100%", "60%"]}
        h="100%"
        p={[2, 4, 6]}
        bg={colors.bgHover}
        flexDir="column"
      >
        <Flex justify="space-between" align="center" gap={4}>
          {!isTabletVersion ? <Logo /> : <Flex />}

          <Flex>
            <ThemeSwitcher color={useColorModeValue("black", "white")} />

            <Button
              name="Registrarse"
              bg={colors.secondary}
              onClick={() => {
                router.push("/client/register");
              }}
            />
          </Flex>
        </Flex>

        <Center flex="1">
          <Flex
            as="form"
            flexDir="column"
            w={["80%", "70%", "60%"]}
            h="100%"
            justify="center"
            gap={4}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              idName="email"
              label="Email"
              color={colors.color}
              error={errors.email}
              {...register("email")}
            />
            <InputShowPassword
              type="password"
              idName="password"
              label="Password"
              color={colors.color}
              error={errors.password}
              {...register("password")}
            />

            <Button
              mt={4}
              type="submit"
              name="Entrar"
              bg={colors.primary}
              isLoading={isSubmitting}
            />
          </Flex>
        </Center>

        {!isTabletVersion ? (
          <Center>
            <Flex justify={"center"}>
              <Button
                name="Registrarse nutricionista"
                bg={colors.tertiary}
                onClick={() => {
                  router.push("/nutritionist/register");
                }}
              />
            </Flex>
          </Center>
        ) : null}
      </Flex>
    </Flex>
  );
}

//Si el usuario ya está logueado, no podrá acceder a esta página, por lo que lo redirige a una página expecificada en la función withSRRGuest
export const getServerSideProps = withSRRGuest(async (ctx) => {
  return {
    props: {},
  };
});
