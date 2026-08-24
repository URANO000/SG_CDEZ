import {
    Divider,
    Paper,
    Stack,
    Text,
    Title,
} from "@mantine/core";

import classes from "../styleModules/ConsultaDetalle.module.css";
import { useAuth } from "../../../services/authContext";

import type { ConsultaDetailResponse } from "../../../services/interfaces/consultasDetailsResponse";

interface ConsultaClinicaCardProps {
    consulta: ConsultaDetailResponse;
}

export function ConsultaClinicaCard({
    consulta,
}: ConsultaClinicaCardProps) {
    const { user } = useAuth();
    const esConsultaPsicologica = consulta.createdBy.especialidad === 'Psicología';
    const puedeVerCamposClinicos = !esConsultaPsicologica || user?.especialidad === 'Psicología';

    return (
        <Paper className={classes.card}>

            <Title
                order={4}
                className={classes.sectionTitle}
            >
                Evaluación clínica
            </Title>


            <Stack gap="lg">

                {puedeVerCamposClinicos && (
                    <div>
                        <Text className={classes.label}>
                            Motivo de consulta
                        </Text>

                        <Text className={classes.longValue}>
                            {consulta.motivo}
                        </Text>
                    </div>
                )}
                {
                    puedeVerCamposClinicos && (
                        <>
                            <Divider />


                            <div>
                                <Text className={classes.label}>
                                    Descripción
                                </Text>

                                <Text className={classes.longValue}>
                                    {consulta.descripcion}
                                </Text>
                            </div>


                            <Divider />
                        </>
                    )
                }


                <div>
                    <Text className={classes.label}>
                        Diagnóstico
                    </Text>

                    <Text className={classes.longValue}>
                        {consulta.diagnostico}
                    </Text>
                </div>

                {puedeVerCamposClinicos && (
                    <>
                        <Divider />

                        <div>
                            <Text className={classes.label}>
                                Resultados de evaluaciones
                            </Text>

                            <Text className={classes.longValue}>
                                {consulta.resultadosEvaluaciones}
                            </Text>
                        </div>
                    </>
                )}

                    <Divider />


                <div>
                    <Text className={classes.label}>
                        Recomendaciones
                    </Text>

                    <Text className={classes.longValue}>
                        {consulta.recomendaciones}
                    </Text>
                </div>


                {puedeVerCamposClinicos && (
                    <>
                        <Divider />

                        <div>
                            <Text className={classes.label}>
                                Notas
                            </Text>

                            <Text className={classes.longValue}>
                                {consulta.notas}
                            </Text>
                        </div>
                    </>
                )}

            </Stack>

        </Paper>
    );
}