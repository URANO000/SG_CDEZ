import { useState } from "react";

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

import {
  actualizarMedicamento,
  registrarMedicamento,
} from "../../../services/medicamentoService";

import {
  TIPOS_MEDICAMENTO,
  type MedicamentoResponse,
  type TipoMedicamento,
} from "../../../services/interfaces/medicamentoInterface";

interface MedicamentoFormProps {
  adultoId: string;
  medicamento?: MedicamentoResponse | null;
  onGuardado: () => void;
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
  medicamento,
  onGuardado,
  onCancelar,
}: MedicamentoFormProps) {
  const [guardando, setGuardando] = useState(false);

  const editando = medicamento != null;

  const form = useForm<MedicamentoFormValues>({
    initialValues: {
      nombre: medicamento?.nombre ?? "",
      dosis: medicamento?.dosis ?? "",
      horario: medicamento?.horario ?? "",
      tipo: medicamento?.tipo ?? "",
      observaciones: medicamento?.observaciones ?? "",
    },

    validate: {
      nombre: (value) =>
        value.trim().length === 0 ? "El nombre es obligatorio." : null,

      tipo: (value) => (value === "" ? "Debe seleccionar un tipo." : null),
    },
  });

  async function manejarGuardado(values: MedicamentoFormValues) {
    if (!values.tipo) {
      return;
    }

    try {
      setGuardando(true);

      if (medicamento) {
        await actualizarMedicamento(adultoId, {
          medicamentoId: medicamento.medicamentoId,
          adultoMayorNombre: medicamento.adultoMayorNombre,
          nombre: values.nombre.trim(),
          dosis: values.dosis.trim() || null,
          horario: values.horario.trim() || null,
          tipo: values.tipo,
          observaciones: values.observaciones.trim() || null,
        });
      } else {
        await registrarMedicamento(adultoId, {
          nombre: values.nombre.trim(),
          dosis: values.dosis.trim() || null,
          horario: values.horario.trim() || null,
          tipo: values.tipo,
          observaciones: values.observaciones.trim() || null,
        });
      }
    } catch {
      notifications.show({
        title: editando ? "Error al actualizar" : "Error al registrar",
        message: editando
          ? "No se pudo actualizar el medicamento."
          : "No se pudo registrar el medicamento.",
        color: "red",
      });

      return;
    } finally {
      setGuardando(false);
    }

    notifications.show({
      title: editando ? "Medicamento actualizado" : "Medicamento registrado",
      message: editando
        ? "El medicamento se actualizó correctamente."
        : "El medicamento se registró correctamente.",
      color: "green",
    });

    form.reset();
    onGuardado();
  }

  return (
    <form onSubmit={form.onSubmit(manejarGuardado)}>
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
          <Button
            type="button"
            variant="default"
            disabled={guardando}
            onClick={onCancelar}
          >
            Cancelar
          </Button>

          <Button type="submit" loading={guardando}>
            {editando ? "Guardar cambios" : "Registrar"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
