import {
    Paper,
    Stack,
    Text,
    Title,
} from "@mantine/core";

import classes from "../styleModules/ConsultaDetalle.module.css";

import type { PersonalConsultaResponse } from "../../../services/interfaces/consultasInterface";

interface ProfesionalCardProps {
    personal: PersonalConsultaResponse;
}

export function ProfesionalCard({
    personal,
}: ProfesionalCardProps) {

    return (
        <Paper className={classes.card}>

            <Title
                order={4}
                className={classes.sectionTitle}>
                Profesional responsable
            </Title>


            <Stack gap="lg">

                <div>
                    <Text className={classes.label}>
                        Nombre completo
                    </Text>

                    <Text className={classes.value}>
                        {personal.nombreCompleto}
                    </Text>
                </div>


                <div>
                    <Text className={classes.label}>
                        Especialidad
                    </Text>

                    <Text className={classes.value}>
                        {personal.especialidad}
                    </Text>
                </div>


                <div>
                    <Text className={classes.label}>
                        Usuario
                    </Text>

                    <Text className={classes.value}>
                        {personal.usuario}
                    </Text>
                </div>

            </Stack>

        </Paper>
    );
}