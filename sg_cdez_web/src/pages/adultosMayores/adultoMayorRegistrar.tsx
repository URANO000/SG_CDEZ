import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import {
  ActionIcon,
  Button,
  Container,
  Group,
  Paper,
  Text,
  Title,
} from "@mantine/core";

import { notifications } from "@mantine/notifications";
import { BsArrowLeft } from "react-icons/bs";

import { registrarAdultoMayor } from "../../services/adultoMayorService";

import type { AdultoMayorCreateRequest } from "../../services/interfaces/adultoMayorInterface";

import { ESCOLARIDADES } from "../../services/interfaces/adultoMayorInterface";

import { TIPOIDENTIFICACION } from "../../services/interfaces/personalCreateRequest";

import classes from "../../components/ui/styleModules/PersonalForm.module.css";

export function AdultoMayorRegistrar() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  async function manejarRegistro(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    const fechaNacimiento = (
      form.elements.namedItem("fechaNacimiento") as HTMLInputElement
    ).value;

    const fechaIngreso = (
      form.elements.namedItem("fechaIngreso") as HTMLInputElement
    ).value;

    const request: AdultoMayorCreateRequest = {
      tipoIdentificacion: (
        form.elements.namedItem("tipoIdentificacion") as HTMLSelectElement
      ).value,

      identificacion: (
        form.elements.namedItem("identificacion") as HTMLInputElement
      ).value.trim(),

      primerNombre: (
        form.elements.namedItem("primerNombre") as HTMLInputElement
      ).value.trim(),

      segundoNombre:
        (
          form.elements.namedItem("segundoNombre") as HTMLInputElement
        ).value.trim() || null,

      primerApellido: (
        form.elements.namedItem("primerApellido") as HTMLInputElement
      ).value.trim(),

      segundoApellido:
        (
          form.elements.namedItem("segundoApellido") as HTMLInputElement
        ).value.trim() || null,

      nacionalidad: (
        form.elements.namedItem("nacionalidad") as HTMLInputElement
      ).value.trim(),

      fechaNacimiento: fechaNacimiento ? `${fechaNacimiento}T00:00:00` : null,

      sexo: (form.elements.namedItem("sexo") as HTMLSelectElement).value as
        | "F"
        | "M",

      direccion: (
        form.elements.namedItem("direccion") as HTMLInputElement
      ).value.trim(),

      escolaridad: (form.elements.namedItem("escolaridad") as HTMLSelectElement)
        .value,

      grupoFamiliar:
        (
          form.elements.namedItem("grupoFamiliar") as HTMLInputElement
        ).value.trim() || null,

      pension:
        (form.elements.namedItem("pension") as HTMLSelectElement).value ===
        "true",

      funcionalidadFisica:
        (
          form.elements.namedItem("funcionalidadFisica") as HTMLInputElement
        ).value.trim() || null,

      ayudaBiomecanica:
        (form.elements.namedItem("ayudaBiomecanica") as HTMLSelectElement)
          .value === "true",

      fechaIngreso: `${fechaIngreso}T00:00:00`,
    };

    try {
      setLoading(true);

      await registrarAdultoMayor(request);

      notifications.show({
        title: "Adulto mayor registrado",
        message: "El adulto mayor se registró correctamente.",
        color: "green",
      });

      navigate("/adultosMayores");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        notifications.show({
          title: "Identificación registrada",
          message: "Ya existe un adulto mayor con esa identificación.",
          color: "orange",
        });

        return;
      }

      notifications.show({
        title: "Error al registrar",
        message: "No se pudo registrar el adulto mayor.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className={classes.container}>
      {/* VOLVER */}
      <Group justify="space-between" className={classes.topBar}>
        <ActionIcon
          variant="subtle"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          <BsArrowLeft size={18} />
        </ActionIcon>
      </Group>

      {/* ENCABEZADO */}
      <Paper className={classes.headerCard}>
        <Text className={classes.label}>Adultos Mayores</Text>

        <Title order={2} className={classes.title}>
          Registrar Adulto Mayor
        </Title>

        <Text size="sm" className={classes.subtitle}>
          Registrar un nuevo adulto mayor en el centro.
        </Text>
      </Paper>

      <form onSubmit={manejarRegistro} className={classes.form}>
        {/* INFORMACIÓN PERSONAL */}
        <Paper className={classes.card}>
          <Group className={classes.sectionHeader}>
            <Title order={4} className={classes.sectionTitle}>
              Información personal
            </Title>
          </Group>

          <div className={classes.formGrid}>
            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Primer nombre
                <span className={classes.required}>*</span>
              </label>

              <input
                className={classes.input}
                type="text"
                name="primerNombre"
                maxLength={50}
                required
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>Segundo nombre</label>

              <input
                className={classes.input}
                type="text"
                name="segundoNombre"
                maxLength={50}
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Primer apellido
                <span className={classes.required}>*</span>
              </label>

              <input
                className={classes.input}
                type="text"
                name="primerApellido"
                maxLength={50}
                required
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>Segundo apellido</label>

              <input
                className={classes.input}
                type="text"
                name="segundoApellido"
                maxLength={50}
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Tipo de identificación
                <span className={classes.required}>*</span>
              </label>

              <select
                className={classes.select}
                name="tipoIdentificacion"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Seleccionar tipo
                </option>

                {TIPOIDENTIFICACION.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Identificación
                <span className={classes.required}>*</span>
              </label>

              <input
                className={classes.input}
                type="text"
                name="identificacion"
                maxLength={200}
                required
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Nacionalidad
                <span className={classes.required}>*</span>
              </label>

              <input
                className={classes.input}
                type="text"
                name="nacionalidad"
                maxLength={100}
                required
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Sexo
                <span className={classes.required}>*</span>
              </label>

              <select
                className={classes.select}
                name="sexo"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Seleccionar
                </option>

                <option value="F">Femenino</option>

                <option value="M">Masculino</option>
              </select>
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>Fecha de nacimiento</label>

              <input
                className={classes.input}
                type="date"
                name="fechaNacimiento"
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
                name="direccion"
                maxLength={200}
                required
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Escolaridad
                <span className={classes.required}>*</span>
              </label>

              <select
                className={classes.select}
                name="escolaridad"
                defaultValue=""
                required
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
                name="grupoFamiliar"
                maxLength={200}
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                ¿Recibe pensión?
                <span className={classes.required}>*</span>
              </label>

              <select
                className={classes.select}
                name="pension"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Seleccionar
                </option>

                <option value="true">Sí</option>

                <option value="false">No</option>
              </select>
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                ¿Utiliza ayuda biomecánica?
                <span className={classes.required}>*</span>
              </label>

              <select
                className={classes.select}
                name="ayudaBiomecanica"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Seleccionar
                </option>

                <option value="true">Sí</option>

                <option value="false">No</option>
              </select>
            </div>

            <div className={`${classes.fieldGroup} ${classes.fieldFull}`}>
              <label className={classes.fieldLabel}>Funcionalidad física</label>

              <input
                className={classes.input}
                type="text"
                name="funcionalidadFisica"
                maxLength={200}
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Fecha de ingreso
                <span className={classes.required}>*</span>
              </label>

              <input
                className={classes.input}
                type="date"
                name="fechaIngreso"
                required
              />
            </div>
          </div>
        </Paper>

        {/* BOTONES */}
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
            Registrar Adulto Mayor
          </Button>
        </Group>
      </form>
    </Container>
  );
}
