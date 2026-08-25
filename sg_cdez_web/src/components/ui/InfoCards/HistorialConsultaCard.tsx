import {
    Paper,
    SimpleGrid,
    Text,
    Title,
} from "@mantine/core";

import classes from "../styleModules/ConsultaDetalle.module.css";

import type { ConsultaDetailResponse } from "../../../services/interfaces/consultasDetailsResponse";

import { mostrarFecha } from "../../../utils/formatHelper";

interface HistorialConsultaCardProps {
    consulta: ConsultaDetailResponse;
}

export function HistorialConsultaCard({
    consulta,
}: HistorialConsultaCardProps) {

    return (
        <Paper className={classes.card}>

            <Title
                order={4}
                className={classes.sectionTitle}>
                Historial del registro
            </Title>


            <SimpleGrid
                cols={{ base: 1, sm: 2 }}
                spacing="lg"
                className={classes.infoGrid}>

                <div>

                    <Text className={classes.label}>
                        Creado por
                    </Text>

                    <Text className={classes.value}>
                        {consulta.createdBy.usuario}
                    </Text>

                </div>


                <div>

                    <Text className={classes.label}>
                        Creado en
                    </Text>

                    <Text className={classes.value}>
                        {mostrarFecha(consulta.createdAt)}
                    </Text>

                </div>


                <div>

                    <Text className={classes.label}>
                        Última actualización
                    </Text>

                    <Text className={classes.value}>
                        {consulta.updatedAt
                            ? mostrarFecha(consulta.updatedAt)
                            : "N/A"}
                    </Text>

                </div>

            </SimpleGrid>

        </Paper>
    );
}