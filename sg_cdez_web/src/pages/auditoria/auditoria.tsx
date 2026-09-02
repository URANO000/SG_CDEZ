import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Group,
  Loader,
  Pagination,
  TextInput,
  Title,
  Modal,
  Table,
  Text,
  Tabs,
} from "@mantine/core";

import { AiOutlineSearch } from "react-icons/ai";
import { BsSliders } from "react-icons/bs";

import { AuditoriaTable } from "../../components/ui/tables/AuditoriaTable";

import { listarAuditorias } from "../../services/auditoriaService";

import type {
  AuditoriaFiltros,
  AuditoriaResponse,
} from "../../services/interfaces/auditoriaInterface";
import filterClasses from "../../components/ui/tables/Filter.module.css";
import classes from "./Auditoria.module.css";

type SeccionAuditoria =
  | "GENERAL"
  | "EXPEDIENTES"
  | "CONSULTAS"
  | "PERSONAL"
  | "SESIONES";

const MODULOS_POR_SECCION: Record<SeccionAuditoria, string[] | undefined> = {
  GENERAL: undefined,

  EXPEDIENTES: [
    "ADULTO_MAYOR",
    "ENCARGADO_LEGAL",
    "EPICRISIS",
    "DOCUMENTO",
    "MEDICAMENTO",
  ],

  CONSULTAS: ["CONSULTA"],

  PERSONAL: ["PERSONAL", "PERFIL"],

  SESIONES: ["AUTENTICACION"],
};

