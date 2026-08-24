import type { ConsultaPageResponse } from "../../../services/interfaces/consultasInterface";
import { ActionIcon, Group, Table, Tooltip, Modal, Text, Button } from "@mantine/core";
import { BsEye, BsClipboardMinus } from "react-icons/bs";
import { useNavigate } from "react-router";
import classes from './Table.module.css';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { desactivarConsulta } from "../../../services/consultasService";
import { useAuth } from '../../../services/authContext';
import axios from "axios";
import { mostrarFecha } from "../../../utils/formatHelper";

interface ConsultaTableProps {
    consultas: ConsultaPageResponse[];
    onRefresh: () => void;
}

export function ConsultaTable({ consultas, onRefresh }: ConsultaTableProps) {

    const { user } = useAuth();

    const hasData = consultas.length > 0;
    const [seleccionado, setSeleccionado] = useState<ConsultaPageResponse | null>(null);
    const [guardando, setGuardando] = useState(false);

    const navigate = useNavigate();

    const abrirConfirmacion = (consulta: ConsultaPageResponse) => {
        setSeleccionado(consulta);
    };

    const cerrarConfirmacion = () => {
        setSeleccionado(null);
    };

    const confirmarAccion = async () => {
        if (!seleccionado) return;
        setGuardando(true);
        try {
            await desactivarConsulta(seleccionado.consultaId);

            notifications.show({
                color: 'green',
                message: 'Consulta desactivada.',
            });
            onRefresh();
            cerrarConfirmacion();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                notifications.show({
                    title: 'Error al desactivar consulta',
                    message: error.response.data?.message,
                    color: 'red',
                });
            }
        } finally {
            setGuardando(false);
        }
    };

    return (
        <>
            <div className={classes.wrapper}>

                <Table.ScrollContainer minWidth={640}>

                    <Table
                        className={classes.table}
                        verticalSpacing="sm">

                        <Table.Thead>
                            <Table.Tr>

                                <Table.Th>
                                    Acciones
                                </Table.Th>

                                <Table.Th>
                                    Especialidad
                                </Table.Th>

                                <Table.Th>
                                    Tipo de consulta
                                </Table.Th>

                                <Table.Th>
                                    Adulto mayor
                                </Table.Th>

                                <Table.Th>
                                    Creado Por
                                </Table.Th>

                                <Table.Th>
                                    Fecha de Consulta
                                </Table.Th>

                            </Table.Tr>
                        </Table.Thead>

                        <Table.Tbody>

                            {hasData ? (

                                consultas.map((consulta) => (

                                    <Table.Tr key={consulta.consultaId}>
                                        <Table.Td>
                                            <Group gap={4} wrap="nowrap">

                                                <Tooltip label="Ver detalles">

                                                    <ActionIcon
                                                        variant="subtle"
                                                        className={classes.actionView}
                                                        onClick={() =>
                                                            navigate(
                                                                `/consulta/${consulta.consultaId}/detalle`
                                                            )
                                                        }
                                                        aria-label="Ver detalles">
                                                        <BsEye size={16} />
                                                    </ActionIcon>

                                                </Tooltip>
                                                {user?.usuarioId === consulta.createdBy.personalId && (
                                                    <Tooltip label="Desactivar registro">
                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="red"
                                                            aria-label="Desactivar registro"
                                                            onClick={() => abrirConfirmacion(consulta)}>
                                                            <BsClipboardMinus size={17} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                )}

                                            </Group>
                                        </Table.Td>

                                        <Table.Td>
                                            {consulta.createdBy?.especialidad}
                                        </Table.Td>

                                        <Table.Td>
                                            {consulta.tipoConsulta}
                                        </Table.Td>

                                        <Table.Td>
                                            {consulta.adultoMayor?.nombreCompleto}
                                        </Table.Td>

                                        <Table.Td>
                                            {consulta.createdBy.nombreCompleto}
                                        </Table.Td>

                                        <Table.Td>
                                            {mostrarFecha(consulta.createdAt)}
                                        </Table.Td>
                                    </Table.Tr>

                                ))

                            ) : (

                                <Table.Tr>
                                    <Table.Td colSpan={5} className={classes.emptyState}>
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
                title={'Desactivar consulta'}
                centered>
                <Text size="sm" mb="md">
                    Se desactivará la consulta de ${seleccionado?.adultoMayor.nombreCompleto}. Esta acción es irreversible.
                </Text>

                <Group justify="flex-end" mt="lg">
                    <Button variant="default" onClick={cerrarConfirmacion}>
                        Cancelar
                    </Button>
                    <Button
                        color='red'
                        loading={guardando}
                        onClick={() => void confirmarAccion()}>
                        Desactivar
                    </Button>
                </Group>
            </Modal>
        </>

    );
}