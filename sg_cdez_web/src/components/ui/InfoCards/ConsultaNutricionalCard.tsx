import {
    Divider,
    Paper,
    SimpleGrid,
    Stack,
    Table,
    Text,
    Title,
} from "@mantine/core";

import classes from "../styleModules/ConsultaDetalle.module.css";

import type { ConsultaNutricionalDetailResponse } from "../../../services/interfaces/consultasDetailsResponse";
import { obtenerFechaSinHora } from "../../../utils/formatHelper";

interface ConsultaNutricionalCardProps {
    nutricional: ConsultaNutricionalDetailResponse;
}

export function ConsultaNutricionalCard({
    nutricional,
}: ConsultaNutricionalCardProps) {

    return (
        <Paper className={classes.card}>

            <Title
                order={4}
                className={classes.sectionTitle}>
                Evaluación nutricional
            </Title>


            <Stack gap="xl">

                {/* HISTORIA ALIMENTARIA */}

                <div>

                    <Text className={classes.subSectionTitle}>
                        Historia alimentaria
                    </Text>

                    <Text className={classes.longValue}>
                        {nutricional.historiaAlimentaria}
                    </Text>

                </div>

                <Divider />


                {/*----------- EVALUACIÓN FUNCIONAL ----------*/}

                <div>

                    <Text className={classes.subSectionTitle}>
                        Evaluación funcional y alimentaria
                    </Text>


                    <SimpleGrid
                        cols={{ base: 1, sm: 2 }}
                        spacing="lg"
                        className={classes.infoGrid}>

                        <div>
                            <Text className={classes.label}>
                                Apetito
                            </Text>

                            <Text className={classes.value}>
                                {nutricional.apetito}
                            </Text>
                        </div>


                        <div>
                            <Text className={classes.label}>
                                Masticación
                            </Text>

                            <Text className={classes.value}>
                                {nutricional.masticacion}
                            </Text>
                        </div>


                        <div>
                            <Text className={classes.label}>
                                Deglución
                            </Text>

                            <Text className={classes.value}>
                                {nutricional.deglucion}
                            </Text>
                        </div>


                        <div>
                            <Text className={classes.label}>
                                Frecuencia de evaluaciones
                            </Text>

                            <Text className={classes.value}>
                                {nutricional.frecuenciaEvacuaciones}
                            </Text>
                        </div>

                        <div>
                            <Text className={classes.label}>
                                Consistencia Btristol
                            </Text>

                            <Text className={classes.value}>
                                {nutricional.consistenciaBristol}
                            </Text>
                        </div>


                        <div>
                            <Text className={classes.label}>
                                Estado cognitivo
                            </Text>

                            <Text className={classes.value}>
                                {nutricional.estadoCognitivo}
                            </Text>
                        </div>

                    </SimpleGrid>

                </div>
                <Divider />


                {/*------- SÍNTOMAS GASTROINTESTINALES -------*/}

                <div>

                    <Text className={classes.subSectionTitle}>
                        Sintomatología gastrointestinal
                    </Text>

                    <SimpleGrid
                        cols={{
                            base: 2,
                            sm: 3,
                        }}
                        spacing="lg"
                        className={classes.infoGrid}>

                        <BooleanField
                            label="Náuseas"
                            value={nutricional.nauseas} />

                        <BooleanField
                            label="Vómitos"
                            value={nutricional.vomitos} />

                        <BooleanField
                            label="Distensión"
                            value={nutricional.distension} />

                        <BooleanField
                            label="Gases"
                            value={nutricional.gases} />

                        <BooleanField
                            label="Reflujo"
                            value={nutricional.reflujo} />

                        <BooleanField
                            label="Diarrea"
                            value={nutricional.diarrea}
                        />

                        <BooleanField
                            label="Estreñimiento"
                            value={nutricional.estrenimiento}
                        />

                    </SimpleGrid>

                </div>
                <Divider />

                {/*---------- TAMIZAJES -----------*/}

                <div>

                    <Text className={classes.subSectionTitle}>
                        Tamizajes nutricionales
                    </Text>


                    {nutricional.tamizajes.length > 0 ? (

                        <Table.ScrollContainer minWidth={600}>

                            <Table verticalSpacing="sm">

                                <Table.Thead>

                                    <Table.Tr>

                                        <Table.Th>
                                            Tipo
                                        </Table.Th>

                                        <Table.Th>
                                            Puntaje
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

                                    {nutricional.tamizajes.map(
                                        (tamizaje) => (
                                            <Table.Tr
                                                key={tamizaje.tamizajeId}>

                                                <Table.Td>
                                                    {tamizaje.tipo}
                                                </Table.Td>

                                                <Table.Td>
                                                    {tamizaje.puntaje?.toString()}
                                                </Table.Td>

                                                <Table.Td>
                                                    {tamizaje.resultado}
                                                </Table.Td>

                                                <Table.Td>
                                                    {tamizaje.observaciones}
                                                </Table.Td>

                                            </Table.Tr>
                                        )
                                    )}
                                </Table.Tbody>
                            </Table>

                        </Table.ScrollContainer>

                    ) : (

                        <Text className={classes.emptyText}>
                            No se registraron tamizajes.
                        </Text>

                    )}

                </div>


                <Divider />


                {/*--------------- EXÁMENES --------------*/}

                <div>

                    <Text className={classes.subSectionTitle}>
                        Exámenes de laboratorio
                    </Text>


                    {nutricional.examenesLaboratorio.length > 0 ? (

                        <Table.ScrollContainer minWidth={700}>

                            <Table verticalSpacing="sm">

                                <Table.Thead>

                                    <Table.Tr>

                                        <Table.Th>
                                            Examen
                                        </Table.Th>

                                        <Table.Th>
                                            Valor
                                        </Table.Th>

                                        <Table.Th>
                                            Unidad
                                        </Table.Th>

                                        <Table.Th>
                                            Fecha
                                        </Table.Th>

                                        <Table.Th>
                                            Observaciones
                                        </Table.Th>

                                    </Table.Tr>

                                </Table.Thead>


                                <Table.Tbody>

                                    {nutricional.examenesLaboratorio.map(
                                        (examen) => (

                                            <Table.Tr
                                                key={examen.examenId}>

                                                <Table.Td>
                                                    {examen.nombre}
                                                </Table.Td>

                                                <Table.Td>
                                                    {examen.valor}
                                                </Table.Td>

                                                <Table.Td>
                                                    {examen.unidad}
                                                </Table.Td>

                                                <Table.Td>
                                                    {obtenerFechaSinHora(examen.fecha)}
                                                </Table.Td>

                                                <Table.Td>
                                                    {examen.observaciones}
                                                </Table.Td>

                                            </Table.Tr>

                                        )
                                    )}

                                </Table.Tbody>

                            </Table>

                        </Table.ScrollContainer>

                    ) : (

                        <Text className={classes.emptyText}>
                            No se registraron exámenes de laboratorio.
                        </Text>

                    )}

                </div>

                <Divider />


                {/*--------------- ANTROPOMETRÍA ---------------*/}

                <div>

                    <Text className={classes.subSectionTitle}>
                        Evaluación antropométrica
                    </Text>


                    <SimpleGrid
                        cols={{
                            base: 1,
                            sm: 2,
                            md: 3,
                        }}
                        spacing="lg"
                        className={classes.infoGrid}>

                        <DecimalField label="Peso actual" value={nutricional.antropometria.pesoActual} />

                        <DecimalField label="Peso habitual" value={nutricional.antropometria.pesoHabitual} />

                        <DecimalField label="Peso hace 6 meses" value={nutricional.antropometria.pesoHace6Meses} />

                        <DecimalField label="Talla" value={nutricional.antropometria.talla} />

                        <DecimalField label="Altura estimada" value={nutricional.antropometria.alturaEstimada} />

                        <DecimalField label="IMC" value={nutricional.antropometria.imc} />

                        <DecimalField label="Circunferencia de pantorrilla" value={nutricional.antropometria.circunferenciaPantorrilla} />

                        <DecimalField label="Circunferencia braquial" value={nutricional.antropometria.circunferenciaBraquial} />

                        <DecimalField label="Circunferencia de cintura" value={nutricional.antropometria.circunferenciaCintura} />

                        <DecimalField label="Pérdida de peso" value={nutricional.antropometria.perdidaPesoPorcentaje} suffix="%" />

                    </SimpleGrid>

                </div>

            </Stack>

        </Paper>
    );
}


interface BooleanFieldProps {
    label: string;
    value: boolean;
}

function BooleanField({
    label,
    value,
}: BooleanFieldProps) {

    return (
        <div>

            <Text className={classes.label}>
                {label}
            </Text>

            <Text className={classes.value}>
                {value ? "Sí" : "No"}
            </Text>

        </div>
    );
}


interface DecimalFieldProps {
    label: string;
    value: unknown;
    suffix?: string;
}

function DecimalField({
    label,
    value,
    suffix = "",
}: DecimalFieldProps) {

    return (
        <div>

            <Text className={classes.label}>
                {label}
            </Text>

            <Text className={classes.value}>
                {value != null
                    ? `${value}${suffix}`
                    : "N/A"}
            </Text>

        </div>
    );
}