import { ActionIcon, Group, Table, Tooltip } from "@mantine/core";
import { BsDownload } from "react-icons/bs";
import type { EpicrisisResponse } from "../../../services/interfaces/epicrisisInterface";
import classes from "./Table.module.css";

interface EpicrisisTableProps {
  epicrisis: EpicrisisResponse[];
  onDescargar: (epicrisis: EpicrisisResponse) => void;
}

function mostrarFecha(fecha: string | null): string {
  if (!fecha) {
    return "No registrada";
  }

  return new Intl.DateTimeFormat("es-CR").format(new Date(fecha));
}

export function EpicrisisTable({
  epicrisis,
  onDescargar,
}: EpicrisisTableProps) {
  return (
    <div className={classes.wrapper}>
      <Table.ScrollContainer minWidth={760}>
        <Table className={classes.table} verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Acciones</Table.Th>
              <Table.Th>Fecha de emisión</Table.Th>
              <Table.Th>Fecha de recepción</Table.Th>
              <Table.Th>Centro de salud</Table.Th>
              <Table.Th>Archivo</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {epicrisis.length > 0 ? (
              epicrisis.map((registro) => (
                <Table.Tr key={registro.epicrisisId}>
                  <Table.Td>
                    <Group gap={4} wrap="nowrap">
                      <Tooltip label="Descargar epicrisis">
                        <ActionIcon
                          variant="subtle"
                          className={classes.actionView}
                          onClick={() => onDescargar(registro)}
                          aria-label="Descargar epicrisis"
                        >
                          <BsDownload size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>

                  <Table.Td>{mostrarFecha(registro.fechaEmision)}</Table.Td>

                  <Table.Td>{mostrarFecha(registro.fechaRecepcion)}</Table.Td>

                  <Table.Td>{registro.centroSalud}</Table.Td>

                  <Table.Td>{registro.nombreArchivo}</Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5} className={classes.emptyState}>
                  No existen epicrisis anteriores registradas.
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </div>
  );
}
