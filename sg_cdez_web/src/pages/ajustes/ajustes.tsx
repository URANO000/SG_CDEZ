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

import { actualizarPerfil, obtenerPerfil } from "../../services/perfilService";

import type { PerfilResponse } from "../../services/interfaces/perfilInterface";

import classes from "../../components/ui/forms/PersonalForm.module.css";

export function Ajustes() {
  const [perfil, setPerfil] = useState<PerfilResponse | null>(null);

  const [direccion, setDireccion] = useState("");

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function cargarPerfil() {
      try {
        setLoading(true);
        setError(false);

        const response = await obtenerPerfil();

        setPerfil(response);
        setDireccion(response.direccion ?? "");
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    void cargarPerfil();
  }, []);

  async function guardarCambios(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!perfil) {
      return;
    }

    try {
      setGuardando(true);

      const actualizado = await actualizarPerfil({
        direccion: direccion.trim(),
      });

      setPerfil(actualizado);
      setDireccion(actualizado.direccion ?? "");

      notifications.show({
        title: "Perfil actualizado",
        message: "La información se actualizó correctamente.",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error al actualizar",
        message: "No se pudo actualizar la información del perfil.",
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
      <Alert color="red">No se pudo cargar la información del perfil.</Alert>
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
          Consulte y actualice su información personal.
        </Text>
      </Paper>

      <form onSubmit={guardarCambios} className={classes.form}>
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
                value={perfil.nombreCompleto}
                disabled
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>Rol</label>

              <input className={classes.input} value={perfil.rol} disabled />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>Especialidad</label>

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
              <label className={classes.fieldLabel}>Identificación</label>

              <input
                className={classes.input}
                value={perfil.identificacion}
                disabled
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>Carné</label>

              <input
                className={classes.input}
                value={perfil.carnet ?? "No registrado"}
                disabled
              />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>Correo</label>

              <input className={classes.input} value={perfil.correo} disabled />
            </div>

            <div className={classes.fieldGroup}>
              <label className={classes.fieldLabel}>Estado</label>

              <input className={classes.input} value={perfil.estado} disabled />
            </div>

            <div className={`${classes.fieldGroup} ${classes.fieldFull}`}>
              <label className={classes.fieldLabel}>Dirección</label>

              <input
                className={classes.input}
                value={direccion}
                maxLength={200}
                onChange={(event) => setDireccion(event.target.value)}
              />
            </div>
          </div>
        </Paper>

        <Group justify="flex-end" className={classes.submitBar}>
          <Button type="submit" loading={guardando}>
            Guardar cambios
          </Button>
        </Group>
      </form>
    </div>
  );
}
