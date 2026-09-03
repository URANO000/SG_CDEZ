import { useState } from "react";
import { Button, FileInput, Group, Paper, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { registrarDocumentoExpediente } from "../../../services/documentoService";
import type { DocumentoResponse } from "../../../services/interfaces/personalResponse";

interface DocumentoFormProps {
  adultoId: string;
  onRegistrado: (documento: DocumentoResponse) => void;
  onCancelar: () => void;
}

interface DocumentoFormValues {
  archivo: File | null;
}

function mostrarTamano(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentoForm({
  adultoId,
  onRegistrado,
  onCancelar,
}: DocumentoFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<DocumentoFormValues>({
    initialValues: {
      archivo: null,
    },

    validate: {
      archivo: (valor) => (valor ? null : "Debe adjuntar un archivo."),
    },
  });

  async function manejarRegistro(values: DocumentoFormValues) {
    if (!values.archivo) {
      return;
    }

    try {
      setLoading(true);

      const documento = await registrarDocumentoExpediente(
        adultoId,
        values.archivo,
      );

      form.reset();
      onRegistrado(documento);
    } catch {
      notifications.show({
        title: "Error al adjuntar",
        message: "No se pudo adjuntar el documento al expediente.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={form.onSubmit(manejarRegistro)}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Adjunte documentos generales relacionados con el expediente del adulto
          mayor, como constancias, resultados, referencias u otros respaldos.
        </Text>

        <Text size="sm" c="dimmed">
          Las epicrisis deben registrarse desde la sección de Epicrisis para
          conservar sus fechas y centro de salud.
        </Text>

        <FileInput
          required
          clearable
          label="Archivo del documento"
          description="Utilice un nombre descriptivo que permita identificar fácilmente el contenido."
          placeholder="Seleccione un archivo"
          {...form.getInputProps("archivo")}
        />

        {form.values.archivo && (
          <Paper p="sm" withBorder>
            <Stack gap={2}>
              <Text size="sm" fw={600}>
                Archivo seleccionado
              </Text>

              <Text size="sm">Nombre: {form.values.archivo.name}</Text>

              <Text size="sm">
                Tipo: {form.values.archivo.type || "No identificado"}
              </Text>

              <Text size="sm">
                Tamaño: {mostrarTamano(form.values.archivo.size)}
              </Text>
            </Stack>
          </Paper>
        )}

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
            Adjuntar documento
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
