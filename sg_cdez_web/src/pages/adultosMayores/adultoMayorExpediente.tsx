import { useEffect, useState } from "react";

import {
  ActionIcon,
  Alert,
  Badge,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  Title,
  Button,
  Pagination,
  Select,
} from "@mantine/core";

import axios from "axios";

import type { EpicrisisResponse } from "../../services/interfaces/epicrisisInterface";

import { BsArrowLeft } from "react-icons/bs";

import { useNavigate, useParams } from "react-router";

import { obtenerAdultoMayorPorId } from "../../services/adultoMayorService";

import type { AdultoMayorResponse } from "../../services/interfaces/adultoMayorInterface";

import { listarEncargadosPorAdulto } from "../../services/encargadoLegalService";

import type { EncargadoLegalResponse } from "../../services/interfaces/encargadoLegalInterface";

import classes from "./Expediente.module.css";

import { EpicrisisTable } from "../../components/ui/tables/EpicrisisTable";

import {
  descargarEpicrisis,
  listarHistorialEpicrisis,
  obtenerEpicrisisVigente,
} from "../../services/epicrisisService";

import type { PageResponse } from "../../services/interfaces/pageResponse";

interface CampoInformacion {
  etiqueta: string;
  valor: string;
}

function mostrarFecha(fecha: string | null): string {
  if (!fecha) {
    return "No registrada";
  }

  return new Intl.DateTimeFormat("es-CR").format(new Date(fecha));
}

function mostrarSexo(sexo: string): string {
  if (sexo === "H") {
    return "Hombre";
  }

  if (sexo === "M") {
    return "Mujer";
  }

  return sexo;
}

function Campo({ etiqueta, valor }: CampoInformacion) {
  return (
    <div>
      <Text className={classes.label}>{etiqueta}</Text>

      <Text className={classes.value}>{valor}</Text>
    </div>
  );
}

