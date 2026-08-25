import { Badge, Group, Paper, Text, Title } from "@mantine/core";

import classes from "../styleModules/ConsultaDetalle.module.css";

import type { ConsultaDetailResponse } from "../../../services/interfaces/consultasDetailsResponse";
interface ConsultaHeaderProps {
    consulta: ConsultaDetailResponse;
}

export function ConsultaHeader({
    consulta,
}: ConsultaHeaderProps) {

    const isActive = consulta.activo === "Activo";

    return (
        <Paper className={classes.headerCard}>

            <Group
                justify="space-between"
                wrap="wrap"
            >

                <div>

                    <Text className={classes.label}>
                        Consulta
                    </Text>

                    <Title
                        order={2}
                        className={classes.name}
                    >
                        {consulta.adultoMayor.nombreCompleto}
                    </Title>

                    <Text
                        size="sm"
                        className={classes.subText}
                    >
                        {consulta.tipoConsulta}
                    </Text>

                </div>


                <Badge
                    size="lg"
                    className={
                        isActive
                            ? classes.badgeActive
                            : classes.badgeInactive
                    }
                >
                    {consulta.activo}
                </Badge>

            </Group>

        </Paper>
    );
}