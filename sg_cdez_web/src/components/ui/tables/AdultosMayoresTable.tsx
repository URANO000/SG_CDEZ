import { ActionIcon, Group, Table, Tooltip } from "@mantine/core";

import { BsEye, BsPersonDash } from "react-icons/bs";

import { useNavigate } from "react-router";

import type { AdultoMayorResponse } from "../../../services/interfaces/adultoMayorInterface";

import classes from "./Table.module.css";

interface AdultosMayoresTableProps {
  adultosMayores: AdultoMayorResponse[];

  onDesactivar: (adultoMayor: AdultoMayorResponse) => void;
}

export function AdultosMayoresTable({
  adultosMayores,
  onDesactivar,
}: AdultosMayoresTableProps) {
  const navigate = useNavigate();

  return (
    <div className={classes.wrapper}>
      <Table.ScrollContainer minWidth={760}>
        <Table className={classes.table} verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Acciones</Table.Th>
              <Table.Th>Nombre completo</Table.Th>
              <Table.Th>Identificación</Table.Th>
              <Table.Th>Fecha de ingreso</Table.Th>
              <Table.Th>Estado</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {adultosMayores.length > 0 ? (
              adultosMayores.map((adultoMayor) => (
                <Table.Tr key={adultoMayor.adultoId}>
                  <Table.Td>
                    <Group gap={4} wrap="nowrap">
                      <Tooltip label="Consultar expediente">
                        <ActionIcon
                          variant="subtle"
                          className={classes.actionView}
                          aria-label="Consultar expediente"
                          onClick={() =>
                            navigate(
                              `/adultosMayores/${adultoMayor.adultoId}/expediente`,
                            )
                          }
                        >
                          <BsEye size={16} />
                        </ActionIcon>
                      </Tooltip>

                      {adultoMayor.activo === "Activo" && (
                        <Tooltip label="Desactivar registro">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            aria-label="Desactivar registro"
                            onClick={() => onDesactivar(adultoMayor)}
                          >
                            <BsPersonDash size={17} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </Group>
                  </Table.Td>

                  <Table.Td>{adultoMayor.nombreCompleto}</Table.Td>

                  <Table.Td>{adultoMayor.identificacion}</Table.Td>

                  <Table.Td>
                    {new Intl.DateTimeFormat("es-CR").format(
                      new Date(adultoMayor.fechaIngreso),
                    )}
                  </Table.Td>

                  <Table.Td>
                    <span
                      className={
                        adultoMayor.activo === "Activo"
                          ? classes.badgeActive
                          : classes.badgeInactive
                      }
                    >
                      {adultoMayor.activo}
                    </span>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5} className={classes.emptyState}>
                  No se encontraron adultos mayores.
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </div>
  );
}
