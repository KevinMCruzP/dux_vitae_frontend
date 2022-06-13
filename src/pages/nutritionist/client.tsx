import {
  Flex,
  Input,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { parseCookies } from "nookies";
import { TableContentClient } from "../../components/TableContentClient";
import { useColors } from "../../hooks/useColors";
import { setupAPIClient } from "../../services/api";
import { api } from "../../services/apiClient";
import { withSSRAuth } from "../../utils/withSSRAuth";

type ClientProps = {
  rut: string;
  name: string;
  lastName: string;
  email: string;
  created_at: string;
};

export default function client({ appointmentData }) {
  const { colors } = useColors();

  return (
    <Flex
      flex="1"
      w={[
        "calc(100vw - 50px)",
        "calc(100vw - 50px)",
        "calc(100vw - 50px)",
        "calc(100vw - 250px)",
      ]}
      align="top"
      justify="center"
      bg={colors.bg}
    >
      <TableContainer w="80%">
        <Text color={colors.color} mb="8px">
          Cliente:
        </Text>
        <Input
          // onChange={handleChange}
          placeholder="Buscar"
          size="sm"
          w="30%"
          minW="200px"
        />
        <Table w="100%" variant="striped">
          <TableCaption>Tabla de clientes</TableCaption>
          <Thead>
            <Tr>
              <Th>Rut</Th>
              <Th>Nombre</Th>
              <Th>Apellido</Th>
              <Th>Estado</Th>
              <Th></Th>
            </Tr>
          </Thead>

          <Tbody color={colors.color}>
            {appointmentData.map((clients) => (
              <TableContentClient
                key={clients.client.rut}
                rut={clients.client.rut}
                name={clients.client.name}
                lastName={clients.client.lastName}
                state={clients.state}
                email={clients.client.email}
              />
            ))}
          </Tbody>

          <Tfoot>
            <Tr>
              <Th>Rut</Th>
              <Th>Nombre</Th>
              <Th>Apellido</Th>
              <Th>Estado</Th>
              <Th></Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Flex>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/me");
    const user = {
      name: response.data.name,
      lastName: response.data.lastName,
      email: response.data.email,
    };

    const cookies = parseCookies(ctx);
    const rutNutritionist = cookies["rut"];
    const responseAppointment = await api.get(
      `/appointments/${rutNutritionist}`
    );
    const appointmentData = responseAppointment.data;
    console.log(appointmentData);
    return {
      props: {
        appointmentData,
      },
    };
  },
  {
    roles: "nutritionist",
  }
);
