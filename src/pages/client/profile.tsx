import { Avatar, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Router from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { RiMailLine } from "react-icons/ri";
import * as yup from "yup";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Textarea } from "../../components/Textarea";
import { useColors } from "../../hooks/useColors";
import { useToasts } from "../../hooks/useToasts";
import { setupAPIClient } from "../../services/api";
import { api } from "../../services/apiClient";
import { withSSRAuth } from "../../utils/withSSRAuth";

type PropsSSR = {
  clientData: {
    rut?: string;
    name: string;
    lastName: string;
    email: string;
    birthday?: string;
    gender?: string;
    phone?: string;
    created_at?: string;
    description?: string;
  };
};

type UpdateData = {
  name: string;
  lastName: string;
  birthday?: string;
  gender?: string;
  phone?: string;
  created_at?: string;
  description?: string;
};

const UpdateSchema = yup.object().shape({
  name: yup
    .string()
    .required("El nombre es requerido")
    .matches(/^[a-zA-Z\s]+$/g, "El nombre solo puede contener letras"),
  lastName: yup
    .string()
    .required("El apellido es requerido")
    .matches(/^[a-zA-Z\s]+$/g, "El apellido solo puede contener letras"),
  // birthday: yup.date(),
  gender: yup.string(),
  phone: yup
    .string()
    .notRequired()
    .matches(
      /^\+56?[ -]*(6|7)[ -]*([0-9][ -]*){8}/g,
      "El formato requerido es +56 9 xxxxxxxx"
    ),
  description: yup.string(),
});

