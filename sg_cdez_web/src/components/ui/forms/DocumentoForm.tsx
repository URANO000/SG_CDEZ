import { useState } from "react";
import { Button, FileInput, Group, Stack } from "@mantine/core";
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
      archivo: (valor) =>
        valor ? null : "Debe adjuntar un archivo.",
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
        <FileInput
          required
          clearable
          label="Documento"
          placeholder="Seleccione un archivo"
          {...form.getInputProps("archivo")}
        />

        <Group justify="flex-end" mt="sm">
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
            className="primary-button"
          >
            Adjuntar documento
          </Button>
        </Group>
      </Stack>
    </form>
  );
}