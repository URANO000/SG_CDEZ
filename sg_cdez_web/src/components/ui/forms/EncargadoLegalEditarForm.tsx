import { useState } from "react";
import axios from "axios";

import {
  ActionIcon,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";

import { notifications } from "@mantine/notifications";
import { BsPlus, BsTrash } from "react-icons/bs";

import { actualizarEncargadoLegal } from "../../../services/encargadoLegalService";

import type {
  EncargadoLegalResponse,
  EncargadoLegalUpdateRequest,
} from "../../../services/interfaces/encargadoLegalInterface";

import classes from "../styleModules/PersonalForm.module.css";

interface EncargadoLegalEditarFormProps {
  encargado: EncargadoLegalResponse;
  onActualizado: (encargado: EncargadoLegalResponse) => void;
  onCancelar: () => void;
}

interface ContactoEdicion {
  contactoId?: number;
  tipoValor: string;
  valor: string;
}

export function EncargadoLegalEditarForm({
  encargado,
  onActualizado,
  onCancelar,
}: EncargadoLegalEditarFormProps) {
  const [direccion, setDireccion] = useState(encargado.direccion);

  const [contactos, setContactos] = useState<ContactoEdicion[]>(
    encargado.contactos
      .filter((contacto) => contacto.activo === "Activo")
      .map((contacto) => ({
        contactoId: contacto.contactoId,
        tipoValor: contacto.tipoValor,
        valor: contacto.valor,
      })),
  );

  const [contactosDesactivar, setContactosDesactivar] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  function agregarContacto() {
    setContactos((actuales) => [
      ...actuales,
      {
        tipoValor: "",
        valor: "",
      },
    ]);
  }

  function actualizarContacto(
    index: number,
    campo: "tipoValor" | "valor",
    valor: string,
  ) {
    setContactos((actuales) =>
      actuales.map((contacto, posicion) =>
        posicion === index
          ? {
              ...contacto,
              [campo]: valor,
            }
          : contacto,
      ),
    );
  }

  function eliminarContacto(index: number) {
    const contacto = contactos[index];

    if (contacto.contactoId !== undefined) {
      setContactosDesactivar((actuales) => [
        ...actuales,
        contacto.contactoId!,
      ]);
    }

    setContactos((actuales) =>
      actuales.filter((_, posicion) => posicion !== index),
    );
  }

  const contactosInvalidos = contactos.some(
    (contacto) => !contacto.tipoValor || !contacto.valor.trim(),
  );

  async function manejarSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nuevaDireccion = direccion.trim();

    if (!nuevaDireccion || contactosInvalidos) {
      return;
    }

    const request: EncargadoLegalUpdateRequest = {
      direccion: nuevaDireccion,

      contactosActualizar: contactos
        .filter((contacto) => contacto.contactoId !== undefined)
        .map((contacto) => ({
          contactoId: contacto.contactoId!,
          tipoValor: contacto.tipoValor,
          valor: contacto.valor.trim(),
        })),

      contactosCrear: contactos
        .filter((contacto) => contacto.contactoId === undefined)
        .map((contacto) => ({
          tipoValor: contacto.tipoValor,
          valor: contacto.valor.trim(),
        })),

      contactosDesactivar,
    };

    try {
      setLoading(true);

      const actualizado = await actualizarEncargadoLegal(
        encargado.encargadoId,
        request,
      );

      notifications.show({
        title: "Encargado actualizado",
        message:
          "La dirección y los contactos se actualizaron correctamente.",
        color: "green",
      });

      onActualizado(actualizado);
    } catch (error) {
      notifications.show({
        title: "Error al actualizar",
        message:
          axios.isAxiosError(error)
            ? error.response?.data?.message ??
              "No se pudo actualizar el encargado legal."
            : "No se pudo actualizar el encargado legal.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={manejarSubmit}>
      <Stack gap="lg">
        <TextInput
          label="Dirección"
          value={direccion}
          onChange={(event) => setDireccion(event.currentTarget.value)}
          maxLength={200}
          required
        />

        <div>
          <Group justify="space-between" className={classes.sectionHeader}>
            <Text fw={600}>Contactos</Text>

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
            <Text className={classes.emptyText}>
              No hay contactos activos. Puede agregar uno nuevo.
            </Text>
          ) : (
            <Stack gap="xs">
              {contactos.map((contacto, index) => (
                <div
                  key={contacto.contactoId ?? `nuevo-${index}`}
                  className={classes.contactItem}
                >
                  <div className={classes.contactFields}>
                    <div className={classes.fieldGroup}>
                      <label className={classes.fieldLabel}>
                        Tipo de contacto
                      </label>

                      <select
                        className={classes.select}
                        value={contacto.tipoValor}
                        required
                        onChange={(event) =>
                          actualizarContacto(
                            index,
                            "tipoValor",
                            event.target.value,
                          )
                        }
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
                        value={contacto.valor}
                        placeholder={
                          contacto.tipoValor === "CORREO"
                            ? "correo@ejemplo.com"
                            : "8888-8888"
                        }
                        required
                        onChange={(event) =>
                          actualizarContacto(index, "valor", event.target.value)
                        }
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

        <Group justify="flex-end">
          <Button
            type="button"
            variant="default"
            disabled={loading}
            onClick={onCancelar}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            loading={loading}
            disabled={!direccion.trim() || contactosInvalidos}
          >
            Guardar cambios
          </Button>
        </Group>
      </Stack>
    </form>
  );
}