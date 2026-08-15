import classes from './Table.module.css';
import type { PersonalResponse } from '../../../services/interfaces/personalResponse';
import { Table, ActionIcon, Tooltip, Group, Modal, Button, Text } from '@mantine/core';
import { BsEye, BsPencilSquare, BsPersonDash, BsPersonCheck } from "react-icons/bs";
import { notifications } from '@mantine/notifications';

import { useNavigate } from 'react-router';
import { useState } from 'react';

import { desactivarPersonal } from '../../../services/personalService';
import { activarPersonal } from '../../../services/personalService';

interface PersonalTableProps { personal: PersonalResponse[]; onRefresh: () => void; }

export function PersonalTable({ personal, onRefresh }: PersonalTableProps) {
    const hasData = personal.length > 0;
    const navigate = useNavigate();

    const [seleccionado, setSeleccionado] = useState<PersonalResponse | null>(null);
    const [accion, setAccion] = useState<'activar' | 'desactivar' | null>(null);
    const [guardando, setGuardando] = useState(false);

    const abrirConfirmacion = (persona: PersonalResponse, tipo: 'activar' | 'desactivar') => {
        setSeleccionado(persona);
        setAccion(tipo);
    };

    const cerrarConfirmacion = () => {
        setSeleccionado(null);
        setAccion(null);
    };

    const confirmarAccion = async () => {
        if (!seleccionado || !accion) return;
        setGuardando(true);
        try {
            if (accion === 'desactivar') {
                await desactivarPersonal(seleccionado.personalId);
            } else {
                await activarPersonal(seleccionado.personalId);
            }
            notifications.show({
                color: 'green',
                message: accion === 'desactivar' ? 'Registro desactivado' : 'Registro activado',
            });
            onRefresh();
            cerrarConfirmacion();
        } catch (error) {
            notifications.show({
                color: 'red',
                message: 'Ocurrió un error, intenta de nuevo',
            });
        } finally {
            setGuardando(false);
        }
    };

    return (
        <>
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
                                                {persona.activo === "Activo" ? (
                                                    <Tooltip label="Desactivar registro">
                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="red"
                                                            aria-label="Desactivar registro"
                                                            onClick={() => abrirConfirmacion(persona, 'desactivar')}
                                                        >
                                                            <BsPersonDash size={17} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip label="Activar registro">
                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="green"
                                                            aria-label="Activar registro"
                                                            onClick={() => abrirConfirmacion(persona, 'activar')}
                                                        >
                                                            <BsPersonCheck size={17} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                )}
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            {[
                                                persona.primerNombre,
                                                persona.segundoNombre,
                                                persona.primerApellido,
                                                persona.segundoApellido
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                        </Table.Td>
                                        <Table.Td>{persona.identificacion}</Table.Td>
                                        <Table.Td>{persona.especialidad}</Table.Td>
                                        <Table.Td>{persona.rol.nombre}</Table.Td>
                                        <Table.Td>{persona.usuario}</Table.Td>
                                        <Table.Td>
                                            <span
                                                className={
                                                    persona.activo === 'Activo'
                                                        ? classes.badgeActive
                                                        : classes.badgeInactive
                                                }
                                            >
                                                {persona.activo}
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


            <Modal
                opened={seleccionado !== null}
                onClose={cerrarConfirmacion}
                title={accion === 'desactivar' ? 'Desactivar personal' : 'Activar personal'}
                centered>
                <Text size="sm" mb="md">
                    {accion === 'desactivar'
                        ? `Se desactivará el registro de ${seleccionado?.primerNombre} ${seleccionado?.primerApellido}. Esta acción no elimina su expediente.`
                        : `Se activará el registro de ${seleccionado?.primerNombre} ${seleccionado?.primerApellido}.`}
                </Text>

                <Group justify="flex-end" mt="lg">
                    <Button variant="default" onClick={cerrarConfirmacion}>
                        Cancelar
                    </Button>
                    <Button
                        color={accion === 'desactivar' ? 'red' : 'green'}
                        loading={guardando}
                        onClick={() => void confirmarAccion()}
                    >
                        {accion === 'desactivar' ? 'Desactivar' : 'Activar'}
                    </Button>
                </Group>
            </Modal>

        </>
    );
}