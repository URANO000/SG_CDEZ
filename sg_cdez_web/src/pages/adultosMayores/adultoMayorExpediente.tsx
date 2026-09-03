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
  Modal,
  Tooltip,
} from "@mantine/core";

import axios from "axios";

import type { EpicrisisResponse } from "../../services/interfaces/epicrisisInterface";

import {
  BsArrowLeft,
  BsDownload,
  BsEye,
  BsPencilSquare,
  BsPersonDash,
} from "react-icons/bs";

import { useLocation, useNavigate, useParams } from "react-router";

import { obtenerAdultoMayorPorId } from "../../services/adultoMayorService";

import type { AdultoMayorResponse } from "../../services/interfaces/adultoMayorInterface";

import { useAuth } from "../../services/authContext";

import {
  desactivarEncargadoLegal,
  listarEncargadosPorAdulto,
} from "../../services/encargadoLegalService";

import type { EncargadoLegalResponse } from "../../services/interfaces/encargadoLegalInterface";

import classes from "./Expediente.module.css";

import { EpicrisisTable } from "../../components/ui/tables/EpicrisisTable";

import { EpicrisisForm } from "../../components/ui/forms/EpicrisisForm";

import { MedicamentoForm } from "../../components/ui/forms/MedicamentoForm";

import {
  descargarEpicrisis,
  listarHistorialEpicrisis,
  obtenerEpicrisisVigente,
} from "../../services/epicrisisService";

import { DocumentoTable } from "../../components/ui/tables/DocumentoTable";

import { DocumentoForm } from "../../components/ui/forms/DocumentoForm";

import {
  descargarDocumento,
  desactivarDocumento,
  listarDocumentosPorAdulto,
} from "../../services/documentoService";

import type { DocumentoResponse } from "../../services/interfaces/personalResponse";

import { notifications } from "@mantine/notifications";

import type { PageResponse } from "../../services/interfaces/pageResponse";

import { EncargadoLegalForm } from "../../components/ui/forms/EncargadoLegalForm";

import { EncargadoLegalEditarForm } from "../../components/ui/forms/EncargadoLegalEditarForm";

import { MedicamentoTable } from "../../components/ui/tables/MedicamentoTable";

import { TIPOIDENTIFICACION } from "../../services/interfaces/personalCreateRequest";

import {
  desactivarMedicamento,
  listarMedicamentosPorAdulto,
} from "../../services/medicamentoService";

import type { MedicamentoResponse } from "../../services/interfaces/medicamentoInterface";

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
  if (sexo === "M") {
    return "Masculino";
  }

  if (sexo === "F") {
    return "Femenino";
  }

  return sexo;
}
function mostrarMonto(monto: number | null): string {
  if (monto === null) {
    return "No registrado";
  }

  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 2,
  }).format(monto);
}

function Campo({ etiqueta, valor }: CampoInformacion) {
  return (
    <div>
      <Text className={classes.label}>{etiqueta}</Text>

      <Text className={classes.value}>{valor}</Text>
    </div>
  );
}

function mostrarTipoIdentificacion(tipo: string): string {
  return (
    TIPOIDENTIFICACION.find((opcion) => opcion.value === tipo)?.label ?? tipo
  );
}

