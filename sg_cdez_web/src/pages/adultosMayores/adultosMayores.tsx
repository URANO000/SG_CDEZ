import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Group,
  Loader,
  Modal,
  Pagination,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";

import { AiOutlineSearch } from "react-icons/ai";

import { useNavigate } from "react-router";

import { BsPlusLg } from "react-icons/bs";

import { AdultosMayoresTable } from "../../components/ui/tables/AdultosMayoresTable";

import { useAuth } from "../../services/authContext";

import {
  desactivarAdultoMayor,
  listarAdultosMayoresFiltrados,
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
  const [filtros, setFiltros] = useState<AdultoMayorFiltro>({
    searchTerm: null,
    estado: "ACTIVO",
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

  const pageSize = 10;

  async function cargarAdultos(
    page: number,
    filtrosConsulta: AdultoMayorFiltro = filtros,
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

  useEffect(() => {
    const filtrosIniciales: AdultoMayorFiltro = {
      searchTerm: null,
      estado: "ACTIVO",
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

        {user?.rol === "ROLE_ADMIN" && (
          <Button
            leftSection={<BsPlusLg size={15} />}
            onClick={() => navigate("/adultosMayores/registrar")}
          >
            Registrar Adulto Mayor
          </Button>
        )}
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
            onDesactivar={abrirDesactivacion}
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
    </div>
  );
}
