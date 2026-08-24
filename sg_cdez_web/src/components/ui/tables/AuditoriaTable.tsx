import { ActionIcon, Group, Table, Tooltip } from "@mantine/core";

import { BsEye } from "react-icons/bs";

import type { AuditoriaResponse } from "../../../services/interfaces/auditoriaInterface";

import classes from "./Table.module.css";

interface AuditoriaTableProps {
  auditorias: AuditoriaResponse[];
  onConsultar: (auditoria: AuditoriaResponse) => void;
}

function formatearTexto(valor: string) {
  return valor
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letra) => letra.toUpperCase());
}

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat("es-CR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(fecha));
}

export function AuditoriaTable({
  auditorias,
  onConsultar,
}: AuditoriaTableProps) {
  return (
    <div className={classes.wrapper}>
      <Table.ScrollContainer minWidth={1000}>
        <Table className={classes.table} verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Acciones</Table.Th>
              <Table.Th>Usuario</Table.Th>
              <Table.Th>Acción</Table.Th>
              <Table.Th>Módulo</Table.Th>
              <Table.Th>Descripción</Table.Th>
              <Table.Th>Fecha</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {auditorias.length > 0 ? (
              auditorias.map((auditoria) => (
                <Table.Tr key={auditoria.auditoriaId}>
                  <Table.Td>
                    <Group gap={4} wrap="nowrap">
                      <Tooltip label="Consultar detalle">
                        <ActionIcon
                          variant="subtle"
                          className={classes.actionView}
                          aria-label="Consultar detalle"
                          onClick={() => onConsultar(auditoria)}
                        >
                          <BsEye size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>

                  <Table.Td>{auditoria.nombreUsuario}</Table.Td>

                  <Table.Td>{formatearTexto(auditoria.accion)}</Table.Td>

                  <Table.Td>{formatearTexto(auditoria.modulo)}</Table.Td>

                  <Table.Td>{auditoria.descripcion}</Table.Td>

                  <Table.Td>{formatearFecha(auditoria.createdAt)}</Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6} className={classes.emptyState}>
                  No se encontraron registros de auditoría.
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </div>
  );
}
