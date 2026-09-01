import { Table } from "@mantine/core";

import type { MedicamentoResponse } from "../../../services/interfaces/medicamentoInterface";

import classes from "./Table.module.css";

interface MedicamentoTableProps {
  medicamentos: MedicamentoResponse[];
}

function formatearTipo(tipo: string): string {
  return tipo
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letra) => letra.toUpperCase());
}

function formatearFecha(fecha: string): string {
  return new Intl.DateTimeFormat("es-CR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(fecha));
}

export function MedicamentoTable({ medicamentos }: MedicamentoTableProps) {
  return (
    <div className={classes.wrapper}>
      <Table.ScrollContainer minWidth={900}>
        <Table className={classes.table} verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Dosis</Table.Th>
              <Table.Th>Horario</Table.Th>
              <Table.Th>Tipo</Table.Th>
              <Table.Th>Registrado por</Table.Th>
              <Table.Th>Fecha de registro</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {medicamentos.length > 0 ? (
              medicamentos.map((medicamento) => (
                <Table.Tr key={medicamento.medicamentoId}>
                  <Table.Td>{medicamento.nombre}</Table.Td>

                  <Table.Td>{medicamento.dosis || "No registrada"}</Table.Td>

                  <Table.Td>{medicamento.horario || "No registrado"}</Table.Td>

                  <Table.Td>{formatearTipo(medicamento.tipo)}</Table.Td>

                  <Table.Td>{medicamento.createdBy}</Table.Td>

                  <Table.Td>{formatearFecha(medicamento.createdAt)}</Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6} className={classes.emptyState}>
                  No existen medicamentos registrados.
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </div>
  );
}
