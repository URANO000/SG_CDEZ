import classes from './Table.module.css';
import type { PersonalResponse } from '../../../services/interfaces/personalResponse';
import { Table, ActionIcon, Tooltip, Group } from '@mantine/core';
import { BsEye, BsPencilSquare } from "react-icons/bs";
import { useNavigate } from 'react-router';

interface PersonalTableProps { personal: PersonalResponse[]; }

export function PersonalTable({ personal }: PersonalTableProps) {
    const hasData = personal.length > 0;
    const navigate = useNavigate();

    return (
        <div className={classes.wrapper}>
            <Table.ScrollContainer minWidth={640}>
                <Table className={classes.table} verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Acciones</Table.Th>
                            <Table.Th>Nombre Completo</Table.Th>
                            <Table.Th>Identificación</Table.Th>
                            <Table.Th>Especialidad</Table.Th>
                            <Table.Th>Rol</Table.Th>
                            <Table.Th>Usuario</Table.Th>
                            <Table.Th>Estado</Table.Th>
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {hasData ? (
                            personal.map((persona) => (
                                <Table.Tr key={persona.personalId}>
                                    <Table.Td>
                                        <Group gap={4} wrap="nowrap">
                                            <Tooltip label="Ver detalles">
                                                <ActionIcon
                                                    variant="subtle"
                                                    className={classes.actionView}
                                                    onClick={() => navigate(`/personal/${persona.personalId}/detalle`)}
                                                    aria-label="Ver detalles"
                                                >
                                                    <BsEye size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                            <Tooltip label="Editar">
                                                <ActionIcon
                                                    variant="subtle"
                                                    className={classes.actionEdit}
                                                    onClick={() => navigate(`/personal/${persona.personalId}/editar`)}
                                                    aria-label="Editar"
                                                >
                                                    <BsPencilSquare size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>{persona.nombreCompleto}</Table.Td>
                                    <Table.Td>{persona.identificacion}</Table.Td>
                                    <Table.Td>{persona.especialidad}</Table.Td>
                                    <Table.Td>{persona.rol}</Table.Td>
                                    <Table.Td>{persona.usuario}</Table.Td>
                                    <Table.Td>
                                        <span className={persona.activo ? classes.badgeActive : classes.badgeInactive}>
                                            {persona.activo === 'Activo' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={6} className={classes.emptyState}>
                                    Sin datos
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </div>
    );
}