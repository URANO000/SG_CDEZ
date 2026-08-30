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
import {
  TbAlertCircle,
  TbArrowRight,
  TbCalendar,
  TbCalendarMonth,
  TbClipboardPlus,
  TbClipboardText,
  TbHistory,
  TbUserHeart,
  TbUsers,
} from "react-icons/tb";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { obtenerDashboardPersonal } from "../../services/dashboardService";
import type { PersonalDashboardResponse } from "../../services/interfaces/dashboardInterface";

export function PersonalDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] =
    useState<PersonalDashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDashboard();
  }, []);

  async function cargarDashboard() {
    try {
      setLoading(true);
      setError(null);

      const resultado = await obtenerDashboardPersonal();
      setDashboard(resultado);
    } catch {
      setError(
        "No fue posible cargar la información de sus consultas."
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
        (item) => item.cantidad
      )
    );
  }, [dashboard]);

  if (loading) {
    return (
      <Center mih={400}>
        <Stack align="center">
          <Loader size="lg" />
          <Text c="dimmed">Cargando resumen...</Text>
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
          <Stack>
            <Text size="sm">{error}</Text>

            <Button
              color="red"
              variant="light"
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
      titulo: "Mis consultas",
      valor: dashboard.consultasTotales,
      descripcion: "Consultas activas registradas",
      icono: TbClipboardText,
      color: "blue",
    },
    {
      titulo: "Este mes",
      valor: dashboard.consultasEsteMes,
      descripcion: "Consultas durante el mes actual",
      icono: TbCalendarMonth,
      color: "violet",
    },
    {
      titulo: "Hoy",
      valor: dashboard.consultasHoy,
      descripcion: "Consultas registradas hoy",
      icono: TbCalendar,
      color: "orange",
    },
    {
      titulo: "Adultos atendidos",
      valor: dashboard.adultosAtendidos,
      descripcion: "Personas diferentes atendidas",
      icono: TbUserHeart,
      color: "teal",
    },
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-end">
          <div>
            <Badge variant="light" mb="xs">
              Panel de trabajo
            </Badge>

            <Title order={1}>Resumen de consultas</Title>

            <Text c="dimmed" mt={4}>
              Consulte su actividad y continúe con sus tareas.
            </Text>
          </div>

          <Button
            leftSection={<TbClipboardPlus size={18} />}
            onClick={() => navigate("/consulta/registrar")}
          >
            Nueva consulta
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }}>
          {estadisticas.map((item) => {
            const Icono = item.icono;

            return (
              <Card
                key={item.titulo}
                withBorder
                radius="lg"
                padding="lg"
                shadow="xs"
              >
                <Group justify="space-between" align="flex-start">
                  <div>
                    <Text size="sm" c="dimmed" fw={500}>
                      {item.titulo}
                    </Text>

                    <Text fz={32} fw={700} mt={6}>
                      {item.valor.toLocaleString()}
                    </Text>

                    <Text size="xs" c="dimmed" mt={2}>
                      {item.descripcion}
                    </Text>
                  </div>

                  <ThemeIcon
                    color={item.color}
                    variant="light"
                    size={46}
                    radius="md"
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
                <Title order={3}>Consultas por tipo</Title>

                <Text size="sm" c="dimmed">
                  Distribución de sus consultas activas
                </Text>
              </div>

              <ThemeIcon variant="light" size="lg">
                <TbClipboardText size={20} />
              </ThemeIcon>
            </Group>

            {dashboard.consultasPorTipo.length === 0 ? (
              <Center mih={220}>
                <Stack align="center" gap="xs">
                  <TbClipboardText
                    size={36}
                    color="var(--mantine-color-dimmed)"
                  />

                  <Text c="dimmed">
                    Todavía no ha registrado consultas.
                  </Text>
                </Stack>
              </Center>
            ) : (
              <Stack gap="lg">
                {dashboard.consultasPorTipo.map((item) => {
                  const porcentaje =
                    mayorCantidadPorTipo === 0
                      ? 0
                      : (item.cantidad /
                          mayorCantidadPorTipo) *
                        100;

                  return (
                    <div key={item.tipoConsulta}>
                      <Group justify="space-between" mb={6}>
                        <Text size="sm" fw={500}>
                          {item.tipoConsulta}
                        </Text>

                        <Badge variant="light">
                          {item.cantidad}
                        </Badge>
                      </Group>

                      <Progress
                        value={porcentaje}
                        radius="xl"
                        size="md"
                      />
                    </div>
                  );
                })}
              </Stack>
            )}
          </Paper>

          <Paper withBorder radius="lg" p="xl">
            <Group justify="space-between" mb="lg">
              <div>
                <Title order={3}>Consultas recientes</Title>

                <Text size="sm" c="dimmed">
                  Sus últimos registros
                </Text>
              </div>

              <ThemeIcon variant="light" size="lg">
                <TbHistory size={20} />
              </ThemeIcon>
            </Group>

            {dashboard.consultasRecientes.length === 0 ? (
              <Center mih={220}>
                <Text c="dimmed">
                  No hay consultas recientes.
                </Text>
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
                            `/consulta/${consulta.consultaId}/detalle`
                          )
                        }
                      >
                        <Group wrap="nowrap">
                          <ThemeIcon
                            variant="light"
                            radius="xl"
                            size={42}
                          >
                            <TbUserHeart size={20} />
                          </ThemeIcon>

                          <div style={{ flex: 1, minWidth: 0 }}>
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
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {formatearFecha(consulta.fecha)}
                              </Text>
                            </Group>

                            <Text size="sm" c="dimmed" truncate>
                              {consulta.tipoConsulta ??
                                "Sin clasificar"}
                              {consulta.motivo
                                ? ` · ${consulta.motivo}`
                                : ""}
                            </Text>
                          </div>

                          <TbArrowRight size={18} />
                        </Group>
                      </Card>

                      {index <
                        dashboard.consultasRecientes.length - 1 && (
                        <Divider my={4} />
                      )}
                    </div>
                  )
                )}
              </Stack>
            )}
          </Paper>
        </SimpleGrid>

        <Paper withBorder radius="lg" p="xl">
          <Title order={3}>Accesos rápidos</Title>

          <SimpleGrid
            cols={{ base: 1, sm: 2 }}
            mt="lg"
          >
            <Card
              withBorder
              radius="md"
              padding="lg"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/adultosMayores")}
            >
              <Group>
                <ThemeIcon
                  color="blue"
                  variant="light"
                  size={44}
                >
                  <TbUsers size={22} />
                </ThemeIcon>

                <div style={{ flex: 1 }}>
                  <Text fw={600}>Adultos mayores</Text>
                  <Text size="sm" c="dimmed">
                    Consultar expedientes
                  </Text>
                </div>

                <TbArrowRight size={20} />
              </Group>
            </Card>

            <Card
              withBorder
              radius="md"
              padding="lg"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/consulta/registrar")}
            >
              <Group>
                <ThemeIcon
                  color="teal"
                  variant="light"
                  size={44}
                >
                  <TbClipboardPlus size={22} />
                </ThemeIcon>

                <div style={{ flex: 1 }}>
                  <Text fw={600}>Nueva consulta</Text>
                  <Text size="sm" c="dimmed">
                    Registrar una atención
                  </Text>
                </div>

                <TbArrowRight size={20} />
              </Group>
            </Card>
          </SimpleGrid>
        </Paper>
      </Stack>
    </Container>
  );
}

function formatearFecha(fecha: string): string {
  return new Intl.DateTimeFormat("es-CR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(fecha));
}