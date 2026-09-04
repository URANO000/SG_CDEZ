import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Group,
  Loader,
  Paper,
  Text,
  Title,
} from "@mantine/core";

import { notifications } from "@mantine/notifications";
import axios from "axios";

import {
  actualizarPerfil,
  obtenerPerfil,
} from "../../services/perfilService";

import type { PerfilResponse } from "../../services/interfaces/perfilInterface";

import {
  PerfilContactosForm,
  type PerfilContactoFormValue,
} from "../../components/ui/forms/PerfilContactosForm";

import classes from "../../components/ui/styleModules/PersonalForm.module.css";

export function Ajustes() {
  const [perfil, setPerfil] =
    useState<PerfilResponse | null>(null);

  const [direccion, setDireccion] = useState("");

  const [contactos, setContactos] = useState<
    PerfilContactoFormValue[]
  >([]);

  const [
    contactosOriginalesIds,
    setContactosOriginalesIds,
  ] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(false);

  function cargarDatosEnFormulario(response: PerfilResponse) {
    const contactosRecibidos: PerfilContactoFormValue[] = (
      response.contactos ?? []
    ).map((contacto) => ({
      contactoId: contacto.contactoId,
      tipoValor: contacto.tipoValor,
      valor: contacto.valor ?? "",
    }));

    setPerfil(response);
    setDireccion(response.direccion ?? "");
    setContactos(contactosRecibidos);

    setContactosOriginalesIds(
      contactosRecibidos
        .map((contacto) => contacto.contactoId)
        .filter(
          (contactoId): contactoId is number =>
            contactoId !== undefined,
        ),
    );
  }

  useEffect(() => {
    async function cargarPerfil() {
      try {
        setLoading(true);
        setError(false);

        const response = await obtenerPerfil();
        cargarDatosEnFormulario(response);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    void cargarPerfil();
  }, []);

  async function guardarCambios(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!perfil) {
      return;
    }

    const direccionNormalizada = direccion.trim();

    if (!direccionNormalizada) {
      notifications.show({
        title: "Dirección requerida",
        message: "Debe ingresar una dirección.",
        color: "orange",
      });

      return;
    }

    const contactoIncompleto = contactos.some(
      (contacto) =>
        !contacto.tipoValor ||
        !contacto.valor.trim(),
    );

    if (contactoIncompleto) {
      notifications.show({
        title: "Contacto incompleto",
        message:
          "Seleccione el tipo y complete la información de cada contacto.",
        color: "orange",
      });

      return;
    }

    const contactosActualizar = contactos
      .filter(
        (
          contacto,
        ): contacto is PerfilContactoFormValue & {
          contactoId: number;
        } => contacto.contactoId !== undefined,
      )
      .map((contacto) => ({
        contactoId: contacto.contactoId,
        tipoValor: contacto.tipoValor,
        valor: contacto.valor.trim(),
      }));

    const contactosCrear = contactos
      .filter(
        (contacto) => contacto.contactoId === undefined,
      )
      .map((contacto) => ({
        tipoValor: contacto.tipoValor,
        valor: contacto.valor.trim(),
      }));

    const contactosActualesIds = new Set(
      contactosActualizar.map(
        (contacto) => contacto.contactoId,
      ),
    );

    const contactosDesactivar =
      contactosOriginalesIds.filter(
        (contactoId) =>
          !contactosActualesIds.has(contactoId),
      );

    try {
      setGuardando(true);

      const actualizado = await actualizarPerfil({
        direccion: direccionNormalizada,
        contactosActualizar,
        contactosDesactivar,
        contactosCrear,
      });

      cargarDatosEnFormulario(actualizado);

      notifications.show({
        title: "Perfil actualizado",
        message:
          "La dirección y los contactos se actualizaron correctamente.",
        color: "green",
      });
    } catch (errorActualizacion) {
      let mensaje =
        "No se pudo actualizar la información del perfil.";

      if (
        axios.isAxiosError(errorActualizacion) &&
        typeof errorActualizacion.response?.data?.message ===
          "string"
      ) {
        mensaje =
          errorActualizacion.response.data.message;
      }

      notifications.show({
        title: "Error al actualizar",
        message: mensaje,
        color: "red",
      });
    } finally {
      setGuardando(false);
    }
  }

  if (loading) {
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

  if (error || !perfil) {
    return (
      <Alert color="red">
        No se pudo cargar la información del perfil.
      </Alert>
    );
  }

  return (
    <div className={classes.container}>
      <Paper className={classes.headerCard}>
        <Text className={classes.label}>Perfil</Text>

        <Title order={2} className={classes.title}>
          Mi perfil
        </Title>

        <Text size="sm" className={classes.subtitle}>
          Consulte y actualice su dirección e información
          de contacto.
        </Text>
      </Paper>

      <form
        onSubmit={guardarCambios}
        className={classes.form}
      >
        <Paper className={classes.card}>
          <Group className={classes.sectionHeader}>
            <Title
              order={4}
              className={classes.sectionTitle}
            >
              Información personal
            </Title>
          </Group>

          <div className={classes.formGrid}>
            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Nombre completo
              </label>

              <input
                className={classes.input}
                value={perfil.nombreCompleto}
                disabled
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Rol
              </label>

              <input
                className={classes.input}
                value={perfil.rol}
                disabled
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Especialidad
              </label>

              <input
                className={classes.input}
                value={perfil.especialidad}
                disabled
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Tipo de identificación
              </label>

              <input
                className={classes.input}
                value={perfil.tipoIdentificacion}
                disabled
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Identificación
              </label>

              <input
                className={classes.input}
                value={perfil.identificacion}
                disabled
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Carné
              </label>

              <input
                className={classes.input}
                value={perfil.carnet ?? "No registrado"}
                disabled
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Correo de inicio de sesión
              </label>

              <input
                className={classes.input}
                value={perfil.correo}
                disabled
              />

              <Text size="xs" className={classes.subtitle}>
                Este correo solamente puede ser modificado
                por un usuario administrador.
              </Text>
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>
                Estado
              </label>

              <input
                className={classes.input}
                value={perfil.estado}
                disabled
              />
            </div>

            <div
              className={`${classes.fieldGroup} ${classes.fieldFull}`}
            >
              <label className={classes.fieldLabel}>
                Dirección
              </label>

              <input
                className={classes.input}
                value={direccion}
                maxLength={200}
                required
                onChange={(event) =>
                  setDireccion(event.currentTarget.value)
                }
              />
            </div>
          </div>
        </Paper>

        <PerfilContactosForm
          contactos={contactos}
          onChange={setContactos}
        />

        <Group
          justify="flex-end"
          className={classes.submitBar}
        >
          <Button type="submit" loading={guardando}>
            Guardar cambios
          </Button>
        </Group>
      </form>
    </div>
  );
}