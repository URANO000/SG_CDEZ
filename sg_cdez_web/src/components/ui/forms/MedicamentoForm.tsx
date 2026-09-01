import {
  Button,
  Group,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { registrarMedicamento } from "../../../services/medicamentoService";

import {
  TIPOS_MEDICAMENTO,
  type TipoMedicamento,
} from "../../../services/interfaces/medicamentoInterface";

interface MedicamentoFormProps {
  adultoId: string;
  onRegistrado: () => void;
  onCancelar: () => void;
}

interface MedicamentoFormValues {
  nombre: string;
  dosis: string;
  horario: string;
  tipo: TipoMedicamento | "";
  observaciones: string;
}

export function MedicamentoForm({
  adultoId,
  onRegistrado,
  onCancelar,
}: MedicamentoFormProps) {
  const form = useForm<MedicamentoFormValues>({
    initialValues: {
      nombre: "",
      dosis: "",
      horario: "",
      tipo: "",
      observaciones: "",
    },

    validate: {
      nombre: (value) =>
        value.trim().length === 0 ? "El nombre es obligatorio." : null,

      tipo: (value) => (value === "" ? "Debe seleccionar un tipo." : null),
    },
  });

  async function manejarRegistro(values: MedicamentoFormValues) {
    if (!values.tipo) {
      return;
    }

    try {
      await registrarMedicamento(adultoId, {
        nombre: values.nombre.trim(),
        dosis: values.dosis.trim() || null,
        horario: values.horario.trim() || null,
        tipo: values.tipo,
        observaciones: values.observaciones.trim() || null,
      });
    } catch {
      notifications.show({
        title: "Error al registrar",
        message: "No se pudo registrar el medicamento.",
        color: "red",
      });

      return;
    }

    notifications.show({
      title: "Medicamento registrado",
      message: "El medicamento se registró correctamente.",
      color: "green",
    });

    form.reset();
    onRegistrado();
  }

  return (
    <form onSubmit={form.onSubmit(manejarRegistro)}>
      <Stack gap="md">
        <TextInput
          label="Nombre"
          placeholder="Nombre del medicamento"
          required
          maxLength={200}
          {...form.getInputProps("nombre")}
        />

        <Select
          label="Tipo"
          placeholder="Seleccione un tipo"
          required
          data={TIPOS_MEDICAMENTO.map(({ value, label }) => ({
            value,
            label,
          }))}
          {...form.getInputProps("tipo")}
        />

        <TextInput
          label="Dosis"
          placeholder="Ejemplo: 500 mg"
          maxLength={100}
          {...form.getInputProps("dosis")}
        />

        <TextInput
          label="Horario"
          placeholder="Ejemplo: cada 8 horas"
          maxLength={100}
          {...form.getInputProps("horario")}
        />

        <Textarea
          label="Observaciones"
          placeholder="Indicaciones u observaciones adicionales"
          autosize
          minRows={3}
          {...form.getInputProps("observaciones")}
        />

        <Group justify="flex-end" mt="sm">
          <Button type="button" variant="default" onClick={onCancelar}>
            Cancelar
          </Button>

          <Button type="submit" loading={form.submitting}>
            Registrar
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
