import { ActionIcon, Group, Table, Tooltip } from "@mantine/core";

import { BsEye, BsPencilSquare, BsTrash } from "react-icons/bs";

import { useAuth } from "../../../services/authContext";

import type { MedicamentoResponse } from "../../../services/interfaces/medicamentoInterface";

import classes from "./Table.module.css";

interface MedicamentoTableProps {
  medicamentos: MedicamentoResponse[];
  editable: boolean;
  onConsultar: (medicamento: MedicamentoResponse) => void;
  onEditar: (medicamento: MedicamentoResponse) => void;
  onDesactivar: (medicamento: MedicamentoResponse) => void;
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

export function MedicamentoTable({
  medicamentos,
  editable,
  onConsultar,
  onEditar,
  onDesactivar,
}: MedicamentoTableProps) {
  const { user } = useAuth();

  return (
    <div className={classes.wrapper}>
      <Table.ScrollContainer minWidth={1000}>
        <Table className={classes.table} verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Acciones</Table.Th>
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
              medicamentos.map((medicamento) => {
                const esCreador = user?.usuarioId === medicamento.createdById;

                return (
                  <Table.Tr key={medicamento.medicamentoId}>
                    <Table.Td>
                      <Group gap={4} wrap="nowrap">
                        <Tooltip label="Consultar detalle">
                          <ActionIcon
                            variant="subtle"
                            className={classes.actionView}
                            aria-label="Consultar medicamento"
                            onClick={() => onConsultar(medicamento)}
                          >
                            <BsEye size={16} />
                          </ActionIcon>
                        </Tooltip>

                        {editable && esCreador && (
                          <>
                            <Tooltip label="Editar">
                              <ActionIcon
                                variant="subtle"
                                className={classes.actionEdit}
                                aria-label="Editar medicamento"
                                onClick={() => onEditar(medicamento)}
                              >
                                <BsPencilSquare size={16} />
                              </ActionIcon>
                            </Tooltip>

                            <Tooltip label="Desactivar">
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                aria-label="Desactivar medicamento"
                                onClick={() => onDesactivar(medicamento)}
                              >
                                <BsTrash size={16} />
                              </ActionIcon>
                            </Tooltip>
                          </>
                        )}
                      </Group>
                    </Table.Td>

                    <Table.Td>{medicamento.nombre}</Table.Td>

                    <Table.Td>{medicamento.dosis || "No registrada"}</Table.Td>

                    <Table.Td>
                      {medicamento.horario || "No registrado"}
                    </Table.Td>

                    <Table.Td>{formatearTipo(medicamento.tipo)}</Table.Td>

                    <Table.Td>{medicamento.createdBy}</Table.Td>

                    <Table.Td>{formatearFecha(medicamento.createdAt)}</Table.Td>
                  </Table.Tr>
                );
              })
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7} className={classes.emptyState}>
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
