import { useState } from "react";
import { Button, FileInput, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { registrarEpicrisis } from "../../../services/epicrisisService";
import type { EpicrisisResponse } from "../../../services/interfaces/epicrisisInterface";
import { notifications } from "@mantine/notifications";

interface EpicrisisFormProps {
  adultoId: string;
  onRegistrada: (epicrisis: EpicrisisResponse) => void;
  onCancelar: () => void;
}

interface EpicrisisFormValues {
  fechaEmision: string;
  fechaRecepcion: string;
  centroSalud: string;
  archivo: File | null;
}

export function EpicrisisForm({
  adultoId,
  onRegistrada,
  onCancelar,
}: EpicrisisFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<EpicrisisFormValues>({
    initialValues: {
      fechaEmision: "",
      fechaRecepcion: "",
      centroSalud: "",
      archivo: null,
    },

    validate: {
      fechaEmision: (valor) =>
        valor ? null : "La fecha de emisión es obligatoria.",

      centroSalud: (valor) =>
        valor.trim() ? null : "El centro de salud es obligatorio.",

      archivo: (valor) => (valor ? null : "Debe adjuntar un archivo."),
    },
  });

  async function manejarRegistro(values: EpicrisisFormValues) {
    if (!values.archivo) {
      return;
    }

    try {
      setLoading(true);

      const epicrisis = await registrarEpicrisis(adultoId, {
        fechaEmision: values.fechaEmision,
        fechaRecepcion: values.fechaRecepcion || null,
        centroSalud: values.centroSalud.trim(),
        archivo: values.archivo,
      });

      form.reset();
      onRegistrada(epicrisis);
    } catch {
      notifications.show({
        title: "Error al registrar",
        message: "No se pudo registrar la epicrisis.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={form.onSubmit(manejarRegistro)}>
      <Stack gap="md">
        <TextInput
          required
          type="datetime-local"
          label="Fecha de emisión"
          {...form.getInputProps("fechaEmision")}
        />

        <TextInput
          type="datetime-local"
          label="Fecha de recepción"
          description="Este campo es opcional."
          {...form.getInputProps("fechaRecepcion")}
        />

        <TextInput
          required
          label="Centro de salud"
          placeholder="Digite el centro de salud"
          {...form.getInputProps("centroSalud")}
        />

        <FileInput
          required
          clearable
          label="Archivo de epicrisis"
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

          <Button type="submit" loading={loading} className="primary-button">
            Registrar epicrisis
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
