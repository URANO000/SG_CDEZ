import { useState } from "react";
import { ActionIcon, Button, Group, Stack, Text, Title } from "@mantine/core";
import { BsPlus, BsTrash } from "react-icons/bs";
import { notifications } from "@mantine/notifications";

import { registrarEncargadoLegal } from "../../../services/encargadoLegalService";

import type {
  EncargadoLegalCreateRequest,
  EncargadoLegalResponse,
} from "../../../services/interfaces/encargadoLegalInterface";

import type { ContactoCreateRequest } from "../../../services/interfaces/personalCreateRequest";

import classes from "./PersonalForm.module.css";

interface EncargadoLegalFormProps {
  adultoId: string;
  onRegistrado: (encargado: EncargadoLegalResponse) => void;
  onCancelar: () => void;
}

export function EncargadoLegalForm({
  adultoId,
  onRegistrado,
  onCancelar,
}: EncargadoLegalFormProps) {
  const [loading, setLoading] = useState(false);

  const [contactos, setContactos] = useState<ContactoCreateRequest[]>([
    {
      tipoValor: "",
      valor: "",
    },
  ]);

  function agregarContacto() {
    setContactos((prev) => [
      ...prev,
      {
        tipoValor: "",
        valor: "",
      },
    ]);
  }

  function actualizarContacto(
    index: number,
    campo: keyof ContactoCreateRequest,
    valor: string,
  ) {
    setContactos((prev) =>
      prev.map((contacto, i) =>
        i === index
          ? {
              ...contacto,
              [campo]: valor,
            }
          : contacto,
      ),
    );
  }

  function eliminarContacto(index: number) {
    setContactos((prev) => prev.filter((_, i) => i !== index));
  }

  async function manejarRegistro(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    const request: EncargadoLegalCreateRequest = {
      tipoIdentificacion: (
        form.elements.namedItem("tipoIdentificacion") as HTMLInputElement
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

      direccion: (
        form.elements.namedItem("direccion") as HTMLInputElement
      ).value.trim(),

      contactos,
    };

    try {
      setLoading(true);

      const encargado = await registrarEncargadoLegal(adultoId, request);

      onRegistrado(encargado);
    } catch {
      notifications.show({
        title: "Error al registrar",
        message: "No se pudo registrar el encargado legal.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={manejarRegistro}>
      <Stack gap="lg">
        <div>
          <Title order={4} className={classes.sectionTitle}>
            Información personal
          </Title>

          <div className={classes.sectionDivider} />
        </div>

        <div className={classes.formGrid}>
          <div className={classes.fieldGroup}>
            <label className={classes.fieldLabel}>Primer nombre *</label>

            <input
              className={classes.input}
              name="primerNombre"
              type="text"
              maxLength={50}
              required
            />
          </div>

          <div className={classes.fieldGroup}>
            <label className={classes.fieldLabel}>Segundo nombre</label>

            <input
              className={classes.input}
              name="segundoNombre"
              type="text"
              maxLength={50}
            />
          </div>

          <div className={classes.fieldGroup}>
            <label className={classes.fieldLabel}>Primer apellido *</label>

            <input
              className={classes.input}
              name="primerApellido"
              type="text"
              maxLength={50}
              required
            />
          </div>

          <div className={classes.fieldGroup}>
            <label className={classes.fieldLabel}>Segundo apellido</label>

            <input
              className={classes.input}
              name="segundoApellido"
              type="text"
              maxLength={50}
            />
          </div>

          <div className={classes.fieldGroup}>
            <label className={classes.fieldLabel}>
              Tipo de identificación *
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

              <option value="CIC">CIC</option>
              <option value="CRP">CRP</option>
              <option value="CRR">CRR</option>
              <option value="RE">RE</option>
              <option value="APO">APO</option>
              <option value="CRT">CRT</option>
              <option value="CRE">CRE</option>
              <option value="PEX">PEX</option>
            </select>
          </div>

          <div className={classes.fieldGroup}>
            <label className={classes.fieldLabel}>Identificación *</label>

            <input
              className={classes.input}
              name="identificacion"
              type="text"
              maxLength={100}
              required
            />
          </div>

          <div className={`${classes.fieldGroup} ${classes.fieldFull}`}>
            <label className={classes.fieldLabel}>Dirección *</label>

            <input
              className={classes.input}
              name="direccion"
              type="text"
              maxLength={200}
              required
            />
          </div>
        </div>

        <div>
          <Group justify="space-between" className={classes.sectionHeader}>
            <Title order={4} className={classes.sectionTitle}>
              Contactos
            </Title>

            <Button
              type="button"
              size="xs"
              variant="light"
              leftSection={<BsPlus size={16} />}
              onClick={agregarContacto}
            >
              Agregar contacto
            </Button>
          </Group>

          {contactos.length === 0 ? (
            <Text className={classes.emptyText}>Sin contactos agregados.</Text>
          ) : (
            <Stack gap="xs">
              {contactos.map((contacto, index) => (
                <div key={index} className={classes.contactItem}>
                  <div className={classes.contactFields}>
                    <div className={classes.fieldGroup}>
                      <label className={classes.fieldLabel}>
                        Tipo de contacto
                      </label>

                      <select
                        className={classes.select}
                        value={contacto.tipoValor}
                        onChange={(event) =>
                          actualizarContacto(
                            index,
                            "tipoValor",
                            event.target.value,
                          )
                        }
                        required
                      >
                        <option value="" disabled>
                          Seleccionar tipo
                        </option>

                        <option value="TELEFONO">Teléfono</option>

                        <option value="CORREO">Correo electrónico</option>
                      </select>
                    </div>

                    <div className={classes.fieldGroup}>
                      <label className={classes.fieldLabel}>
                        Información de contacto
                      </label>

                      <input
                        className={classes.input}
                        type={
                          contacto.tipoValor === "CORREO" ? "email" : "text"
                        }
                        placeholder={
                          contacto.tipoValor === "CORREO"
                            ? "correo@ejemplo.com"
                            : "8888-8888"
                        }
                        value={contacto.valor}
                        onChange={(event) =>
                          actualizarContacto(index, "valor", event.target.value)
                        }
                        required
                      />
                    </div>

                    <ActionIcon
                      type="button"
                      variant="subtle"
                      color="red"
                      aria-label="Eliminar contacto"
                      className={classes.contactDelete}
                      onClick={() => eliminarContacto(index)}
                    >
                      <BsTrash size={17} />
                    </ActionIcon>
                  </div>
                </div>
              ))}
            </Stack>
          )}
        </div>

        <Group justify="flex-end" gap="sm" mt="md">
          <Button
            type="button"
            variant="default"
            disabled={loading}
            onClick={onCancelar}
          >
            Cancelar
          </Button>

          <Button type="submit" loading={loading}>
            Registrar encargado
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
