import {
  Alert,
  Badge,
  Button,
  Card,
  Center,
  Container,
  Divider,
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
import type { IconType } from "react-icons";
import {
  FiActivity,
  FiAlertCircle,
  FiArrowRight,
  FiCalendar,
  FiClipboard,
  FiFilePlus,
  FiHeart,
  FiRefreshCw,
  FiUserCheck,
  FiUserPlus,
  FiUsers,
  FiUserX,
} from "react-icons/fi";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { obtenerDashboardAyudante } from "../../services/dashboardService";
import type { AyudanteDashboardResponse } from "../../services/interfaces/dashboardInterface";
import { mostrarFecha } from "../../utils/formatHelper";

interface Estadistica {
  titulo: string;
  valor: number;
  descripcion: string;
  color: string;
  icono: IconType;
}

interface AccesoRapido {
  titulo: string;
  descripcion: string;
  ruta: string;
  color: string;
  icono: IconType;
}

export function AyudanteDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] =
    useState<AyudanteDashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDashboard();
  }, []);

  async function cargarDashboard() {
    try {
      setLoading(true);
      setError(null);

      const resultado = await obtenerDashboardAyudante();
      setDashboard(resultado);
    } catch {
      setError(
        "No fue posible cargar la información del panel."
      );
    } finally {
      setLoading(false);
    }
  }

  const mayorCantidadPorTipo = useMemo(() => {
    if (!dashboard?.consultasPorTipo.length) {
      return 0;
    }

    return Math.max(
      ...dashboard.consultasPorTipo.map(
        (consulta) => consulta.cantidad
      )
    );
  }, [dashboard]);

  if (loading) {
    return (
      <Center mih={400}>
        <Stack align="center" gap="sm">
          <Loader size="lg" />

          <Text c="dimmed">
            Cargando panel de trabajo...
          </Text>
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
          icon={<FiAlertCircle size={20} />}
        >
          <Stack gap="md">
            <Text size="sm">{error}</Text>

            <Button
              color="red"
              variant="light"
              w="fit-content"
              leftSection={<FiRefreshCw size={17} />}
              onClick={cargarDashboard}
            >
              Intentar nuevamente
            </Button>
          </Stack>
        </Alert>
      </Container>
    );
  }

  const estadisticas: Estadistica[] = [
    {
      titulo: "Adultos activos",
      valor: dashboard.adultosActivos,
      descripcion: "Expedientes actualmente activos",
      color: "blue",
      icono: FiUserCheck,
    },
    {
      titulo: "Nuevos este mes",
      valor: dashboard.adultosNuevosEsteMes,
      descripcion: "Adultos registrados este mes",
      color: "teal",
      icono: FiUserPlus,
    },
    {
      titulo: "Consultas este mes",
      valor: dashboard.consultasEsteMes,
      descripcion: "Atenciones durante el mes actual",
      color: "violet",
      icono: FiCalendar,
    },
    {
      titulo: "Consultas hoy",
      valor: dashboard.consultasHoy,
      descripcion: "Atenciones registradas hoy",
      color: "orange",
      icono: FiActivity,
    },
  ];

  const accesosRapidos: AccesoRapido[] = [
    {
      titulo: "Adultos mayores",
      descripcion: "Consultar y administrar expedientes",
      ruta: "/adultosMayores",
      color: "blue",
      icono: FiUsers,
    },
    {
      titulo: "Registrar adulto",
      descripcion: "Crear un nuevo expediente",
      ruta: "/adultosMayores/registrar",
      color: "teal",
      icono: FiUserPlus,
    },
    {
      titulo: "Nueva consulta",
      descripcion: "Registrar una nueva atención",
      ruta: "/consulta/registrar",
      color: "violet",
      icono: FiFilePlus,
    },
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Encabezado */}
        <Group justify="space-between" align="flex-end">
          <div>
            <Badge variant="light" color="teal" mb="xs">
              Gestión operativa
            </Badge>

            <Title order={1}>Panel de ayudante</Title>

            <Text c="dimmed" mt={4}>
              Gestión de adultos mayores y consultas.
            </Text>
          </div>

          <Group>
            <Button
              variant="light"
              leftSection={<FiRefreshCw size={17} />}
              onClick={cargarDashboard}
            >
              Actualizar
            </Button>

            <Button
              leftSection={<FiFilePlus size={18} />}
              onClick={() =>
                navigate("/consulta/registrar")
              }
            >
              Nueva consulta
            </Button>
          </Group>
        </Group>

        {/* Estadísticas principales */}
        <SimpleGrid
          cols={{ base: 1, xs: 2, lg: 4 }}
          spacing="lg"
        >
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
                <Group
                  justify="space-between"
                  align="flex-start"
                  wrap="nowrap"
                >
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
                    color={estadistica.color}
                    variant="light"
                    size={46}
                    radius="md"
                  >
                    <Icono size={23} />
                  </ThemeIcon>
                </Group>
              </Card>
            );
          })}
        </SimpleGrid>

        {/* Totales secundarios */}
        <SimpleGrid
          cols={{ base: 1, sm: 2 }}
          spacing="lg"
        >
          <Card withBorder radius="lg" padding="lg">
            <Group wrap="nowrap">
              <ThemeIcon
                color="blue"
                variant="light"
                size={48}
                radius="md"
              >
                <FiHeart size={23} />
              </ThemeIcon>

              <div>
                <Text size="sm" c="dimmed">
                  Total de adultos registrados
                </Text>

                <Text fz="xl" fw={700}>
                  {(
                    dashboard.adultosActivos +
                    dashboard.adultosInactivos
                  ).toLocaleString()}
                </Text>
              </div>
            </Group>
          </Card>

          <Card withBorder radius="lg" padding="lg">
            <Group wrap="nowrap">
              <ThemeIcon
                color="gray"
                variant="light"
                size={48}
                radius="md"
              >
                <FiUserX size={23} />
              </ThemeIcon>

              <div>
                <Text size="sm" c="dimmed">
                  Adultos inactivos
                </Text>

                <Text fz="xl" fw={700}>
                  {dashboard.adultosInactivos.toLocaleString()}
                </Text>
              </div>
            </Group>
          </Card>
        </SimpleGrid>

        <SimpleGrid
          cols={{ base: 1, md: 2 }}
          spacing="xl"
        >
          {/* Consultas por tipo */}
          <Paper withBorder radius="lg" p="xl">
            <Group justify="space-between" mb="xl">
              <div>
                <Title order={3}>
                  Consultas por tipo
                </Title>

                <Text size="sm" c="dimmed">
                  Distribución de consultas activas
                </Text>
              </div>

              <ThemeIcon
                color="violet"
                variant="light"
                size="lg"
                radius="md"
              >
                <FiClipboard size={20} />
              </ThemeIcon>
            </Group>

            {dashboard.consultasPorTipo.length === 0 ? (
              <Center mih={220}>
                <Stack align="center" gap="xs">
                  <FiClipboard
                    size={36}
                    color="var(--mantine-color-dimmed)"
                  />

                  <Text c="dimmed">
                    Todavía no hay consultas registradas.
                  </Text>
                </Stack>
              </Center>
            ) : (
              <Stack gap="lg">
                {dashboard.consultasPorTipo.map(
                  (consulta) => {
                    const porcentaje =
                      mayorCantidadPorTipo === 0
                        ? 0
                        : (consulta.cantidad /
                            mayorCantidadPorTipo) *
                          100;

                    return (
                      <div key={consulta.tipoConsulta}>
                        <Group
                          justify="space-between"
                          mb={6}
                        >
                          <Text size="sm" fw={500}>
                            {consulta.tipoConsulta}
                          </Text>

                          <Badge variant="light">
                            {consulta.cantidad}
                          </Badge>
                        </Group>

                        <Progress
                          value={porcentaje}
                          size="md"
                          radius="xl"
                        />
                      </div>
                    );
                  }
                )}
              </Stack>
            )}
          </Paper>

          {/* Consultas recientes */}
          <Paper withBorder radius="lg" p="xl">
            <Group justify="space-between" mb="lg">
              <div>
                <Title order={3}>
                  Consultas recientes
                </Title>

                <Text size="sm" c="dimmed">
                  Últimas atenciones registradas
                </Text>
              </div>

              <ThemeIcon
                color="blue"
                variant="light"
                size="lg"
                radius="md"
              >
                <FiActivity size={20} />
              </ThemeIcon>
            </Group>

            {dashboard.consultasRecientes.length === 0 ? (
              <Center mih={220}>
                <Stack align="center" gap="xs">
                  <FiClipboard
                    size={36}
                    color="var(--mantine-color-dimmed)"
                  />

                  <Text c="dimmed">
                    No hay consultas recientes.
                  </Text>
                </Stack>
              </Center>
            ) : (
              <Stack gap={0}>
                {dashboard.consultasRecientes.map(
                  (consulta, index) => (
                    <div key={consulta.consultaId}>
                      <Card
                        padding="sm"
                        radius="md"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(
                            `/consultas/${consulta.consultaId}`
                          )
                        }
                      >
                        <Group wrap="nowrap">
                          <ThemeIcon
                            variant="light"
                            radius="xl"
                            size={42}
                          >
                            <FiHeart size={19} />
                          </ThemeIcon>

                          <div
                            style={{
                              flex: 1,
                              minWidth: 0,
                            }}
                          >
                            <Group
                              justify="space-between"
                              wrap="nowrap"
                            >
                              <Text fw={600} truncate>
                                {consulta.nombreAdulto}
                              </Text>

                              <Text
                                size="xs"
                                c="dimmed"
                                style={{
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {mostrarFecha(
                                  consulta.fecha
                                )}
                              </Text>
                            </Group>

                            <Text
                              size="sm"
                              c="dimmed"
                              truncate
                            >
                              {consulta.tipoConsulta ??
                                "Sin clasificar"}

                              {consulta.motivo
                                ? ` · ${consulta.motivo}`
                                : ""}
                            </Text>
                          </div>

                          <FiArrowRight size={18} />
                        </Group>
                      </Card>

                      {index <
                        dashboard.consultasRecientes.length -
                          1 && <Divider my={4} />}
                    </div>
                  )
                )}
              </Stack>
            )}
          </Paper>
        </SimpleGrid>

        {/* Accesos rápidos */}
        <Paper withBorder radius="lg" p="xl">
          <Title order={3}>Accesos rápidos</Title>

          <Text size="sm" c="dimmed" mb="xl">
            Operaciones frecuentes
          </Text>

          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3 }}
          >
            {accesosRapidos.map((acceso) => {
              const Icono = acceso.icono;

              return (
                <Card
                  key={acceso.ruta}
                  withBorder
                  radius="md"
                  padding="lg"
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
                      <Icono size={21} />
                    </ThemeIcon>

                    <div style={{ flex: 1 }}>
                      <Text fw={600}>
                        {acceso.titulo}
                      </Text>

                      <Text size="sm" c="dimmed">
                        {acceso.descripcion}
                      </Text>
                    </div>

                    <FiArrowRight size={19} />
                  </Group>
                </Card>
              );
            })}
          </SimpleGrid>
        </Paper>
      </Stack>
    </Container>
  );
}