export function AdultoMayorExpediente() {
  const { adultoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const puedeGestionarExpediente =
    user?.rol === "ROLE_ADMIN" || user?.rol === "ROLE_AYUDANTE";
  const [adultoMayor, setAdultoMayor] = useState<AdultoMayorResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [encargados, setEncargados] = useState<EncargadoLegalResponse[]>([]);
  const [encargadosLoading, setEncargadosLoading] = useState(true);
  const [encargadosError, setEncargadosError] = useState(false);
  const [modalEncargadoAbierto, setModalEncargadoAbierto] = useState(false);
  const [encargadoAEditar, setEncargadoAEditar] =
    useState<EncargadoLegalResponse | null>(null);
  const [encargadoADesactivar, setEncargadoADesactivar] =
    useState<EncargadoLegalResponse | null>(null);
  const [desactivandoEncargado, setDesactivandoEncargado] = useState(false);
  const [epicrisisVigente, setEpicrisisVigente] =
    useState<EpicrisisResponse | null>(null);
  const [historialEpicrisis, setHistorialEpicrisis] =
    useState<PageResponse<EpicrisisResponse> | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoResponse[]>([]);
  const [documentosLoading, setDocumentosLoading] = useState(true);
  const [documentosError, setDocumentosError] = useState(false);
  const [modalDocumentoAbierto, setModalDocumentoAbierto] = useState(false);
  const [documentoADesactivar, setDocumentoADesactivar] =
    useState<DocumentoResponse | null>(null);
  const [desactivandoDocumento, setDesactivandoDocumento] = useState(false);
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] =
    useState<MedicamentoResponse | null>(null);
  const [medicamentos, setMedicamentos] = useState<MedicamentoResponse[]>([]);
  const [medicamentosLoading, setMedicamentosLoading] = useState(true);
  const [medicamentosError, setMedicamentosError] = useState(false);
  const [medicamentoAEditar, setMedicamentoAEditar] =
    useState<MedicamentoResponse | null>(null);

  const [medicamentoADesactivar, setMedicamentoADesactivar] =
    useState<MedicamentoResponse | null>(null);

  const [desactivandoMedicamento, setDesactivandoMedicamento] = useState(false);
  const [modalMedicamentoAbierto, setModalMedicamentoAbierto] = useState(false);
  const [historialLoading, setHistorialLoading] = useState(true);
  const [historialError, setHistorialError] = useState(false);
  const [anioEpicrisis, setAnioEpicrisis] = useState<string | null>(null);
  const cantidadEpicrisis = 5;
  const [epicrisisLoading, setEpicrisisLoading] = useState(true);
  const [epicrisisError, setEpicrisisError] = useState(false);
  const [modalEpicrisisAbierto, setModalEpicrisisAbierto] = useState(false);

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

  async function cargarDocumentos() {
    if (!adultoId) {
      return;
    }

    try {
      setDocumentosLoading(true);
      setDocumentosError(false);

      const response = await listarDocumentosPorAdulto(adultoId);

      setDocumentos(response);
    } catch {
      setDocumentosError(true);
    } finally {
      setDocumentosLoading(false);
    }
  }

  async function cargarEncargados() {
    if (!adultoId) {
      return;
    }

    try {
      setEncargadosLoading(true);
      setEncargadosError(false);

      const response = await listarEncargadosPorAdulto(adultoId);

      setEncargados(response);
    } catch {
      setEncargadosError(true);
    } finally {
      setEncargadosLoading(false);
    }
  }

  async function cargarMedicamentos() {
    if (!adultoId) {
      return;
    }

    try {
      setMedicamentosLoading(true);
      setMedicamentosError(false);

      const response = await listarMedicamentosPorAdulto(adultoId);

      setMedicamentos(response);
    } catch {
      setMedicamentosError(true);
    } finally {
      setMedicamentosLoading(false);
    }
  }
  function manejarMedicamentoRegistrado() {
    setModalMedicamentoAbierto(false);
    void cargarMedicamentos();
  }

  function manejarMedicamentoActualizado() {
    setMedicamentoAEditar(null);
    void cargarMedicamentos();
  }

  async function confirmarDesactivacionMedicamento() {
    if (!medicamentoADesactivar) {
      return;
    }

    try {
      setDesactivandoMedicamento(true);

      await desactivarMedicamento(medicamentoADesactivar.medicamentoId);

      setMedicamentoADesactivar(null);
      await cargarMedicamentos();

      notifications.show({
        title: "Medicamento desactivado",
        message: "El medicamento dejó de mostrarse en el expediente.",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error al desactivar",
        message: "No se pudo desactivar el medicamento.",
        color: "red",
      });
    } finally {
      setDesactivandoMedicamento(false);
    }
  }

  useEffect(() => {
    if (!adultoId) {
      return;
    }

    void cargarDocumentos();
  }, [adultoId]);

  useEffect(() => {
    if (!adultoId) return;

    void cargarHistorialEpicrisis(0);
  }, [adultoId]);

  useEffect(() => {
    if (!adultoId) {
      return;
    }

    void cargarMedicamentos();
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
  }, [adultoId]);

  useEffect(() => {
    if (!adultoId) {
      return;
    }

    void cargarEncargados();
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

  const expedienteEditable = adultoMayor.activo === "Activo";

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
      valor: mostrarTipoIdentificacion(adultoMayor.tipoIdentificacion),
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
      etiqueta: "Estado civil",
      valor: adultoMayor.estadoCivil ?? "No registrado",
    },
    {
      etiqueta: "Grado de dependencia",
      valor: adultoMayor.gradoDependencia ?? "No registrado",
    },
    {
      etiqueta: "Cuota mensual",
      valor: mostrarMonto(adultoMayor.cuotaMensual),
    },
    {
      etiqueta: "Recibe pensión",
      valor: adultoMayor.pension ? "Sí" : "No",
    },
    {
      etiqueta: "Tipo de pensión",
      valor: adultoMayor.pension
        ? (adultoMayor.tipoPension ?? "No registrado")
        : "No aplica",
    },
    {
      etiqueta: "Monto de pensión",
      valor: adultoMayor.pension
        ? mostrarMonto(adultoMayor.montoPension)
        : "No aplica",
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

      notifications.show({
        title: "Descarga iniciada",
        message: `Se descargará ${epicrisis.nombreArchivo}.`,
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error de descarga",
        message: "No se pudo descargar la epicrisis.",
        color: "red",
      });
    }
  }

  async function manejarDescargaDocumento(documento: DocumentoResponse) {
    if (documento.documentoId == null) {
      return;
    }

    try {
      const archivo = await descargarDocumento(documento.documentoId);

      const url = URL.createObjectURL(archivo);
      const enlace = document.createElement("a");

      enlace.href = url;
      enlace.download = documento.nombreArchivo;

      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();

      URL.revokeObjectURL(url);

      notifications.show({
        title: "Descarga iniciada",
        message: `Se descargará ${documento.nombreArchivo}.`,
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error de descarga",
        message: "No se pudo descargar el documento.",
        color: "red",
      });
    }
  }

  async function manejarVisualizacionEpicrisis(epicrisis: EpicrisisResponse) {
    const ventana = window.open("", "_blank");

    if (!ventana) {
      notifications.show({
        title: "Ventana bloqueada",
        message: "Permita las ventanas emergentes para visualizar el archivo.",
        color: "orange",
      });

      return;
    }

    try {
      ventana.document.title = "Cargando archivo...";

      const archivo = await descargarEpicrisis(epicrisis.epicrisisId);
      const url = URL.createObjectURL(archivo);
      ventana.location.href = url;

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);
    } catch {
      ventana.close();

      notifications.show({
        title: "Error de visualización",
        message: "No se pudo visualizar la epicrisis.",
        color: "red",
      });
    }
  }

  async function manejarVisualizacionDocumento(documento: DocumentoResponse) {
    if (documento.documentoId == null) {
      return;
    }

    const ventana = window.open("", "_blank");

    if (!ventana) {
      notifications.show({
        title: "Ventana bloqueada",
        message: "Permita las ventanas emergentes para visualizar el archivo.",
        color: "orange",
      });

      return;
    }

    try {
      ventana.document.title = "Cargando archivo...";

      const archivo = await descargarDocumento(documento.documentoId);

      const url = URL.createObjectURL(archivo);

      ventana.location.href = url;

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);
    } catch {
      ventana.close();

      notifications.show({
        title: "Error de visualización",
        message: "No se pudo visualizar el documento.",
        color: "red",
      });
    }
  }

  function manejarEpicrisisRegistrada(epicrisis: EpicrisisResponse) {
    setEpicrisisVigente(epicrisis);
    setModalEpicrisisAbierto(false);
    setAnioEpicrisis(null);

    void cargarHistorialEpicrisis(0);

    notifications.show({
      title: "Epicrisis registrada",
      message: "La epicrisis se registró correctamente.",
      color: "green",
    });
  }

  function manejarDocumentoRegistrado() {
    setModalDocumentoAbierto(false);

    void cargarDocumentos();

    notifications.show({
      title: "Documento adjuntado",
      message: "El documento se adjuntó correctamente al expediente.",
      color: "green",
    });
  }

  function manejarEncargadoRegistrado() {
    setModalEncargadoAbierto(false);

    void cargarEncargados();

    notifications.show({
      title: "Encargado registrado",
      message: "El encargado legal se registró correctamente.",
      color: "green",
    });
  }

  function abrirEdicionEncargado(encargado: EncargadoLegalResponse) {
    setEncargadoAEditar(encargado);
  }

  function manejarEncargadoActualizado(
    encargadoActualizado: EncargadoLegalResponse,
  ) {
    setEncargados((actuales) =>
      actuales.map((encargado) =>
        encargado.encargadoId === encargadoActualizado.encargadoId
          ? encargadoActualizado
          : encargado,
      ),
    );

    setEncargadoAEditar(null);
  }

  async function confirmarDesactivacionEncargado() {
    if (!encargadoADesactivar) {
      return;
    }

    try {
      setDesactivandoEncargado(true);

      await desactivarEncargadoLegal(encargadoADesactivar.encargadoId);

      setEncargadoADesactivar(null);

      await cargarEncargados();

      notifications.show({
        title: "Encargado desactivado",
        message: "El encargado legal dejó de mostrarse en el expediente.",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error al desactivar",
        message: "No se pudo desactivar el encargado legal.",
        color: "red",
      });
    } finally {
      setDesactivandoEncargado(false);
    }
  }

  function solicitarDesactivacionDocumento(documento: DocumentoResponse) {
    setDocumentoADesactivar(documento);
  }

  async function confirmarDesactivacionDocumento() {
    if (documentoADesactivar?.documentoId == null) {
      return;
    }

    try {
      setDesactivandoDocumento(true);

      await desactivarDocumento(documentoADesactivar.documentoId);

      setDocumentoADesactivar(null);

      await cargarDocumentos();

      notifications.show({
        title: "Documento desactivado",
        message: "El documento dejó de mostrarse en el expediente.",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error al desactivar",
        message: "No se pudo desactivar el documento.",
        color: "red",
      });
    } finally {
      setDesactivandoDocumento(false);
    }
  }

  return (
    <div className={classes.container}>
      <Group gap="sm" className={classes.topBar}>
        <ActionIcon
          variant="subtle"
          aria-label="Volver al listado"
          onClick={() => {
            navigate("/adultosMayores", {
              state: {
                estadoListado: location.state?.estadoListado ?? "ACTIVO",
              },
            });
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
              {mostrarTipoIdentificacion(adultoMayor.tipoIdentificacion)}
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

          <Tabs.Tab value="medicamentos">Medicamentos</Tabs.Tab>
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
          <Group justify="space-between" align="center" mb="lg">
            <div>
              <Title order={4} className={classes.personName}>
                Encargados legales
              </Title>

              <Text size="sm" className={classes.secondaryText}>
                Información de contacto asociada al adulto mayor.
              </Text>
            </div>

            {expedienteEditable &&
              puedeGestionarExpediente &&
              (encargados.length < 2 ? (
                <Button onClick={() => setModalEncargadoAbierto(true)}>
                  + Registrar encargado
                </Button>
              ) : (
                <Text size="sm" c="dimmed">
                  Máximo de 2 encargados alcanzado.
                </Text>
              ))}
          </Group>
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
                    <Group justify="space-between" align="flex-start" mb="md">
                      <Title order={4} className={classes.encargadoName}>
                        {nombreCompleto}
                      </Title>

                      {expedienteEditable && puedeGestionarExpediente && (
                        <Group gap={4}>
                          <Tooltip label="Editar">
                            <ActionIcon
                              variant="subtle"
                              aria-label="Editar encargado legal"
                              onClick={() => abrirEdicionEncargado(encargado)}
                            >
                              <BsPencilSquare size={17} />
                            </ActionIcon>
                          </Tooltip>

                          <Tooltip label="Desactivar">
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              aria-label="Desactivar encargado legal"
                              onClick={() => setEncargadoADesactivar(encargado)}
                            >
                              <BsPersonDash size={18} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      )}
                    </Group>

                    <SimpleGrid
                      cols={{
                        base: 1,
                        sm: 2,
                      }}
                      spacing="lg"
                    >
                      <Campo
                        etiqueta="Tipo de identificación"
                        valor={mostrarTipoIdentificacion(
                          encargado.tipoIdentificacion,
                        )}
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
          <Modal
            opened={modalEncargadoAbierto}
            onClose={() => setModalEncargadoAbierto(false)}
            title={
              <Stack gap={2}>
                <Title order={3}>Registrar encargado legal</Title>

                <Text size="sm" c="dimmed" fw={400}>
                  Agregue la información de contacto asociada al adulto mayor.
                </Text>
              </Stack>
            }
            centered
            size="lg"
          >
            <EncargadoLegalForm
              adultoId={adultoId}
              onRegistrado={manejarEncargadoRegistrado}
              onCancelar={() => setModalEncargadoAbierto(false)}
            />
          </Modal>
          <Modal
            opened={encargadoAEditar !== null}
            onClose={() => setEncargadoAEditar(null)}
            title={
              <Stack gap={2}>
                <Title order={3}>Editar encargado legal</Title>

                <Text size="sm" c="dimmed" fw={400}>
                  Actualice la dirección y los contactos del encargado legal.
                </Text>
              </Stack>
            }
            centered
            size="lg"
          >
            {encargadoAEditar && (
              <EncargadoLegalEditarForm
                key={encargadoAEditar.encargadoId}
                encargado={encargadoAEditar}
                onActualizado={manejarEncargadoActualizado}
                onCancelar={() => setEncargadoAEditar(null)}
              />
            )}
          </Modal>
          <Modal
            opened={encargadoADesactivar !== null}
            onClose={() => setEncargadoADesactivar(null)}
            title="Desactivar encargado legal"
            centered
            size="md"
          >
            <Stack gap="lg">
              <Text>
                ¿Desea desactivar este encargado legal? Dejará de mostrarse
                entre los encargados activos asociados al adulto mayor.
              </Text>

              <Group justify="flex-end">
                <Button
                  variant="default"
                  onClick={() => setEncargadoADesactivar(null)}
                >
                  Cancelar
                </Button>

                <Button
                  color="red"
                  loading={desactivandoEncargado}
                  onClick={() => void confirmarDesactivacionEncargado()}
                >
                  Desactivar
                </Button>
              </Group>
            </Stack>
          </Modal>
        </Tabs.Panel>

        <Tabs.Panel value="epicrisis" className={classes.panel}>
          {expedienteEditable && puedeGestionarExpediente && (
            <Group justify="flex-end" mb="lg">
              <Button
                onClick={() => setModalEpicrisisAbierto(true)}
                className={classes.registerButton}
              >
                + Nueva epicrisis
              </Button>
            </Group>
          )}
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
              <Group justify="flex-end" mt="xl">
                <Button
                  variant="outline"
                  leftSection={<BsEye size={16} />}
                  onClick={() =>
                    void manejarVisualizacionEpicrisis(epicrisisVigente)
                  }
                >
                  Visualizar
                </Button>

                <Button
                  leftSection={<BsDownload size={16} />}
                  className={classes.registerButton}
                  onClick={() =>
                    void manejarDescargaEpicrisis(epicrisisVigente)
                  }
                >
                  Descargar
                </Button>
              </Group>
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
                  onVisualizar={manejarVisualizacionEpicrisis}
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
          <Modal
            opened={modalEpicrisisAbierto}
            onClose={() => setModalEpicrisisAbierto(false)}
            title={
              <Stack gap={2}>
                <Title order={3}>Registrar nueva epicrisis</Title>

                <Text size="sm" c="dimmed" fw={400}>
                  Ingrese la información correspondiente a la epicrisis.
                </Text>
              </Stack>
            }
            centered
            size="md"
          >
            <EpicrisisForm
              adultoId={adultoId}
              onRegistrada={manejarEpicrisisRegistrada}
              onCancelar={() => setModalEpicrisisAbierto(false)}
            />
          </Modal>
        </Tabs.Panel>

        <Tabs.Panel value="documentos" className={classes.panel}>
          <Group justify="space-between" align="center" mb="lg">
            <div>
              <Title order={4} className={classes.personName}>
                Documentos del expediente
              </Title>

              <Text size="sm" className={classes.secondaryText}>
                Archivos asociados al expediente del adulto mayor.
              </Text>
            </div>
            {expedienteEditable && (
              <Button
                onClick={() => setModalDocumentoAbierto(true)}
                className={classes.registerButton}
              >
                + Adjuntar documento
              </Button>
            )}
          </Group>

          {documentosLoading ? (
            <div className={classes.loadingSection}>
              <Loader color="var(--color-primary)" />
            </div>
          ) : documentosError ? (
            <Alert color="red">
              No se pudieron cargar los documentos del expediente.
            </Alert>
          ) : (
            <DocumentoTable
              documentos={documentos}
              onVisualizar={manejarVisualizacionDocumento}
              onDescargar={manejarDescargaDocumento}
              onDesactivar={solicitarDesactivacionDocumento}
              editable={expedienteEditable}
            />
          )}

          <Modal
            opened={modalDocumentoAbierto}
            onClose={() => setModalDocumentoAbierto(false)}
            title={
              <Stack gap={2}>
                <Title order={3}>Adjuntar documento</Title>

                <Text size="sm" c="dimmed" fw={400}>
                  Seleccione el archivo que desea asociar al expediente.
                </Text>
              </Stack>
            }
            centered
            size="md"
          >
            <DocumentoForm
              adultoId={adultoId}
              onRegistrado={manejarDocumentoRegistrado}
              onCancelar={() => setModalDocumentoAbierto(false)}
            />
          </Modal>

          <Modal
            opened={documentoADesactivar !== null}
            onClose={() => setDocumentoADesactivar(null)}
            title="Desactivar documento"
            centered
          >
            <Stack gap="md">
              <Text>
                ¿Desea desactivar el documento{" "}
                <strong>{documentoADesactivar?.nombreArchivo}</strong>?
              </Text>

              <Text size="sm" className={classes.secondaryText}>
                El documento dejará de mostrarse en el expediente, pero no será
                eliminado del sistema.
              </Text>

              <Group justify="flex-end" gap="sm" mt="md">
                <Button
                  variant="default"
                  disabled={desactivandoDocumento}
                  onClick={() => setDocumentoADesactivar(null)}
                >
                  Cancelar
                </Button>

                <Button
                  color="red"
                  loading={desactivandoDocumento}
                  onClick={() => void confirmarDesactivacionDocumento()}
                >
                  Desactivar
                </Button>
              </Group>
            </Stack>
          </Modal>
        </Tabs.Panel>
        <Tabs.Panel value="medicamentos" className={classes.panel}>
          <Group justify="space-between" align="center" mb="lg">
            <div>
              <Title order={4} className={classes.personName}>
                Medicamentos
              </Title>

              <Text size="sm" className={classes.secondaryText}>
                Medicamentos asociados al expediente del adulto mayor.
              </Text>
            </div>
            {expedienteEditable && (
              <Button
                onClick={() => setModalMedicamentoAbierto(true)}
                className={classes.registerButton}
              >
                + Registrar medicamento
              </Button>
            )}
          </Group>

          {medicamentosLoading ? (
            <div className={classes.loadingSection}>
              <Loader color="var(--color-primary)" />
            </div>
          ) : medicamentosError ? (
            <Alert color="red">No se pudieron cargar los medicamentos.</Alert>
          ) : (
            <MedicamentoTable
              medicamentos={medicamentos}
              editable={expedienteEditable}
              onConsultar={setMedicamentoSeleccionado}
              onEditar={setMedicamentoAEditar}
              onDesactivar={setMedicamentoADesactivar}
            />
          )}
          <Modal
            opened={modalMedicamentoAbierto}
            onClose={() => setModalMedicamentoAbierto(false)}
            title={
              <Stack gap={2}>
                <Title order={3}>Registrar medicamento</Title>

                <Text size="sm" c="dimmed" fw={400}>
                  Ingrese la información del medicamento.
                </Text>
              </Stack>
            }
            centered
            size="md"
          >
            <MedicamentoForm
              adultoId={adultoId}
              onGuardado={manejarMedicamentoRegistrado}
              onCancelar={() => setModalMedicamentoAbierto(false)}
            />
          </Modal>
          <Modal
            opened={medicamentoSeleccionado !== null}
            onClose={() => setMedicamentoSeleccionado(null)}
            title="Detalle del medicamento"
            centered
            size="lg"
          >
            {medicamentoSeleccionado && (
              <Stack gap="lg">
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                  <Campo
                    etiqueta="Nombre"
                    valor={medicamentoSeleccionado.nombre}
                  />

                  <Campo
                    etiqueta="Tipo"
                    valor={medicamentoSeleccionado.tipo
                      .replaceAll("_", " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (letra) => letra.toUpperCase())}
                  />

                  <Campo
                    etiqueta="Dosis"
                    valor={medicamentoSeleccionado.dosis || "No registrada"}
                  />

                  <Campo
                    etiqueta="Horario"
                    valor={medicamentoSeleccionado.horario || "No registrado"}
                  />

                  <Campo
                    etiqueta="Registrado por"
                    valor={medicamentoSeleccionado.createdBy}
                  />

                  <Campo
                    etiqueta="Fecha de registro"
                    valor={new Intl.DateTimeFormat("es-CR", {
                      dateStyle: "long",
                      timeStyle: "short",
                    }).format(new Date(medicamentoSeleccionado.createdAt))}
                  />

                  {medicamentoSeleccionado.updatedBy && (
                    <Campo
                      etiqueta="Actualizado por"
                      valor={medicamentoSeleccionado.updatedBy}
                    />
                  )}

                  {medicamentoSeleccionado.updatedAt && (
                    <Campo
                      etiqueta="Fecha de actualización"
                      valor={new Intl.DateTimeFormat("es-CR", {
                        dateStyle: "long",
                        timeStyle: "short",
                      }).format(new Date(medicamentoSeleccionado.updatedAt))}
                    />
                  )}
                </SimpleGrid>

                <div>
                  <Text className={classes.label}>Observaciones</Text>

                  <Text className={classes.value}>
                    {medicamentoSeleccionado.observaciones ||
                      "Sin observaciones registradas."}
                  </Text>
                </div>

                <Group justify="flex-end">
                  <Button
                    variant="default"
                    onClick={() => setMedicamentoSeleccionado(null)}
                  >
                    Cerrar
                  </Button>
                </Group>
              </Stack>
            )}
          </Modal>
          <Modal
            opened={medicamentoAEditar !== null}
            onClose={() => setMedicamentoAEditar(null)}
            title={
              <Stack gap={2}>
                <Title order={3}>Editar medicamento</Title>

                <Text size="sm" c="dimmed" fw={400}>
                  Actualice la información del medicamento.
                </Text>
              </Stack>
            }
            centered
            size="md"
          >
            {medicamentoAEditar && (
              <MedicamentoForm
                key={medicamentoAEditar.medicamentoId}
                adultoId={adultoId}
                medicamento={medicamentoAEditar}
                onGuardado={manejarMedicamentoActualizado}
                onCancelar={() => setMedicamentoAEditar(null)}
              />
            )}
          </Modal>
          <Modal
            opened={medicamentoADesactivar !== null}
            onClose={() => setMedicamentoADesactivar(null)}
            title="Desactivar medicamento"
            centered
          >
            <Stack gap="md">
              <Text>
                ¿Desea desactivar el medicamento{" "}
                <strong>{medicamentoADesactivar?.nombre}</strong>?
              </Text>

              <Text size="sm" className={classes.secondaryText}>
                El medicamento dejará de mostrarse, pero no será eliminado del
                sistema.
              </Text>

              <Group justify="flex-end">
                <Button
                  variant="default"
                  disabled={desactivandoMedicamento}
                  onClick={() => setMedicamentoADesactivar(null)}
                >
                  Cancelar
                </Button>

                <Button
                  color="red"
                  loading={desactivandoMedicamento}
                  onClick={() => void confirmarDesactivacionMedicamento()}
                >
                  Desactivar
                </Button>
              </Group>
            </Stack>
          </Modal>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
