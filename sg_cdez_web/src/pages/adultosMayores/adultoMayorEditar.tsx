import { useEffect, useState } from "react";

import {
  ActionIcon,
  Alert,
  Button,
  Container,
  Group,
  Loader,
  Paper,
  Text,
  Title,
} from "@mantine/core";

import { notifications } from "@mantine/notifications";

import { BsArrowLeft } from "react-icons/bs";

import { useNavigate, useParams } from "react-router";

import { ESCOLARIDADES } from "../../services/interfaces/adultoMayorInterface";

import {
  actualizarAdultoMayor,
  obtenerAdultoMayorPorId,
} from "../../services/adultoMayorService";

import type {
  AdultoMayorResponse,
  AdultoMayorUpdateRequest,
} from "../../services/interfaces/adultoMayorInterface";

import classes from "../../components/ui/styleModules/PersonalForm.module.css";

function obtenerFechaInput(fecha: string | null): string {
  if (!fecha) {
    return "";
  }

  return fecha.split("T")[0];
}

export function AdultoMayorEditar() {
  const { adultoId } = useParams();
  const navigate = useNavigate();

  const [adultoMayor, setAdultoMayor] = useState<AdultoMayorResponse | null>(
    null,
  );

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [direccion, setDireccion] = useState("");
  const [escolaridad, setEscolaridad] = useState("");
  const [grupoFamiliar, setGrupoFamiliar] = useState("");

  const [estadoCivil, setEstadoCivil] = useState("");
  const [gradoDependencia, setGradoDependencia] = useState("");
  const [cuotaMensual, setCuotaMensual] = useState("");

  const [recibePension, setRecibePension] = useState(false);
  const [tipoPension, setTipoPension] = useState("");
  const [montoPension, setMontoPension] = useState("");

  const [funcionalidadFisica, setFuncionalidadFisica] = useState("");
  const [ayudaBiomecanica, setAyudaBiomecanica] = useState(false);

  useEffect(() => {
    if (!adultoId) {
      setError(true);
      setLoadingData(false);
      return;
    }

    async function cargarAdultoMayor() {
      try {
        setLoadingData(true);
        setError(false);

        const response = await obtenerAdultoMayorPorId(adultoId!);

        setAdultoMayor(response);

        setDireccion(response.direccion);
        setEscolaridad(response.escolaridad);
        setGrupoFamiliar(response.grupoFamiliar ?? "");

        setEstadoCivil(response.estadoCivil ?? "");
        setGradoDependencia(response.gradoDependencia ?? "");
        setCuotaMensual(String(response.cuotaMensual ?? 0));

        setRecibePension(response.pension);
        setTipoPension(response.tipoPension ?? "");
        setMontoPension(
          response.montoPension !== null ? String(response.montoPension) : "",
        );

        setFuncionalidadFisica(response.funcionalidadFisica ?? "");
        setAyudaBiomecanica(response.ayudaBiomecanica);
      } catch {
        setError(true);
      } finally {
        setLoadingData(false);
      }
    }

    void cargarAdultoMayor();
  }, [adultoId]);

  async function manejarSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adultoId) {
      return;
    }

    const request: AdultoMayorUpdateRequest = {
      direccion: direccion.trim(),
      escolaridad: escolaridad.trim(),
      grupoFamiliar: grupoFamiliar.trim() || null,

      estadoCivil: estadoCivil || null,
      gradoDependencia: gradoDependencia || null,
      cuotaMensual: Number(cuotaMensual),

      pension: recibePension,
      tipoPension: recibePension ? tipoPension || null : null,
      montoPension: recibePension ? Number(montoPension) : null,

      funcionalidadFisica: funcionalidadFisica.trim() || null,
      ayudaBiomecanica,
    };

    try {
      setLoading(true);

      await actualizarAdultoMayor(adultoId, request);

      notifications.show({
        title: "Adulto mayor actualizado",
        message: "La información se actualizó correctamente.",
        color: "green",
      });

      navigate("/adultosMayores");
    } catch {
      notifications.show({
        title: "Error al actualizar",
        message: "No se pudo actualizar la información del adulto mayor.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className={classes.container}>
        <Paper className={classes.card}>
          <Group justify="center">
            <Loader color="var(--color-primary)" />
          </Group>
        </Paper>
      </div>
    );
  }

  if (error || !adultoMayor) {
    return (
      <Alert color="red">
        No se pudo cargar la información del adulto mayor.
      </Alert>
    );
  }

  return (
    <Container className={classes.container}>
      <Group justify="space-between" className={classes.topBar}>
        <ActionIcon
          variant="subtle"
          onClick={() => navigate("/adultosMayores")}
          aria-label="Volver"
        >
          <BsArrowLeft size={18} />
        </ActionIcon>
      </Group>

      <Paper className={classes.headerCard}>
        <Text className={classes.label}>Adultos Mayores</Text>

        <Title order={2} className={classes.title}>
          Editar Adulto Mayor
        </Title>

        <Text size="sm" className={classes.subtitle}>
          Consulte y actualice la información del adulto mayor.
        </Text>
      </Paper>

      <form onSubmit={manejarSubmit} className={classes.form}>
        {/* INFORMACIÓN PERSONAL */}
        <Paper className={classes.card}>
          <Group className={classes.sectionHeader}>
            <Title order={4} className={classes.sectionTitle}>
              Información personal
            </Title>
          </Group>

          <div className={classes.formGrid}>
            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>Nombre completo</label>

              <input
                className={classes.input}
                type="text"
                value={adultoMayor.nombreCompleto}
                disabled
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Tipo de identificación
              </label>

              <input
                className={classes.input}
                type="text"
                value={adultoMayor.tipoIdentificacion}
                disabled
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>Identificación</label>

              <input
                className={classes.input}
                type="text"
                value={adultoMayor.identificacion}
                disabled
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>Nacionalidad</label>

              <input
                className={classes.input}
                type="text"
                value={adultoMayor.nacionalidad}
                disabled
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>Fecha de nacimiento</label>

              <input
                className={classes.input}
                type="date"
                value={obtenerFechaInput(adultoMayor.fechaNacimiento)}
                disabled
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>Sexo</label>

              <input
                className={classes.input}
                type="text"
                value={adultoMayor.sexo}
                disabled
              />
            </div>
          </div>
        </Paper>

        {/* INFORMACIÓN DEL EXPEDIENTE */}
        <Paper className={classes.card}>
          <Group className={classes.sectionHeader}>
            <Title order={4} className={classes.sectionTitle}>
              Información del expediente
            </Title>
          </Group>

          <div className={classes.formGrid}>
            <div className={`${classes.fieldGroup} ${classes.fieldFull}`}>
              <label className={classes.fieldLabel}>
                Dirección
                <span className={classes.required}>*</span>
              </label>

              <input
                className={classes.input}
                type="text"
                value={direccion}
                maxLength={200}
                required
                onChange={(event) => setDireccion(event.target.value)}
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Escolaridad
                <span className={classes.required}>*</span>
              </label>

              <select
                className={classes.select}
                value={escolaridad}
                required
                onChange={(event) => setEscolaridad(event.target.value)}
              >
                <option value="" disabled>
                  Seleccionar
                </option>

                {ESCOLARIDADES.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>Grupo familiar</label>

              <input
                className={classes.input}
                type="text"
                value={grupoFamiliar}
                maxLength={200}
                onChange={(event) => setGrupoFamiliar(event.target.value)}
              />
            </div>
            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Estado civil
                <span className={classes.required}>*</span>
              </label>

              <select
                className={classes.select}
                value={estadoCivil}
                required
                onChange={(event) => setEstadoCivil(event.target.value)}
              >
                <option value="" disabled>
                  Seleccionar
                </option>

                <option value="Soltero/a">Soltero/a</option>
                <option value="Casado/a">Casado/a</option>
                <option value="Unión libre">Unión libre</option>
                <option value="Divorciado/a">Divorciado/a</option>
                <option value="Viudo/a">Viudo/a</option>
              </select>
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Grado de dependencia
                <span className={classes.required}>*</span>
              </label>

              <select
                className={classes.select}
                value={gradoDependencia}
                required
                onChange={(event) => setGradoDependencia(event.target.value)}
              >
                <option value="" disabled>
                  Seleccionar
                </option>

                <option value="Parcial">Parcial</option>
                <option value="Específica">Específica</option>
                <option value="Total">Total</option>
              </select>
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Cuota mensual (₡)
                <span className={classes.required}>*</span>
              </label>

              <input
                className={classes.input}
                type="number"
                value={cuotaMensual}
                min="0"
                step="0.01"
                inputMode="decimal"
                required
                onChange={(event) => setCuotaMensual(event.target.value)}
              />
            </div>
            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                ¿Recibe pensión?
                <span className={classes.required}>*</span>
              </label>

              <select
                className={classes.select}
                value={String(recibePension)}
                required
                onChange={(event) => {
                  const recibe = event.target.value === "true";

                  setRecibePension(recibe);

                  if (!recibe) {
                    setTipoPension("");
                    setMontoPension("");
                  }
                }}
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>

            {recibePension && (
              <>
                <div className={classes.fieldGroup}>
                  <label className={classes.fieldLabel}>
                    Tipo de pensión
                    <span className={classes.required}>*</span>
                  </label>

                  <select
                    className={classes.select}
                    value={tipoPension}
                    required
                    onChange={(event) => setTipoPension(event.target.value)}
                  >
                    <option value="" disabled>
                      Seleccionar tipo
                    </option>

                    <option value="Pensión contributiva (IVM)">
                      Pensión contributiva (IVM)
                    </option>

                    <option value="Régimen no contributivo">
                      Régimen no contributivo
                    </option>

                    <option value="Magisterio Nacional">
                      Magisterio Nacional
                    </option>
                    <option value="Poder Judicial">Poder Judicial</option>
                    <option value="Pensión alimentaria">
                      Pensión alimentaria
                    </option>
                    <option value="Otra">Otra</option>
                  </select>
                </div>

                <div className={classes.fieldGroup}>
                  <label className={classes.fieldLabel}>
                    Monto mensual de la pensión (₡)
                    <span className={classes.required}>*</span>
                  </label>

                  <input
                    className={classes.input}
                    type="number"
                    value={montoPension}
                    min="0.01"
                    step="0.01"
                    inputMode="decimal"
                    required
                    onChange={(event) => setMontoPension(event.target.value)}
                  />
                </div>
              </>
            )}
            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>Ayuda biomecánica</label>

              <select
                className={classes.select}
                value={ayudaBiomecanica ? "true" : "false"}
                onChange={(event) =>
                  setAyudaBiomecanica(event.target.value === "true")
                }
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className={`${classes.fieldGroup} ${classes.fieldFull}`}>
              <label className={classes.fieldLabel}>Funcionalidad física</label>

              <input
                className={classes.input}
                type="text"
                value={funcionalidadFisica}
                maxLength={200}
                onChange={(event) => setFuncionalidadFisica(event.target.value)}
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>Fecha de ingreso</label>

              <input
                className={classes.input}
                type="date"
                value={obtenerFechaInput(adultoMayor.fechaIngreso)}
                disabled
              />
            </div>
          </div>
        </Paper>

        <Group justify="flex-end" className={classes.submitBar}>
          <Button
            type="button"
            variant="default"
            disabled={loading}
            onClick={() => navigate("/adultosMayores")}
          >
            Cancelar
          </Button>

          <Button type="submit" loading={loading}>
            Guardar cambios
          </Button>
        </Group>
      </form>
    </Container>
  );
}
