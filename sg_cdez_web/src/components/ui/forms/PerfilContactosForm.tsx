import {
  ActionIcon,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { BsPlus, BsTrash } from "react-icons/bs";

import classes from "../styleModules/PersonalForm.module.css";

export interface PerfilContactoFormValue {
  contactoId?: number;
  tipoValor: string;
  valor: string;
}

interface PerfilContactosFormProps {
  contactos: PerfilContactoFormValue[];
  onChange: (contactos: PerfilContactoFormValue[]) => void;
}

function crearContactoVacio(): PerfilContactoFormValue {
  return {
    tipoValor: "",
    valor: "",
  };
}

export function PerfilContactosForm({
  contactos,
  onChange,
}: PerfilContactosFormProps) {
  function agregarContacto() {
    onChange([...contactos, crearContactoVacio()]);
  }

  function actualizarContacto(
    index: number,
    campo: "tipoValor" | "valor",
    valor: string,
  ) {
    onChange(
      contactos.map((contacto, posicion) =>
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
    onChange(
      contactos.filter((_, posicion) => posicion !== index),
    );
  }

  return (
    <Paper className={classes.card}>
      <Group justify="space-between" className={classes.sectionHeader}>
        <div>
          <Title order={4} className={classes.sectionTitle}>
            Información de contacto
          </Title>

          <Text size="sm" className={classes.subtitle}>
            Agregue o actualice sus números telefónicos y correos de contacto.
            Estos correos no cambian su usuario de inicio de sesión.
          </Text>
        </div>

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

      <Stack>
        {contactos.map((contacto, index) => (
          <div
            key={contacto.contactoId ?? `nuevo-${index}`}
            className={classes.contactRow}
          >
            <select
              className={classes.select}
              value={contacto.tipoValor}
              required
              aria-label={`Tipo del contacto ${index + 1}`}
              onChange={(event) =>
                actualizarContacto(
                  index,
                  "tipoValor",
                  event.currentTarget.value,
                )
              }
            >
              <option value="" disabled>
                Seleccionar tipo
              </option>

              <option value="TELEFONO">
                Número telefónico
              </option>

              <option value="CORREO">
                Correo electrónico
              </option>
            </select>

            <input
              className={classes.input}
              type={
                contacto.tipoValor === "CORREO"
                  ? "email"
                  : "text"
              }
              value={contacto.valor}
              required
              maxLength={200}
              placeholder={
                contacto.tipoValor === "CORREO"
                  ? "correo@ejemplo.com"
                  : "Número de teléfono"
              }
              aria-label={`Valor del contacto ${index + 1}`}
              onChange={(event) =>
                actualizarContacto(
                  index,
                  "valor",
                  event.currentTarget.value,
                )
              }
            />

            <ActionIcon
              type="button"
              variant="subtle"
              color="red"
              aria-label={`Eliminar contacto ${index + 1}`}
              onClick={() => eliminarContacto(index)}
            >
              <BsTrash size={16} />
            </ActionIcon>
          </div>
        ))}

        {contactos.length === 0 && (
          <Text className={classes.emptyText}>
            No hay información de contacto registrada.
          </Text>
        )}
      </Stack>
    </Paper>
  );
}