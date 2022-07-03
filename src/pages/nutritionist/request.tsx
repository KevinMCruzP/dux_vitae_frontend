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
  Tr
} from "@chakra-ui/react";
import Router from "next/router";
import { parseCookies } from "nookies";
import { TableContentAppointment } from "../../components/TableContentAppointment";
import { useColors } from "../../hooks/useColors";
import { useToasts } from "../../hooks/useToasts";
import { setupAPIClient } from "../../services/api";
import { api } from "../../services/apiClient";
import { withSSRAuth } from "../../utils/withSSRAuth";

export async function rejectRequest(id: string) {
  const { toastSuccess, toastError } = useToasts();

  //Rota por se rechaza la solicitud
  try {
    const response = await api.delete(`/appointments/${id}`);
    if (typeof window !== undefined) {
      toastSuccess({ description: "Solicitud rechazada"});

      Router.reload();
    }
  } catch(err) {
    toastError({ description: "Error al rechazar solicitud"});
  }
}

export async function acceptRequest(id: string) {
  const { toastSuccess, toastError } = useToasts();

  try {
    //Rota por se aceita a solicitud
    const response = await api.put(`/appointments/${id}`);
    if (typeof window !== undefined) {
      toastSuccess({ description: "Solicitud aceptada"});

      Router.reload();
    }
  } catch(err) {
    toastError({ description: "Error al aceptar solicitud" });
  }
}

export default function Request({ appointment }) {
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
          Solicitudes:
        </Text>
        <Input
          // onChange={handleChange}
          placeholder="Buscar"
          size="sm"
          w="30%"
          minW="200px"
        />
        <Table w="100%" variant="striped">
          <TableCaption>Tabla de solicitudes</TableCaption>
          <Thead>
            <Tr>
              <Th>Título</Th>
              <Th>Descripción</Th>
              <Th>Estado</Th>
              <Th></Th>
            </Tr>
          </Thead>

          <Tbody color={colors.color}>
            {appointment?.map((appointment) => (
              <TableContentAppointment
                key={appointment.idAppointment}
                id={appointment.idAppointment}
                title={appointment.title}
                description={appointment.description}
                state={appointment.state}
                client={appointment.client}
              />
            ))}
          </Tbody>

          <Tfoot>
            <Tr>
              <Th>Título</Th>
              <Th>Descripción</Th>
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
    try {
      const apiClient = setupAPIClient(ctx);
      // const client = await apiClient.get("/me");

      const cookies = parseCookies(ctx);
      const rut = cookies["rut"];

      const responseAppointment = await apiClient.get(`/appointments/${rut}`);

      const appointment = responseAppointment.data;
      return {
        props: {
          appointment,
        },
      };
    } catch(err) {
      return {
        props: {
          appointment: [], // Leh: Vai como vazio
        },
      };
    }
  },
  {
    roles: "nutritionist",
  }
);
