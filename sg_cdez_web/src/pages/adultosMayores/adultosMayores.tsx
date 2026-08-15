import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Button,
  Group,
  Loader,
  Modal,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";

import { AiOutlineSearch } from "react-icons/ai";
import { BsPlusLg } from "react-icons/bs";

import { AdultosMayoresTable } from "../../components/ui/tables/AdultosMayoresTable";

import {
  desactivarAdultoMayor,
  listarAdultosMayores,
} from "../../services/adultoMayorService";

import type {
  AdultoMayorResponse,
  EstadoAdultoMayor,
} from "../../services/interfaces/adultoMayorInterface";

import classes from "./AdultosMayores.module.css";

function obtenerFechaHoraLocal(): string {
  const fechaActual = new Date();

  fechaActual.setMinutes(
    fechaActual.getMinutes() - fechaActual.getTimezoneOffset(),
  );

  return fechaActual.toISOString().slice(0, 16);
}

export function AdultosMayores() {
  const [adultosMayores, setAdultosMayores] = useState<AdultoMayorResponse[]>(
    [],
  );

  const [estado, setEstado] = useState<EstadoAdultoMayor>("activos");

  const [busqueda, setBusqueda] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [seleccionado, setSeleccionado] = useState<AdultoMayorResponse | null>(
    null,
  );

  const [fechaRetiro, setFechaRetiro] = useState("");

  const [motivoRetiro, setMotivoRetiro] = useState("");

  const [guardando, setGuardando] = useState(false);

  async function cargarAdultos(estadoSeleccionado: EstadoAdultoMayor) {
    setLoading(true);
    setError(null);

    try {
      const registros = await listarAdultosMayores(estadoSeleccionado);

      setAdultosMayores(registros);
    } catch {
      setError("No se pudo cargar la lista de adultos mayores.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    listarAdultosMayores("activos")
      .then(setAdultosMayores)
      .catch(() => {
        setError("No se pudo cargar la lista de adultos mayores.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const resultados = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase("es");

    if (!texto) {
      return adultosMayores;
    }

    return adultosMayores.filter((adultoMayor) => {
      const informacion =
        `${adultoMayor.nombreCompleto} ` + `${adultoMayor.identificacion}`;

      return informacion.toLocaleLowerCase("es").includes(texto);
    });
  }, [adultosMayores, busqueda]);

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

      await cargarAdultos(estado);
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

        <Button leftSection={<BsPlusLg size={15} />} disabled>
          Nuevo registro
        </Button>
      </Group>

      <div className={classes.titleRule} />

      <div className={classes.filterBar}>
        <TextInput
          aria-label="Buscar adulto mayor"
          placeholder={"Buscar por nombre o identificación"}
          leftSection={<AiOutlineSearch size={17} />}
          value={busqueda}
          onChange={(event) => {
            setBusqueda(event.currentTarget.value);
          }}
          className={classes.searchField}
        />

        <Select
          aria-label={"Filtrar adultos mayores por estado"}
          value={estado}
          data={[
            {
              value: "activos",
              label: "Activos",
            },
            {
              value: "inactivos",
              label: "Inactivos",
            },
            {
              value: "fallecidos",
              label: "Fallecidos",
            },
          ]}
          onChange={(value) => {
            if (!value) {
              return;
            }

            const nuevoEstado = value as EstadoAdultoMayor;

            setEstado(nuevoEstado);

            void cargarAdultos(nuevoEstado);
          }}
          className={classes.statusField}
        />
      </div>

      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className={classes.loadingState}>
          <Loader color="var(--color-primary)" />
        </div>
      ) : (
        <AdultosMayoresTable
          adultosMayores={resultados}
          onDesactivar={abrirDesactivacion}
        />
      )}

      <Modal
        opened={seleccionado !== null}
        onClose={cerrarDesactivacion}
        title="Desactivar adulto mayor"
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
