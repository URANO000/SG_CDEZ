import { ActionIcon, Group, Table, Tooltip } from "@mantine/core";

import {
  BsEye,
  BsPencilSquare,
  BsPersonDash,
  BsPersonCheck,
} from "react-icons/bs";

import { useNavigate } from "react-router";

import type {
  AdultoMayorResponse,
  EstadoAdultoMayor,
} from "../../../services/interfaces/adultoMayorInterface";

import classes from "./Table.module.css";

interface AdultosMayoresTableProps {
  adultosMayores: AdultoMayorResponse[];
  estadoListado: EstadoAdultoMayor;

  onDesactivar: (adultoMayor: AdultoMayorResponse) => void;
  onActivar: (adultoMayor: AdultoMayorResponse) => void;
}

export function AdultosMayoresTable({
  adultosMayores,
  estadoListado,
  onDesactivar,
  onActivar,
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
                      {adultoMayor.activo === "Activo" &&
                        estadoListado === "ACTIVO" && (
                          <Tooltip label="Editar">
                            <ActionIcon
                              variant="subtle"
                              className={classes.actionEdit}
                              aria-label="Editar"
                              onClick={() =>
                                navigate(
                                  `/adultosMayores/${adultoMayor.adultoId}/editar`,
                                )
                              }
                            >
                              <BsPencilSquare size={16} />
                            </ActionIcon>
                          </Tooltip>
                        )}
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
                      {adultoMayor.activo === "Inactivo" &&
                        estadoListado === "INACTIVO" && (
                          <Tooltip label="Activar registro">
                            <ActionIcon
                              variant="subtle"
                              color="green"
                              aria-label="Activar registro"
                              onClick={() => onActivar(adultoMayor)}
                            >
                              <BsPersonCheck size={17} />
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
                      {estadoListado === "FALLECIDO"
                        ? "Fallecido"
                        : adultoMayor.activo}
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