export function AdultoMayorExpediente() {
  const { adultoId } = useParams();
  const navigate = useNavigate();

  const [adultoMayor, setAdultoMayor] = useState<AdultoMayorResponse | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  const [encargados, setEncargados] = useState<EncargadoLegalResponse[]>([]);

  const [encargadosLoading, setEncargadosLoading] = useState(true);

  const [encargadosError, setEncargadosError] = useState(false);

  const [epicrisisVigente, setEpicrisisVigente] =
    useState<EpicrisisResponse | null>(null);

  const [historialEpicrisis, setHistorialEpicrisis] =
    useState<PageResponse<EpicrisisResponse> | null>(null);

  const [historialLoading, setHistorialLoading] = useState(true);

  const [historialError, setHistorialError] = useState(false);

  const [anioEpicrisis, setAnioEpicrisis] = useState<string | null>(null);

  const cantidadEpicrisis = 5;

  const [epicrisisLoading, setEpicrisisLoading] = useState(true);

  const [epicrisisError, setEpicrisisError] = useState(false);

  async function cargarHistorialEpicrisis(pagina: number, anio?: number) {
    if (!adultoId) return;

    try {
      setHistorialLoading(true);
      setHistorialError(false);

      const response = await listarHistorialEpicrisis(
        adultoId,
        pagina,
        cantidadEpicrisis,
        anio,
      );

      setHistorialEpicrisis(response);
    } catch {
      setHistorialError(true);
    } finally {
      setHistorialLoading(false);
    }
  }

  useEffect(() => {
    if (!adultoId) return;

    void cargarHistorialEpicrisis(0);
  }, [adultoId]);

  useEffect(() => {
    const id = adultoId;

    if (!id) {
      return;
    }

    obtenerAdultoMayorPorId(id)
      .then(setAdultoMayor)
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });

    listarEncargadosPorAdulto(id)
      .then(setEncargados)
      .catch(() => {
        setEncargadosError(true);
      })
      .finally(() => {
        setEncargadosLoading(false);
      });
  }, [adultoId]);

  useEffect(() => {
    if (!adultoId) return;

    async function cargarEpicrisisVigente() {
      try {
        setEpicrisisLoading(true);
        setEpicrisisError(false);

        const epicrisis = await obtenerEpicrisisVigente(adultoId!);
        setEpicrisisVigente(epicrisis);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setEpicrisisVigente(null);
        } else {
          setEpicrisisError(true);
        }
      } finally {
        setEpicrisisLoading(false);
      }
    }

    void cargarEpicrisisVigente();
  }, [adultoId]);

  if (!adultoId) {
    return (
      <Alert color="red">No se indicó el expediente que desea consultar.</Alert>
    );
  }

  if (loading) {
    return (
      <div className={classes.loadingState}>
        <Loader color="var(--color-primary)" />
      </div>
    );
  }

  if (error || !adultoMayor) {
    return (
      <Alert color="red">
        No se pudo cargar el expediente del adulto mayor.
      </Alert>
    );
  }

  const resumen: CampoInformacion[] = [
    {
      etiqueta: "Nombre completo",
      valor: adultoMayor.nombreCompleto,
    },
    {
      etiqueta: "Identificación",
      valor: adultoMayor.identificacion,
    },
    {
      etiqueta: "Fecha de ingreso",
      valor: mostrarFecha(adultoMayor.fechaIngreso),
    },
    {
      etiqueta: "Nacionalidad",
      valor: adultoMayor.nacionalidad,
    },
    {
      etiqueta: "Sexo",
      valor: mostrarSexo(adultoMayor.sexo),
    },
    {
      etiqueta: "Estado",
      valor: adultoMayor.activo,
    },
  ];

  const informacionGeneral: CampoInformacion[] = [
    {
      etiqueta: "Tipo de identificación",
      valor: adultoMayor.tipoIdentificacion,
    },
    {
      etiqueta: "Identificación",
      valor: adultoMayor.identificacion,
    },
    {
      etiqueta: "Fecha de nacimiento",
      valor: mostrarFecha(adultoMayor.fechaNacimiento),
    },
    {
      etiqueta: "Nacionalidad",
      valor: adultoMayor.nacionalidad,
    },
    {
      etiqueta: "Dirección",
      valor: adultoMayor.direccion,
    },
    {
      etiqueta: "Escolaridad",
      valor: adultoMayor.escolaridad,
    },
    {
      etiqueta: "Grupo familiar",
      valor: adultoMayor.grupoFamiliar ?? "No registrado",
    },
    {
      etiqueta: "Recibe pensión",
      valor: adultoMayor.pension ? "Sí" : "No",
    },
    {
      etiqueta: "Funcionalidad física",
      valor: adultoMayor.funcionalidadFisica ?? "No registrada",
    },
    {
      etiqueta: "Ayuda biomecánica",
      valor: adultoMayor.ayudaBiomecanica ? "Sí" : "No",
    },
  ];

  async function manejarDescargaEpicrisis(epicrisis: EpicrisisResponse) {
    try {
      const archivo = await descargarEpicrisis(epicrisis.epicrisisId);

      const url = URL.createObjectURL(archivo);
      const enlace = document.createElement("a");

      enlace.href = url;
      enlace.download = epicrisis.nombreArchivo;

      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();

      URL.revokeObjectURL(url);
    } catch {
      window.alert("No se pudo descargar la epicrisis.");
    }
  }

  return (
    <div className={classes.container}>
      <Group gap="sm" className={classes.topBar}>
        <ActionIcon
          variant="subtle"
          aria-label="Volver al listado"
          onClick={() => {
            navigate("/adultosMayores");
          }}
        >
          <BsArrowLeft size={18} />
        </ActionIcon>

        <div>
          <Title order={2} className={classes.pageTitle}>
            Adultos Mayores
          </Title>

          <Text size="sm" className={classes.breadcrumb}>
            Adultos Mayores » Expediente
          </Text>
        </div>
      </Group>

      <Paper className={classes.headerCard}>
        <Group justify="space-between" wrap="wrap">
          <div>
            <Text className={classes.label}>Expediente digital</Text>

            <Title order={3} className={classes.personName}>
              {adultoMayor.nombreCompleto}
            </Title>

            <Text size="sm" className={classes.secondaryText}>
              {adultoMayor.tipoIdentificacion}
              {": "}
              {adultoMayor.identificacion}
            </Text>
          </div>

          <Badge
            size="lg"
            className={
              adultoMayor.activo === "Activo"
                ? classes.badgeActive
                : classes.badgeInactive
            }
          >
            {adultoMayor.activo}
          </Badge>
        </Group>
      </Paper>

      <Tabs defaultValue="resumen" className={classes.tabs}>
        <Tabs.List>
          <Tabs.Tab value="resumen">Resumen</Tabs.Tab>

          <Tabs.Tab value="general">Información general</Tabs.Tab>

          <Tabs.Tab value="encargados">Encargados legales</Tabs.Tab>

          <Tabs.Tab value="epicrisis">Epicrisis</Tabs.Tab>

          <Tabs.Tab value="documentos">Documentos</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="resumen" className={classes.panel}>
          <SimpleGrid
            cols={{
              base: 1,
              sm: 2,
              lg: 3,
            }}
            spacing="xl"
          >
            {resumen.map((campo) => (
              <Campo
                key={campo.etiqueta}
                etiqueta={campo.etiqueta}
                valor={campo.valor}
              />
            ))}
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="general" className={classes.panel}>
          <SimpleGrid
            cols={{
              base: 1,
              sm: 2,
            }}
            spacing="xl"
          >
            {informacionGeneral.map((campo) => (
              <Campo
                key={campo.etiqueta}
                etiqueta={campo.etiqueta}
                valor={campo.valor}
              />
            ))}
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="encargados" className={classes.panel}>
          {encargadosLoading ? (
            <div className={classes.loadingState}>
              <Loader color="var(--color-primary)" />
            </div>
          ) : encargadosError ? (
            <Alert color="red">
              No se pudieron cargar los encargados legales.
            </Alert>
          ) : encargados.length === 0 ? (
            <Text className={classes.emptyState}>
              No hay un encargado legal asociado a este adulto mayor.
            </Text>
          ) : (
            <Stack gap="md" className={classes.encargadosList}>
              {encargados.map((encargado) => {
                const contactosActivos = encargado.contactos.filter(
                  (contacto) => contacto.activo === "Activo",
                );

                const nombreCompleto = [
                  encargado.primerNombre,
                  encargado.segundoNombre,
                  encargado.primerApellido,
                  encargado.segundoApellido,
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <Paper
                    key={encargado.encargadoId}
                    className={classes.encargadoCard}
                  >
                    <Title order={4} className={classes.encargadoName}>
                      {nombreCompleto}
                    </Title>

                    <SimpleGrid
                      cols={{
                        base: 1,
                        sm: 2,
                      }}
                      spacing="lg"
                    >
                      <Campo
                        etiqueta={"Tipo de identificación"}
                        valor={encargado.tipoIdentificacion}
                      />

                      <Campo
                        etiqueta="Identificación"
                        valor={encargado.identificacion}
                      />

                      <Campo etiqueta="Dirección" valor={encargado.direccion} />

                      <Campo
                        etiqueta="Estado"
                        valor={encargado.activo ? "Activo" : "Inactivo"}
                      />
                    </SimpleGrid>

                    <div className={classes.contactosSection}>
                      <Text className={classes.label}>Contactos</Text>

                      {contactosActivos.length > 0 ? (
                        <div className={classes.contactosList}>
                          {contactosActivos.map((contacto) => (
                            <div
                              key={contacto.contactoId}
                              className={classes.contactoRow}
                            >
                              <Text className={classes.contactoType}>
                                {contacto.tipoValor}
                              </Text>

                              <Text className={classes.value}>
                                {contacto.valor}
                              </Text>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Text className={classes.emptyState}>
                          Sin contactos activos registrados.
                        </Text>
                      )}
                    </div>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="epicrisis" className={classes.panel}>
          {epicrisisLoading ? (
            <div className={classes.loadingSection}>
              <Loader color="var(--color-primary)" />
            </div>
          ) : epicrisisError ? (
            <Alert color="red">No se pudo cargar la epicrisis vigente.</Alert>
          ) : !epicrisisVigente ? (
            <div className={classes.emptyState}>
              No existe una epicrisis vigente registrada.
            </div>
          ) : (
            <Paper className={classes.epicrisisCard}>
              <Group justify="space-between" mb="lg">
                <div>
                  <Text className={classes.label}>Epicrisis vigente</Text>

                  <Title order={4} className={classes.personName}>
                    {epicrisisVigente.centroSalud}
                  </Title>
                </div>

                <Badge className={classes.badgeActive}>Vigente</Badge>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                <Campo
                  etiqueta="Fecha de emisión"
                  valor={mostrarFecha(epicrisisVigente.fechaEmision)}
                />

                <Campo
                  etiqueta="Fecha de recepción"
                  valor={mostrarFecha(epicrisisVigente.fechaRecepcion)}
                />

                <Campo
                  etiqueta="Nombre del archivo"
                  valor={epicrisisVigente.nombreArchivo}
                />

                <Campo
                  etiqueta="Tipo de archivo"
                  valor={epicrisisVigente.tipoArchivo}
                />
              </SimpleGrid>
            </Paper>
          )}

          <div className={classes.historySection}>
            <Group
              justify="space-between"
              align="end"
              wrap="wrap"
              className={classes.historyHeader}
            >
              <div>
                <Title order={4} className={classes.personName}>
                  Historial de epicrisis
                </Title>

                <Text size="sm" className={classes.secondaryText}>
                  Epicrisis anteriores asociadas al adulto mayor.
                </Text>
              </div>

              <Group gap="sm" align="end">
                <Select
                  label="Año"
                  placeholder="Todos los años"
                  clearable
                  value={anioEpicrisis}
                  onChange={setAnioEpicrisis}
                  data={Array.from({ length: 10 }, (_, indice) => {
                    const anio = new Date().getFullYear() - indice;

                    return {
                      value: anio.toString(),
                      label: anio.toString(),
                    };
                  })}
                />

                <Button
                  className={classes.filterButton}
                  onClick={() =>
                    void cargarHistorialEpicrisis(
                      0,
                      anioEpicrisis ? Number(anioEpicrisis) : undefined,
                    )
                  }
                >
                  Filtrar
                </Button>
              </Group>
            </Group>

            {historialLoading ? (
              <div className={classes.loadingSection}>
                <Loader color="var(--color-primary)" />
              </div>
            ) : historialError ? (
              <Alert color="red">
                No se pudo cargar el historial de epicrisis.
              </Alert>
            ) : (
              <>
                <EpicrisisTable
                  epicrisis={historialEpicrisis?.content ?? []}
                  onDescargar={manejarDescargaEpicrisis}
                />

                <Group justify="center" className={classes.paginationBar}>
                  <Pagination
                    value={(historialEpicrisis?.currentPage ?? 0) + 1}
                    onChange={(pagina) =>
                      void cargarHistorialEpicrisis(
                        pagina - 1,
                        anioEpicrisis ? Number(anioEpicrisis) : undefined,
                      )
                    }
                    total={Math.max(historialEpicrisis?.totalPages ?? 0, 1)}
                  />
                </Group>
              </>
            )}
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="documentos" className={classes.panelPlaceholder}>
          Los documentos del expediente se integrarán posteriormente.
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
