import {
  Alert,
  Badge,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  TbActivity,
  TbAlertCircle,
  TbArrowRight,
  TbClipboardText,
  TbFileSearch,
  TbHeartbeat,
  TbStethoscope,
  TbUserPlus,
  TbUsers,
} from "react-icons/tb";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { obtenerDashboard } from "../../services/dashboardService";
import type { DashboardResponse } from "../../services/interfaces/dashboardInterface";

export function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDashboard();
  }, []);

  async function cargarDashboard() {
    try {
      setLoading(true);
      setError(null);

      const resultado = await obtenerDashboard();
      setDashboard(resultado);
    } catch {
      setError(
        "No fue posible cargar la información del panel administrativo."
      );
    } finally {
      setLoading(false);
    }
  }

  const mayorCantidadEspecialidad = useMemo(() => {
    if (!dashboard?.consultasPorEspecialidad.length) {
      return 0;
    }

    return Math.max(
      ...dashboard.consultasPorEspecialidad.map(
        (item) => item.cantidad
      )
    );
  }, [dashboard]);

  if (loading) {
    return (
      <Center mih={400}>
        <Stack align="center" gap="sm">
          <Loader size="lg" />
          <Text c="dimmed">Cargando panel administrativo...</Text>
        </Stack>
      </Center>
    );
  }

  if (error || !dashboard) {
    return (
      <Container size="xl" py="xl">
        <Alert
          color="red"
          title="No se pudo cargar el dashboard"
          icon={<TbAlertCircle size={20} />}
        >
          <Stack gap="md">
            <Text size="sm">{error}</Text>

            <Button
              variant="light"
              color="red"
              w="fit-content"
              onClick={cargarDashboard}
            >
              Intentar nuevamente
            </Button>
          </Stack>
        </Alert>
      </Container>
    );
  }

  const estadisticas = [
    {
      titulo: "Adultos mayores",
      valor: dashboard.adultosActivos,
      descripcion: "Registrados y activos",
      color: "blue",
      icono: TbUsers,
    },
    {
      titulo: "Personal",
      valor: dashboard.personalActivo,
      descripcion: "Colaboradores activos",
      color: "teal",
      icono: TbStethoscope,
    },
    {
      titulo: "Consultas",
      valor: dashboard.consultasActivas,
      descripcion: "Consultas activas totales",
      color: "green",
      icono: TbClipboardText,
    },
    {
      titulo: "Este mes",
      valor: dashboard.consultasEsteMes,
      descripcion: "Consultas registradas",
      color: "frenchgray",
      icono: TbActivity,
    },
  ];

  const accesosRapidos = [
    {
      titulo: "Adultos mayores",
      descripcion: "Consultar y administrar expedientes",
      ruta: "/adultosMayores",
      color: "blue",
      icono: TbHeartbeat,
    },
    {
      titulo: "Registrar personal",
      descripcion: "Crear una nueva cuenta de personal",
      ruta: "/personal/registrar",
      color: "teal",
      icono: TbUserPlus,
    },
    {
      titulo: "Auditoría",
      descripcion: "Revisar acciones y cambios del sistema",
      ruta: "/auditoria",
      color: "grape",
      icono: TbFileSearch,
    },
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-end">
          <div>
            <Badge variant="light" color="blue" mb="xs">
              Administración
            </Badge>

            <Title order={1}>Panel administrativo</Title>

            <Text c="dimmed" mt={4}>
              Resumen general y accesos principales del sistema.
            </Text>
          </div>

          <Button
            variant="light"
            leftSection={<TbActivity size={18} />}
            onClick={cargarDashboard}
          >
            Actualizar
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }}>
          {estadisticas.map((estadistica) => {
            const Icono = estadistica.icono;

            return (
              <Card
                key={estadistica.titulo}
                withBorder
                radius="lg"
                padding="lg"
                shadow="xs"
              >
                <Group justify="space-between" align="flex-start">
                  <div>
                    <Text size="sm" c="dimmed" fw={500}>
                      {estadistica.titulo}
                    </Text>

                    <Text fz={32} fw={700} mt={6}>
                      {estadistica.valor.toLocaleString()}
                    </Text>

                    <Text size="xs" c="dimmed" mt={2}>
                      {estadistica.descripcion}
                    </Text>
                  </div>

                  <ThemeIcon
                    size={46}
                    radius="md"
                    color={estadistica.color}
                    variant="light"
                  >
                    <Icono size={24} />
                  </ThemeIcon>
                </Group>
              </Card>
            );
          })}
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Paper withBorder radius="lg" p="xl">
            <Group justify="space-between" mb="xl">
              <div>
                <Title order={3}>Consultas por especialidad</Title>
                <Text size="sm" c="dimmed">
                  Distribución histórica de consultas activas
                </Text>
              </div>

              <ThemeIcon variant="light" size="lg" radius="md">
                <TbStethoscope size={20} />
              </ThemeIcon>
            </Group>

            {dashboard.consultasPorEspecialidad.length === 0 ? (
              <Center mih={200}>
                <Text c="dimmed">
                  Todavía no hay consultas registradas.
                </Text>
              </Center>
            ) : (
              <Stack gap="lg">
                {dashboard.consultasPorEspecialidad.map(
                  (especialidad) => {
                    const porcentaje =
                      mayorCantidadEspecialidad === 0
                        ? 0
                        : (especialidad.cantidad /
                            mayorCantidadEspecialidad) *
                          100;

                    return (
                      <div key={especialidad.especialidad}>
                        <Group justify="space-between" mb={6}>
                          <Text size="sm" fw={500}>
                            {especialidad.especialidad}
                          </Text>

                          <Badge variant="light">
                            {especialidad.cantidad}
                          </Badge>
                        </Group>

                        <Progress
                          value={porcentaje}
                          size="md"
                          radius="xl"
                          animated
                        />
                      </div>
                    );
                  }
                )}
              </Stack>
            )}
          </Paper>

          <Paper withBorder radius="lg" p="xl">
            <Title order={3}>Accesos rápidos</Title>

            <Text size="sm" c="dimmed" mb="xl">
              Operaciones administrativas frecuentes
            </Text>

            <Stack>
              {accesosRapidos.map((acceso) => {
                const Icono = acceso.icono;

                return (
                  <Card
                    key={acceso.ruta}
                    withBorder
                    radius="md"
                    padding="md"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(acceso.ruta)}
                  >
                    <Group wrap="nowrap">
                      <ThemeIcon
                        color={acceso.color}
                        variant="light"
                        size={44}
                        radius="md"
                      >
                        <Icono size={22} />
                      </ThemeIcon>

                      <div style={{ flex: 1 }}>
                        <Text fw={600}>{acceso.titulo}</Text>

                        <Text size="sm" c="dimmed">
                          {acceso.descripcion}
                        </Text>
                      </div>

                      <TbArrowRight size={20} />
                    </Group>
                  </Card>
                );
              })}
            </Stack>
          </Paper>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}