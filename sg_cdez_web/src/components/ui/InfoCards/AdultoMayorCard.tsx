import {
    Paper,
    SimpleGrid,
    Text,
    Title,
} from "@mantine/core";

import classes from "../styleModules/ConsultaDetalle.module.css";

import type { AdultoMayorConsultaResponse } from "../../../services/interfaces/consultasInterface";

interface AdultoMayorCardProps {
    adultoMayor: AdultoMayorConsultaResponse;
}

export function AdultoMayorCard({
    adultoMayor,
}: AdultoMayorCardProps) {

    return (
        <Paper className={classes.card}>

            <Title
                order={4}
                className={classes.sectionTitle}
            >
                Información del adulto mayor
            </Title>


            <SimpleGrid
                cols={{ base: 1, sm: 2 }}
                spacing="lg"
                className={classes.infoGrid}
            >

                <div>
                    <Text className={classes.label}>
                        Nombre completo
                    </Text>

                    <Text className={classes.value}>
                        {adultoMayor.nombreCompleto}
                    </Text>
                </div>


                <div>
                    <Text className={classes.label}>
                        Identificación
                    </Text>

                    <Text className={classes.value}>
                        {adultoMayor.identificacion}
                    </Text>
                </div>


                <div>
                    <Text className={classes.label}>
                        Tipo de identificación
                    </Text>

                    <Text className={classes.value}>
                        {adultoMayor.tipoIdentificacion}
                    </Text>
                </div>


                <div>
                    <Text className={classes.label}>
                        Fecha de nacimiento
                    </Text>

                    <Text className={classes.value}>
                        {adultoMayor.fechaNacimiento}
                    </Text>
                </div>

            </SimpleGrid>

        </Paper>
    );
}