export function Auditoria() {
  const [auditorias, setAuditorias] = useState<AuditoriaResponse[]>([]);

  const [seccion, setSeccion] = useState<SeccionAuditoria>("GENERAL");

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auditoriaSeleccionada, setAuditoriaSeleccionada] =
    useState<AuditoriaResponse | null>(null);

  // Filtros
  const [usuario, setUsuario] = useState("");

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  // Filtros que ya fueron enviados al backend
  const [filtrosAplicados, setFiltrosAplicados] = useState<AuditoriaFiltros>(
    {},
  );

  function formatearTexto(valor: string) {
    return valor
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letra) => letra.toUpperCase());
  }

  function formatearFecha(fecha: string) {
    return new Intl.DateTimeFormat("es-CR", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(fecha));
  }

  function formatearValor(valor: unknown) {
    if (valor === null || valor === undefined || valor === "") {
      return "Sin valor";
    }

    if (typeof valor === "boolean") {
      return valor ? "Sí" : "No";
    }

    if (typeof valor === "object") {
      return JSON.stringify(valor);
    }

    return String(valor);
  }
  function esCambioDetallado(valor: unknown): valor is {
    anterior: unknown;
    nuevo: unknown;
  } {
    return (
      typeof valor === "object" &&
      valor !== null &&
      ("anterior" in valor || "nuevo" in valor)
    );
  }
  useEffect(() => {
    async function cargarAuditorias() {
      try {
        setCargando(true);
        setError(null);

        const respuesta = await listarAuditorias(
          filtrosAplicados,
          pagina - 1,
          10,
        );

        setAuditorias(respuesta.content);
        setTotalPaginas(respuesta.totalPages);
      } catch (err) {
        console.error("Error al cargar auditorías:", err);

        setError("No fue posible cargar los registros de auditoría.");
      } finally {
        setCargando(false);
      }
    }

    cargarAuditorias();
  }, [pagina, filtrosAplicados]);

  function cambiarSeccion(valor: string | null) {
    const nuevaSeccion = (valor as SeccionAuditoria | null) ?? "GENERAL";

    setSeccion(nuevaSeccion);
    setPagina(1);

    setFiltrosAplicados((actuales) => ({
      ...actuales,
      modulos: MODULOS_POR_SECCION[nuevaSeccion],
    }));
  }

  function buscar() {
    const filtros: AuditoriaFiltros = {
      usuario: usuario.trim() || undefined,

      modulos: MODULOS_POR_SECCION[seccion],

      fechaDesde: fechaDesde ? `${fechaDesde}T00:00:00` : undefined,

      fechaHasta: fechaHasta ? `${fechaHasta}T23:59:59` : undefined,
    };

    setPagina(1);
    setFiltrosAplicados(filtros);
  }

  function limpiarFiltros() {
    setUsuario("");
    setFechaDesde("");
    setFechaHasta("");

    setPagina(1);

    setFiltrosAplicados({
      modulos: MODULOS_POR_SECCION[seccion],
    });
  }

  return (
    <div className={filterClasses.mainpg}>
      <header className={classes.pageHeader}>
        <Title order={2} className={classes.pageTitle}>
          Auditoría
        </Title>

        <Text className={classes.pageDescription}>
          Consulte las acciones realizadas por los usuarios dentro del sistema.
        </Text>
      </header>
      <div className={filterClasses.subpg}>
        <Tabs
          value={seccion}
          onChange={cambiarSeccion}
          classNames={{
            root: classes.tabs,
            list: classes.tabList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="GENERAL">Actividad general</Tabs.Tab>

            <Tabs.Tab value="EXPEDIENTES">Expedientes</Tabs.Tab>

            <Tabs.Tab value="CONSULTAS">Consultas</Tabs.Tab>

            <Tabs.Tab value="PERSONAL">Personal</Tabs.Tab>

            <Tabs.Tab value="SESIONES">Sesiones</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {/* FILTROS PRINCIPALES */}
        <div className={filterClasses.filterBar}>
          <TextInput
            placeholder="Buscar por usuario"
            value={usuario}
            onChange={(event) => setUsuario(event.currentTarget.value)}
            leftSection={<AiOutlineSearch size={17} />}
            classNames={{
              input: filterClasses.input,
              root: filterClasses.field,
            }}
          />

          <Button
            variant="default"
            leftSection={<BsSliders size={16} />}
            onClick={() => setMostrarFiltrosAvanzados((actual) => !actual)}
          >
            Más filtros
          </Button>

          <Button className={filterClasses.searchButton} onClick={buscar}>
            Buscar
          </Button>
        </div>

        {/* FILTROS DE FECHA */}
        {mostrarFiltrosAvanzados && (
          <Group mb="md" mt="xs">
            <TextInput
              type="date"
              label="Fecha desde"
              value={fechaDesde}
              onChange={(event) => setFechaDesde(event.currentTarget.value)}
            />

            <TextInput
              type="date"
              label="Fecha hasta"
              value={fechaHasta}
              onChange={(event) => setFechaHasta(event.currentTarget.value)}
            />

            <Button variant="default" mt={25} onClick={limpiarFiltros}>
              Limpiar filtros
            </Button>
          </Group>
        )}

        {/* ERROR */}
        {error && (
          <Alert color="red" mb="md">
            {error}
          </Alert>
        )}

        {/* CONTENIDO */}
        {cargando ? (
          <Group justify="center" py="xl">
            <Loader color="var(--color-primary)" />
          </Group>
        ) : (
          <>
            <AuditoriaTable
              auditorias={auditorias}
              onConsultar={setAuditoriaSeleccionada}
            />

            <Group justify="center" className={filterClasses.paginationBar}>
              <Pagination
                value={pagina}
                onChange={setPagina}
                total={Math.max(totalPaginas, 1)}
                classNames={{
                  control: filterClasses.pageControl,
                  root: filterClasses.paginationRoot,
                }}
              />
            </Group>
          </>
        )}
        <Modal
          opened={auditoriaSeleccionada !== null}
          onClose={() => setAuditoriaSeleccionada(null)}
          title="Detalle de auditoría"
          centered
          size="lg"
        >
          {auditoriaSeleccionada && (
            <>
              <Title order={4} mb="md">
                Información del registro
              </Title>

              <Table verticalSpacing="sm" withRowBorders={false}>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td fw={600}>Usuario</Table.Td>

                    <Table.Td>{auditoriaSeleccionada.nombreUsuario}</Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Td fw={600}>Correo</Table.Td>

                    <Table.Td>{auditoriaSeleccionada.usuario}</Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Td fw={600}>Acción</Table.Td>

                    <Table.Td>
                      {formatearTexto(auditoriaSeleccionada.accion)}
                    </Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Td fw={600}>Módulo</Table.Td>

                    <Table.Td>
                      {formatearTexto(auditoriaSeleccionada.modulo)}
                    </Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Td fw={600}>Entidad afectada</Table.Td>

                    <Table.Td>{auditoriaSeleccionada.entidadAfectada}</Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Td fw={600}>Fecha y hora</Table.Td>

                    <Table.Td>
                      {formatearFecha(auditoriaSeleccionada.createdAt)}
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              <Title order={4} mt="xl" mb="xs">
                Descripción
              </Title>

              <Text>
                {auditoriaSeleccionada.descripcion || "Sin descripción."}
              </Text>

              {auditoriaSeleccionada.cambios &&
                Object.keys(auditoriaSeleccionada.cambios).length > 0 && (
                  <>
                    <Title order={4} mt="xl" mb="md">
                      Cambios realizados
                    </Title>

                    <Table
                      withTableBorder
                      withColumnBorders
                      verticalSpacing="sm"
                    >
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Campo</Table.Th>
                          <Table.Th>Valor anterior</Table.Th>
                          <Table.Th>Valor nuevo</Table.Th>
                        </Table.Tr>
                      </Table.Thead>

                      <Table.Tbody>
                        {Object.entries(auditoriaSeleccionada.cambios).map(
                          ([campo, cambio]) => (
                            <Table.Tr key={campo}>
                              <Table.Td fw={600}>
                                {formatearTexto(campo)}
                              </Table.Td>

                              <Table.Td>
                                {esCambioDetallado(cambio)
                                  ? formatearValor(cambio.anterior)
                                  : "No aplica"}
                              </Table.Td>

                              <Table.Td>
                                {esCambioDetallado(cambio)
                                  ? formatearValor(cambio.nuevo)
                                  : formatearValor(cambio)}
                              </Table.Td>
                            </Table.Tr>
                          ),
                        )}
                      </Table.Tbody>
                    </Table>
                  </>
                )}
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}
