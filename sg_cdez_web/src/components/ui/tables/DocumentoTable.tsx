import { ActionIcon, Group, Table, Tooltip } from "@mantine/core";
import { BsDownload, BsEye, BsTrash } from "react-icons/bs";

import type { DocumentoResponse } from "../../../services/interfaces/personalResponse";

import classes from "./Table.module.css";

interface DocumentoTableProps {
  documentos: DocumentoResponse[];
  onVisualizar: (documento: DocumentoResponse) => void;
  onDescargar: (documento: DocumentoResponse) => void;
  onDesactivar: (documento: DocumentoResponse) => void;
}

function mostrarFecha(fecha: string | null): string {
  if (!fecha) {
    return "No registrada";
  }

  return new Intl.DateTimeFormat("es-CR").format(new Date(fecha));
}

function mostrarTamano(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentoTable({
  documentos,
  onVisualizar,
  onDescargar,
  onDesactivar,
}: DocumentoTableProps) {
  return (
    <div className={classes.wrapper}>
      <Table.ScrollContainer minWidth={760}>
        <Table className={classes.table} verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Acciones</Table.Th>
              <Table.Th>Archivo</Table.Th>
              <Table.Th>Tipo</Table.Th>
              <Table.Th>Tamaño</Table.Th>
              <Table.Th>Fecha de registro</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {documentos.length > 0 ? (
              documentos.map((documento) => (
                <Table.Tr key={documento.documentoId}>
                  <Table.Td>
                    <Group gap={4} wrap="nowrap">
                      <Tooltip label="Visualizar documento">
                        <ActionIcon
                          variant="subtle"
                          className={classes.actionView}
                          onClick={() => onVisualizar(documento)}
                          aria-label="Visualizar documento"
                        >
                          <BsEye size={16} />
                        </ActionIcon>
                      </Tooltip>

                      <Tooltip label="Descargar documento">
                        <ActionIcon
                          variant="subtle"
                          className={classes.actionView}
                          onClick={() => onDescargar(documento)}
                          aria-label="Descargar documento"
                        >
                          <BsDownload size={16} />
                        </ActionIcon>
                      </Tooltip>

                      <Tooltip label="Desactivar documento">
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => onDesactivar(documento)}
                          aria-label="Desactivar documento"
                        >
                          <BsTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>

                  <Table.Td>{documento.nombreArchivo}</Table.Td>

                  <Table.Td>{documento.tipoArchivo}</Table.Td>

                  <Table.Td>{mostrarTamano(documento.tamanoArchivo)}</Table.Td>

                  <Table.Td>{mostrarFecha(documento.createdAt)}</Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5} className={classes.emptyState}>
                  No existen documentos adjuntos al expediente.
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </div>
  );
}