export default function profile({ clientData }: PropsSSR) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateData>({
    resolver: yupResolver(UpdateSchema),
  });

  const { colors } = useColors();
  const nameClient = clientData?.name + " " + clientData?.lastName;
  const [dateCreatedClient, setDateCreatedClient] = useState("");
  const { toastSuccess, toastError } = useToasts();

  useEffect(() => {
    const date = new Date(clientData?.created_at);
    setDateCreatedClient(
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
  }, []);

  const onSubmit: SubmitHandler<UpdateData> = async (data) => {
    api
      .put(`/clients/${clientData.rut}`, data)
      .then((res) => {
        if (res.status === 200) {
          toastSuccess({ description: "Datos actualizados correctamente" });
          Router.push("/client/profile");
        }
      })
      .catch(() => {});
  };

  return (
    <Flex
      flex="1"
      w={[
        "calc(100vw - 50px)",
        "calc(100vw - 50px)",
        "calc(100vw - 50px)",
        "calc(100vw - 250px)",
      ]}
      bg={colors.bg}
      color={colors.color}
      padding={2}
    >
      {/* formulario */}
      <Flex
        as="form"
        gap={5}
        bg={colors.bg}
        padding={2}
        flexDir={"column"}
        flex="1"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Información general */}
        <Flex h={"3rem"} align={"end"}>
          <Text fontSize={"1.1rem"} fontWeight={"bold"}>
            Información general
          </Text>
        </Flex>
        {/* Input información general */}
        <Flex gap={2} flexDir={"column"}>
          <SimpleGrid columns={2} justifyItems="center" gap={4} marginTop={4}>
            <Input
              type={"text"}
              idName="name"
              label="Nombre"
              bg={colors.bgHover}
              defaultValue={clientData?.name}
              error={errors.name}
              {...register("name")}
            />
            <Input
              type={"text"}
              idName="lastName"
              label="Apellido"
              bg={colors.bgHover}
              defaultValue={clientData?.lastName}
              error={errors.lastName}
              {...register("lastName")}
            />

            <Input
              type={"date"}
              idName="birthday"
              label="Fecha de nacimiento"
              defaultValue={clientData?.birthday ? clientData.birthday : ""}
              bg={colors.bgHover}
              error={errors.birthday}
              {...register("birthday")}
            />

            <Select
              idName="gender"
              label="Género"
              placeholder={!clientData?.gender && "Seleccione un género"}
              bg={colors.bgHover}
              error={errors.gender}
              {...register("gender")}
            >
              {clientData.gender && (
                <option value={clientData?.gender}>{clientData?.gender}</option>
              )}
              <option value="Masculino">Masculino</option>
              <option value="Femenina">Femenina</option>
              <option value="Otro">Otro</option>
            </Select>

            <Input
              type={"text"}
              idName="phone"
              label="Teléfono"
              defaultValue={clientData?.phone ? clientData.phone : ""}
              bg={colors.bgHover}
              error={errors.phone}
              {...register("phone")}
            />
          </SimpleGrid>

          <Textarea
            idName="description"
            label="Descripción"
            defaultValue={
              clientData?.description ? clientData?.description : ""
            }
            bg={colors.bgHover}
            error={errors.description}
            {...register("description")}
          />
        </Flex>

        {/* Dirección */}
        {/* <Flex h={"3rem"} align={"end"}>
          <Text fontSize={"1.1rem"} fontWeight={"bold"}>
            Dirección
          </Text>
        </Flex> */}
        {/* Input de dirección */}
        {/* <Flex gap={2} flexDir={"column"}>
          <Flex gap={2}>
            <Input
              type={"text"}
              idName="address"
              label="Dirección"
              bg={colors.bgHover}
              error={errors.address}
              {...register("address")}
            />
            <Input
              type={"text"}
              idName="number"
              label="Número"
              bg={colors.bgHover}
              error={errors.number}
              {...register("number")}
            />
          </Flex>

          <Flex gap={2}>
            <Input
              idName="region"
              label="Región"
              bg={colors.bgHover}
              defaultValue="Coquimbo"
              isDisabled={true}
            />
            <Select
              idName="city"
              label="Ciudad"
              placeholder="Seleccione ciudad"
              bg={colors.bgHover}
              error={errors.city}
              {...register("city")}
            >
              <option value="La serena">La Serena</option>
              <option value="Coquimbo">Coquimbo</option>
              <option value="Ovalle">Ovalle</option>
              <option value="Vicuña">Vicuña</option>
              <option value="Paihuano">Paihuano</option>
            </Select>
          </Flex>
        </Flex> */}

        <Button
          type="submit"
          name="Salvar"
          bg={colors.primary}
          isLoading={isSubmitting}
        />
      </Flex>

      {/* Perfil */}
      <Flex
        align={"top"}
        justifyContent={"center"}
        padding={2}
        w={"25rem"}
        flex="1"
        bg={colors.bg}
      >
        <Flex
          marginTop={20}
          align={"center"}
          flexDir={"column"}
          bg={colors.bgHover}
          w={"80%"}
          h={"60%"}
          borderRadius={"5px"}
          gap={8}
        >
          <Avatar top={-12} w={"6rem"} h={"6rem"} name={nameClient} />

          <Text fontSize={"1.2rem"} fontWeight={"medium"}>
            {nameClient}
          </Text>

          <Text fontSize="0.9rem" color={colors.divider}>
            {clientData?.description
              ? clientData?.description
              : "Descripción personal"}
          </Text>

          <Text as="i">
            <q>Nunca es tarde para cambiar tu estilo de vida.</q>
          </Text>

          <Flex alignItems="center" justifyContent="center" gap="5px">
            <RiMailLine />
            <Text fontSize="0.9rem">{clientData?.email}</Text>
          </Flex>

          <Text fontSize="0.7rem">Cuenta creada el {dateCreatedClient}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    try {
      const apiClient = setupAPIClient(ctx);

      const cookies = parseCookies(ctx);
      const rutClient = cookies["rut"];

      const response = await apiClient.get(`/clients/${rutClient}`);

      const clientData = response.data;

      return {
        props: {
          clientData,
        },
      };
    } catch (err) {
      return {
        props: {
          clientData: [], // Leh: Devolvendo vazio
        },
      };
    }
  },
  {
    roles: "client",
  }
);
