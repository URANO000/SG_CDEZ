import type { ConsultaPageResponse } from "../../../services/interfaces/consultasInterface";
import { ActionIcon, Group, Table, Tooltip } from "@mantine/core";
import { BsEye } from "react-icons/bs";
import { useNavigate } from "react-router";
import classes from './Table.module.css';


interface ConsultaTableProps {
    consultas: ConsultaPageResponse[];
    onRefresh: () => void;
}

export function ConsultaTable({consultas, onRefresh}: ConsultaTableProps) {

    const hasData = consultas.length > 0;

    const navigate = useNavigate();

    return (
        <div className={classes.wrapper}>

            <Table.ScrollContainer minWidth={640}>

                <Table
                    className={classes.table}
                    verticalSpacing="sm"
                >

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
                                Estado
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
                                                            `/consulta/${consulta.consultaId}`
                                                        )
                                                    }
                                                    aria-label="Ver detalles">
                                                    <BsEye size={16} />
                                                </ActionIcon>

                                            </Tooltip>

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

                                        <span className={
                                                consulta.activo === "Activo"
                                                    ? classes.badgeActive
                                                    : classes.badgeInactive}>
                                            {consulta.activo}
                                        </span>

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
    );
}