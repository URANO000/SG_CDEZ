import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Group,
  Loader,
  Modal,
  Pagination,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Menu,
} from "@mantine/core";

import { AiOutlineSearch } from "react-icons/ai";

import { useLocation, useNavigate } from "react-router";
import { TbFileTypePdf, TbFileTypeXls, TbChevronDown } from "react-icons/tb";

import { BsPlusLg } from "react-icons/bs";

import { AdultosMayoresTable } from "../../components/ui/tables/AdultosMayoresTable";

import { useAuth } from "../../services/authContext";

import { notifications } from "@mantine/notifications";
import { generarReporteExcel } from "../../services/adultoMayorService";
import { generarReportePDF } from "../../services/adultoMayorService";

import {
  activarAdultoMayor,
  desactivarAdultoMayor,
  listarAdultosMayoresFiltrados,
  registrarFallecimientoAdultoMayor,
} from "../../services/adultoMayorService";

import type {
  AdultoMayorFiltro,
  AdultoMayorResponse,
  EstadoAdultoMayor,
} from "../../services/interfaces/adultoMayorInterface";

import type { PageResponse } from "../../services/interfaces/pageResponse";

import classes from "./AdultosMayores.module.css";

import filterClasses from "../../components/ui/tables/Filter.module.css";

function obtenerFechaHoraLocal(): string {
  const fechaActual = new Date();

  fechaActual.setMinutes(
    fechaActual.getMinutes() - fechaActual.getTimezoneOffset(),
  );

  return fechaActual.toISOString().slice(0, 16);
}

