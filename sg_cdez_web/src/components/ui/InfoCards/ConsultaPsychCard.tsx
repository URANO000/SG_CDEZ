import { Paper, Title, Stack, Text, Table } from "@mantine/core";
import type { ConsultaPsychDetailResponse } from "../../../services/interfaces/consultasDetailsResponse";
import classes from "../styleModules/ConsultaDetalle.module.css";

interface ConsultaPsychCardProps {
    psych: ConsultaPsychDetailResponse;
}

export function ConsultaPsychCard({ psych }: ConsultaPsychCardProps) {
    return (
        <>
            <Paper className={classes.card}>
                <Title
                    order={4}
                    className={classes.sectionTitle}>
                    Evaluación psicológica
                </Title>

                <Stack gap="xl">
                    <div>
                        <Text className={classes.subSectionTitle}>
                            Tamizajes psicológicos
                        </Text>

                        {
                            psych.tamizajes.length > 0 ? (
                                <Table.ScrollContainer minWidth={600}>
                                    <Table verticalSpacing="sm">
                                        <Table.Thead>

                                            <Table.Tr>

                                                <Table.Th>
                                                    Tipo
                                                </Table.Th>

                                                <Table.Th>
                                                    Resultado
                                                </Table.Th>

                                                <Table.Th>
                                                    Observaciones
                                                </Table.Th>

                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {
                                                psych.tamizajes.map((tamizaje) => (
                                                    <Table.Tr key={tamizaje.tamizajeId}>
                                                        <Table.Td>
                                                            {tamizaje.tipo}
                                                        </Table.Td>

                                                        <Table.Td>
                                                            {tamizaje.resultado}
                                                        </Table.Td>

                                                        <Table.Td>
                                                            {tamizaje.observaciones}
                                                        </Table.Td>
                                                    </Table.Tr>
                                                ))
                                            }
                                        </Table.Tbody>
                                    </Table>
                                </Table.ScrollContainer>
                            ) : (
                                <Text className={classes.emptyText}>
                                    No se registraron tamizajes.
                                </Text>
                            )
                        }
                    </div>

                </Stack>

            </Paper>
        </>
    )
}