export function AdultosMayores() {
  const location = useLocation();

  const estadoInicial = location.state?.estadoListado ?? "ACTIVO";

  const [filtros, setFiltros] = useState<AdultoMayorFiltro>({
    searchTerm: null,
    estado: estadoInicial,
  });

  const [filtrosAplicados, setFiltrosAplicados] = useState<AdultoMayorFiltro>({
    searchTerm: null,
    estado: estadoInicial,
  });

  const { user } = useAuth();

  const navigate = useNavigate();

  const [pageData, setPageData] =
    useState<PageResponse<AdultoMayorResponse> | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [seleccionado, setSeleccionado] = useState<AdultoMayorResponse | null>(
    null,
  );

  const [fechaRetiro, setFechaRetiro] = useState("");

  const [motivoRetiro, setMotivoRetiro] = useState("");

  const [guardando, setGuardando] = useState(false);

  const [adultoAActivar, setAdultoAActivar] =
    useState<AdultoMayorResponse | null>(null);

  const [activando, setActivando] = useState(false);

  const [adultoAFallecimiento, setAdultoAFallecimiento] =
    useState<AdultoMayorResponse | null>(null);

  const [fechaFallecimiento, setFechaFallecimiento] = useState("");

  const [observacionFallecimiento, setObservacionFallecimiento] = useState("");

  const [registrandoFallecimiento, setRegistrandoFallecimiento] =
    useState(false);

  const [adultoAProcesarBaja, setAdultoAProcesarBaja] =
    useState<AdultoMayorResponse | null>(null);

  const pageSize = 10;

  function downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  const handleGenerateReport = async (type: "pdf" | "excel") => {
    if (type === "pdf") {
      const blob = await generarReportePDF();
      downloadBlob(blob, "reporte_de_adulto.pdf");
    } else {
      const blob = await generarReporteExcel();
      downloadBlob(blob, "reporte_de_adulto.xlsx");
    }
  };

  async function cargarAdultos(
    page: number,
    filtrosConsulta: AdultoMayorFiltro,
  ) {
    setLoading(true);
    setError(null);

    try {
      const response = await listarAdultosMayoresFiltrados(
        filtrosConsulta,
        page,
        pageSize,
      );

      setPageData(response);
    } catch {
      setError("No se pudo cargar la lista de adultos mayores.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmarActivacion() {
    if (!adultoAActivar) {
      return;
    }

    try {
      setActivando(true);

      await activarAdultoMayor(adultoAActivar.adultoId);

      setAdultoAActivar(null);

      await cargarAdultos(0, filtros);

      notifications.show({
        title: "Adulto mayor activado",
        message: "El registro se activó correctamente.",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error al activar",
        message: "No se pudo activar el registro del adulto mayor.",
        color: "red",
      });
    } finally {
      setActivando(false);
    }
  }

  useEffect(() => {
    const filtrosIniciales: AdultoMayorFiltro = {
      searchTerm: null,
      estado: estadoInicial,
    };

    listarAdultosMayoresFiltrados(filtrosIniciales, 0, pageSize)
      .then(setPageData)
      .catch(() => {
        setError("No se pudo cargar la lista de adultos mayores.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function cambiarEstado(value: string | null) {
    if (!value) {
      return;
    }

    setFiltros({
      ...filtros,
      estado: value as EstadoAdultoMayor,
    });
  }

  function abrirDesactivacion(adultoMayor: AdultoMayorResponse) {
    setSeleccionado(adultoMayor);
    setFechaRetiro(obtenerFechaHoraLocal());
    setMotivoRetiro("");
  }

  function cerrarDesactivacion() {
    if (guardando) {
      return;
    }

    setSeleccionado(null);
    setFechaRetiro("");
    setMotivoRetiro("");
  }

  function abrirFallecimiento(adultoMayor: AdultoMayorResponse) {
    setAdultoAFallecimiento(adultoMayor);
    setFechaFallecimiento("");
    setObservacionFallecimiento("");
  }

  function seleccionarDesactivacion() {
    if (!adultoAProcesarBaja) {
      return;
    }

    const adultoMayor = adultoAProcesarBaja;

    setAdultoAProcesarBaja(null);

    abrirDesactivacion(adultoMayor);
  }

  function seleccionarFallecimiento() {
    if (!adultoAProcesarBaja) {
      return;
    }

    const adultoMayor = adultoAProcesarBaja;

    setAdultoAProcesarBaja(null);

    abrirFallecimiento(adultoMayor);
  }

  function cerrarFallecimiento() {
    if (registrandoFallecimiento) {
      return;
    }

    setAdultoAFallecimiento(null);
    setFechaFallecimiento("");
    setObservacionFallecimiento("");
  }

  async function confirmarFallecimiento() {
    if (!adultoAFallecimiento || !fechaFallecimiento) {
      return;
    }

    try {
      setRegistrandoFallecimiento(true);

      await registrarFallecimientoAdultoMayor(adultoAFallecimiento.adultoId, {
        fechaFallecimiento: `${fechaFallecimiento}T00:00:00`,
        motivoRetiro: observacionFallecimiento.trim(),
      });

      cerrarFallecimiento();

      await cargarAdultos(0, filtros);

      notifications.show({
        title: "Fallecimiento registrado",
        message: "El fallecimiento del adulto mayor se registró correctamente.",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error al registrar",
        message: "No se pudo registrar el fallecimiento del adulto mayor.",
        color: "red",
      });
    } finally {
      setRegistrandoFallecimiento(false);
    }
  }

  async function confirmarDesactivacion() {
    if (!seleccionado || !fechaRetiro || !motivoRetiro.trim()) {
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      await desactivarAdultoMayor(seleccionado.adultoId, {
        fechaRetiro,
        motivoRetiro: motivoRetiro.trim(),
      });

      setSeleccionado(null);
      setFechaRetiro("");
      setMotivoRetiro("");

      await cargarAdultos(0, filtros);
    } catch {
      setError("No se pudo desactivar el registro del adulto mayor.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className={classes.container}>
      <Group justify="space-between" align="center" className={classes.heading}>
        <Title order={2} className={classes.pageTitle}>
          Adultos Mayores
        </Title>

        <div className={classes.btnBar}>
          {(user?.rol === "ROLE_ADMIN" || user?.rol === "ROLE_AYUDANTE") && (
            <Button
              leftSection={<BsPlusLg size={15} />}
              onClick={() => navigate("/adultosMayores/registrar")}
            >
              Registrar Adulto Mayor
            </Button>
          )}

          {(user?.rol === "ROLE_ADMIN" || user?.rol === "ROLE_AYUDANTE") && (
            <Menu position="top-end" withinPortal radius="md">
              <Menu.Target>
                <Button
                  rightSection={<TbChevronDown size={18} />}
                  className={classes.reportBtn}
                >
                  Generar Reporte
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<TbFileTypePdf size={16} />}
                  onClick={() => handleGenerateReport("pdf")}
                >
                  PDF
                </Menu.Item>
                <Menu.Item
                  leftSection={<TbFileTypeXls size={16} />}
                  onClick={() => handleGenerateReport("excel")}
                >
                  Excel
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </div>
      </Group>

      <div className={classes.titleRule} />

      <div className={filterClasses.filterBar}>
        <TextInput
          placeholder={"Buscar por nombre o identificación"}
          leftSection={<AiOutlineSearch size={17} />}
          value={filtros.searchTerm ?? ""}
          onChange={(event) => {
            const value = event.currentTarget.value;

            setFiltros({
              ...filtros,
              searchTerm: value === "" ? null : value,
            });
          }}
          classNames={{
            input: filterClasses.input,
            root: filterClasses.field,
          }}
        />

        <Select
          value={filtros.estado}
          onChange={cambiarEstado}
          data={[
            {
              value: "ACTIVO",
              label: "Activos",
            },
            {
              value: "INACTIVO",
              label: "Inactivos",
            },
            {
              value: "FALLECIDO",
              label: "Fallecidos",
            },
          ]}
          classNames={{
            input: filterClasses.input,
            root: filterClasses.field,
          }}
        />

        <Button
          className={filterClasses.searchButton}
          onClick={() => {
            setFiltrosAplicados(filtros);
            void cargarAdultos(0, filtros);
          }}
        >
          Buscar
        </Button>
      </div>

      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className={classes.loadingState}>
          <Loader color={"var(--color-primary)"} />
        </div>
      ) : (
        <>
          <AdultosMayoresTable
            adultosMayores={pageData?.content ?? []}
            estadoListado={filtrosAplicados.estado}
            onDesactivar={setAdultoAProcesarBaja}
            onActivar={setAdultoAActivar}
          />
          <Group justify="center" className={filterClasses.paginationBar}>
            <Pagination
              value={(pageData?.currentPage ?? 0) + 1}
              onChange={(page) => {
                void cargarAdultos(page - 1, filtros);
              }}
              total={Math.max(pageData?.totalPages ?? 0, 1)}
              classNames={{
                control: filterClasses.pageControl,
                root: filterClasses.paginationRoot,
              }}
            />
          </Group>
        </>
      )}

      <Modal
        opened={adultoAProcesarBaja !== null}
        onClose={() => setAdultoAProcesarBaja(null)}
        title={
          <Stack gap={2}>
            <Title order={3}>Desactivar adulto mayor</Title>

            <Text size="sm" c="dimmed" fw={400}>
              Seleccione la situación correspondiente al registro.
            </Text>
          </Stack>
        }
        centered
      >
        <Text size="sm" mb="lg">
          Adulto mayor: <strong>{adultoAProcesarBaja?.nombreCompleto}</strong>
        </Text>

        <Stack gap="lg">
          <div>
            <Text fw={600}>Desactivar registro</Text>

            <Text size="sm" c="dimmed" mt={3} mb="sm">
              Utilice esta opción cuando el adulto mayor se retire del centro o
              exista otro motivo de retiro.
            </Text>

            <Button
              variant="light"
              color="orange"
              fullWidth
              onClick={seleccionarDesactivacion}
            >
              Desactivar registro
            </Button>
          </div>

          <div>
            <Text fw={600}>Registrar fallecimiento</Text>

            <Text size="sm" c="dimmed" mt={3} mb="sm">
              Utilice esta opción para registrar el fallecimiento del adulto
              mayor en su expediente.
            </Text>

            <Button
              variant="light"
              color="red"
              fullWidth
              onClick={seleccionarFallecimiento}
            >
              Registrar fallecimiento
            </Button>
          </div>

          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => setAdultoAProcesarBaja(null)}
            >
              Cancelar
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={seleccionado !== null}
        onClose={cerrarDesactivacion}
        title={"Desactivar adulto mayor"}
        centered
      >
        <Text size="sm" mb="md">
          Se desactivará el registro de {seleccionado?.nombreCompleto}. Esta
          acción no elimina su expediente.
        </Text>

        <TextInput
          type="datetime-local"
          label="Fecha de retiro"
          required
          value={fechaRetiro}
          onChange={(event) => {
            setFechaRetiro(event.currentTarget.value);
          }}
          mb="md"
        />

        <Textarea
          label="Motivo del retiro"
          required
          autosize
          minRows={3}
          maxLength={200}
          value={motivoRetiro}
          onChange={(event) => {
            setMotivoRetiro(event.currentTarget.value);
          }}
        />

        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={cerrarDesactivacion}>
            Cancelar
          </Button>

          <Button
            color="red"
            loading={guardando}
            disabled={!fechaRetiro || !motivoRetiro.trim()}
            onClick={() => {
              void confirmarDesactivacion();
            }}
          >
            Desactivar
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={adultoAActivar !== null}
        onClose={() => {
          if (!activando) {
            setAdultoAActivar(null);
          }
        }}
        title="Activar adulto mayor"
        centered
      >
        <Text size="sm">
          ¿Desea volver a activar el registro de{" "}
          <strong>{adultoAActivar?.nombreCompleto}</strong>?
        </Text>

        <Text size="sm" c="dimmed" mt="xs">
          El adulto mayor volverá a aparecer entre los registros activos.
        </Text>

        <Group justify="flex-end" gap="sm" mt="lg">
          <Button
            variant="default"
            disabled={activando}
            onClick={() => setAdultoAActivar(null)}
          >
            Cancelar
          </Button>

          <Button
            loading={activando}
            onClick={() => void confirmarActivacion()}
          >
            Activar
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={adultoAFallecimiento !== null}
        onClose={cerrarFallecimiento}
        title={
          <Stack gap={2}>
            <Title order={3}>Registrar fallecimiento</Title>

            <Text size="sm" c="dimmed" fw={400}>
              Registre la fecha de fallecimiento del adulto mayor.
            </Text>
          </Stack>
        }
        centered
      >
        <Text size="sm" mb="md">
          Se registrará el fallecimiento de{" "}
          <strong>{adultoAFallecimiento?.nombreCompleto}</strong>.
        </Text>

        <TextInput
          type="date"
          label="Fecha de fallecimiento"
          required
          value={fechaFallecimiento}
          onChange={(event) => setFechaFallecimiento(event.currentTarget.value)}
          mb="md"
        />

        <Textarea
          label="Observación"
          description="Este campo es opcional."
          autosize
          minRows={3}
          maxLength={200}
          value={observacionFallecimiento}
          onChange={(event) =>
            setObservacionFallecimiento(event.currentTarget.value)
          }
        />

        <Group justify="flex-end" gap="sm" mt="lg">
          <Button
            variant="default"
            disabled={registrandoFallecimiento}
            onClick={cerrarFallecimiento}
          >
            Cancelar
          </Button>

          <Button
            color="red"
            loading={registrandoFallecimiento}
            disabled={!fechaFallecimiento}
            onClick={() => void confirmarFallecimiento()}
          >
            Registrar fallecimiento
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
