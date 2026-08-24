import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
    ActionIcon,
    Badge,
    Divider,
    Group,
    Loader,
    Paper,
    SimpleGrid,
    Stack,
    Table,
    Text,
    Title,
} from "@mantine/core";

import { BsArrowLeft } from "react-icons/bs";

import classes from "../personal/Detalle.module.css"

import { obtenerConsultaPorId } from "../../services/consultasService";
import type { ConsultaDetailResponse } from "../../services/interfaces/consultasDetailsResponse";

import { mostrarFecha } from "../../utils/formatHelper";


export function ConsultaDetalle() {

    const { consultaId } = useParams();
    const navigate = useNavigate();

    const [consulta, setConsulta] =
        useState<ConsultaDetailResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {

        if (!consultaId) return;

        setLoading(true);
        setError(false);

        const cargarConsulta = async () => {

            try {

                const response =
                    await obtenerConsultaPorId(consultaId);

                setConsulta(response);

            } catch (error) {

                console.error(
                    "Error obteniendo consulta:",
                    error
                );

                setError(true);

            } finally {

                setLoading(false);

            }
        };

        cargarConsulta();

    }, [consultaId]);


    if (loading) {

        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                }}
            >
                <Loader
                    color="var(--color-primary)"
                    size="lg"
                />
            </div>
        );
    }


    if (error || !consulta) {

        return (
            <div className={classes.errorState}>
                <Text className={classes.emptyText}>
                    No se pudo cargar la información de la consulta.
                </Text>
            </div>
        );
    }


    const isActive = consulta.activo === "Activo";

    const nutricional = consulta.consultaNutricional;


    return (

        <div className={classes.container}>

            {/* =====================================================
                TOP BAR
            ====================================================== */}

            <Group
                justify="space-between"
                className={classes.topBar}
            >

                <ActionIcon
                    variant="subtle"
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                >
                    <BsArrowLeft size={18} />
                </ActionIcon>

            </Group>


            {/* =====================================================
                HEADER
            ====================================================== */}

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


            <div className={classes.contentGrid}>


                {/* =================================================
                    LEFT COLUMN
                ================================================== */}

                <div
                    className={`${classes.mainColumn} ${classes.topCard}`}
                >


                    {/* =============================================
                        DATOS DEL ADULTO MAYOR
                    ============================================== */}

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
                                    {consulta.adultoMayor.nombreCompleto}
                                </Text>

                            </div>


                            <div>

                                <Text className={classes.label}>
                                    Identificación
                                </Text>

                                <Text className={classes.value}>
                                    {consulta.adultoMayor.identificacion}
                                </Text>

                            </div>


                            <div>

                                <Text className={classes.label}>
                                    Tipo de identificación
                                </Text>

                                <Text className={classes.value}>
                                    {consulta.adultoMayor.tipoIdentificacion}
                                </Text>

                            </div>


                            <div>

                                <Text className={classes.label}>
                                    Fecha de nacimiento
                                </Text>

                                <Text className={classes.value}>
                                    {mostrarFecha(consulta.adultoMayor.fechaNacimiento)}
                                </Text>

                            </div>

                        </SimpleGrid>

                    </Paper>


                    {/* =============================================
                        INFORMACIÓN DE LA CONSULTA
                    ============================================== */}

                    <Paper className={classes.card}>

                        <Title
                            order={4}
                            className={classes.sectionTitle}
                        >
                            Información de la consulta
                        </Title>


                        <Stack gap="lg">

                            <div>

                                <Text className={classes.label}>
                                    Motivo de consulta
                                </Text>

                                <Text className={classes.value}>
                                    {consulta.motivo}
                                </Text>

                            </div>


                            <Divider />


                            <div>

                                <Text className={classes.label}>
                                    Descripción
                                </Text>

                                <Text className={classes.value}>
                                    {consulta.descripcion}
                                </Text>

                            </div>


                            <Divider />


                            <div>

                                <Text className={classes.label}>
                                    Diagnóstico
                                </Text>

                                <Text className={classes.value}>
                                    {consulta.diagnostico}
                                </Text>

                            </div>


                            <Divider />


                            <div>

                                <Text className={classes.label}>
                                    Resultados de evaluaciones
                                </Text>

                                <Text className={classes.value}>
                                    {consulta.resultadosEvaluaciones}
                                </Text>

                            </div>


                            <Divider />


                            <div>

                                <Text className={classes.label}>
                                    Recomendaciones
                                </Text>

                                <Text className={classes.value}>
                                    {consulta.recomendaciones}
                                </Text>

                            </div>


                            <Divider />


                            <div>

                                <Text className={classes.label}>
                                    Notas
                                </Text>

                                <Text className={classes.value}>
                                    {consulta.notas}
                                </Text>

                            </div>

                        </Stack>

                    </Paper>


                    {/* =================================================
                        CONSULTA NUTRICIONAL
                    ================================================== */}

                    {nutricional && (

                        <Paper className={classes.card}>

                            <Title
                                order={4}
                                className={classes.sectionTitle}
                            >
                                Evaluación nutricional
                            </Title>


                            <Stack gap="xl">


                                {/* =====================================
                                    HISTORIA ALIMENTARIA
                                ====================================== */}

                                <div>

                                    <Text className={classes.subSectionTitle}>
                                        Historia alimentaria
                                    </Text>

                                    <Text className={classes.value}>
                                        {nutricional.historiaAlimentaria}
                                    </Text>

                                </div>


                                <Divider />


                                {/* =====================================
                                    HÁBITOS Y FUNCIÓN
                                ====================================== */}

                                <div>

                                    <Text className={classes.subSectionTitle}>
                                        Evaluación funcional y alimentaria
                                    </Text>


                                    <SimpleGrid
                                        cols={{ base: 1, sm: 2 }}
                                        spacing="lg"
                                        className={classes.infoGrid}
                                    >

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
                                                {nutricional.frecuenciaEvaluaciones}
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


                                {/* =====================================
                                    SÍNTOMAS GASTROINTESTINALES
                                ====================================== */}

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
                                        className={classes.infoGrid}
                                    >

                                        <div>

                                            <Text className={classes.label}>
                                                Náuseas
                                            </Text>

                                            <Text className={classes.value}>
                                                {nutricional.nauseas
                                                    ? "Sí"
                                                    : "No"}
                                            </Text>

                                        </div>


                                        <div>

                                            <Text className={classes.label}>
                                                Vómitos
                                            </Text>

                                            <Text className={classes.value}>
                                                {nutricional.vomitos
                                                    ? "Sí"
                                                    : "No"}
                                            </Text>

                                        </div>


                                        <div>

                                            <Text className={classes.label}>
                                                Distensión
                                            </Text>

                                            <Text className={classes.value}>
                                                {nutricional.distencion
                                                    ? "Sí"
                                                    : "No"}
                                            </Text>

                                        </div>


                                        <div>

                                            <Text className={classes.label}>
                                                Gases
                                            </Text>

                                            <Text className={classes.value}>
                                                {nutricional.gases
                                                    ? "Sí"
                                                    : "No"}
                                            </Text>

                                        </div>


                                        <div>

                                            <Text className={classes.label}>
                                                Reflujo
                                            </Text>

                                            <Text className={classes.value}>
                                                {nutricional.reflujo
                                                    ? "Sí"
                                                    : "No"}
                                            </Text>

                                        </div>

                                    </SimpleGrid>

                                </div>


                                <Divider />


                                {/* =====================================
                                    TAMIZAJES
                                ====================================== */}

                                <div>

                                    <Text className={classes.subSectionTitle}>
                                        Tamizajes nutricionales
                                    </Text>


                                    {nutricional.tamizajes.length > 0 ? (

                                        <Table.ScrollContainer minWidth={600}>

                                            <Table
                                                verticalSpacing="sm"
                                            >

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
                                                                key={
                                                                    tamizaje.tamizajeId
                                                                }
                                                            >

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


                                {/* =====================================
                                    EXÁMENES DE LABORATORIO
                                ====================================== */}

                                <div>

                                    <Text className={classes.subSectionTitle}>
                                        Exámenes de laboratorio
                                    </Text>


                                    {nutricional.examenesLaboratorio.length > 0 ? (

                                        <Table.ScrollContainer minWidth={700}>

                                            <Table
                                                verticalSpacing="sm"
                                            >

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
                                                                key={
                                                                    examen.examenId
                                                                }
                                                            >

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
                                                                    {examen.fecha}
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


                                {/* =====================================
                                    ANTROPOMETRÍA
                                ====================================== */}

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
                                        className={classes.infoGrid}
                                    >

                                        <div>
                                            <Text className={classes.label}>
                                                Peso actual
                                            </Text>
                                            <Text className={classes.value}>
                                                {nutricional.antropometria.pesoActual?.toString()}
                                            </Text>
                                        </div>


                                        <div>
                                            <Text className={classes.label}>
                                                Peso habitual
                                            </Text>
                                            <Text className={classes.value}>
                                                {nutricional.antropometria.pesoHabitual?.toString()}
                                            </Text>
                                        </div>


                                        <div>
                                            <Text className={classes.label}>
                                                Peso hace 6 meses
                                            </Text>
                                            <Text className={classes.value}>
                                                {nutricional.antropometria.pesoHace6Meses?.toString()}
                                            </Text>
                                        </div>


                                        <div>
                                            <Text className={classes.label}>
                                                Talla
                                            </Text>
                                            <Text className={classes.value}>
                                                {nutricional.antropometria.talla?.toString()}
                                            </Text>
                                        </div>


                                        <div>
                                            <Text className={classes.label}>
                                                Altura estimada
                                            </Text>
                                            <Text className={classes.value}>
                                                {nutricional.antropometria.alturaEstimada?.toString()}
                                            </Text>
                                        </div>


                                        <div>
                                            <Text className={classes.label}>
                                                IMC
                                            </Text>
                                            <Text className={classes.value}>
                                                {nutricional.antropometria.imc?.toString()}
                                            </Text>
                                        </div>


                                        <div>
                                            <Text className={classes.label}>
                                                Circunferencia de pantorrilla
                                            </Text>
                                            <Text className={classes.value}>
                                                {nutricional.antropometria.circumferenciaPantorrilla?.toString()}
                                            </Text>
                                        </div>


                                        <div>
                                            <Text className={classes.label}>
                                                Circunferencia braquial
                                            </Text>
                                            <Text className={classes.value}>
                                                {nutricional.antropometria.circumferenciaBraquial?.toString()}
                                            </Text>
                                        </div>


                                        <div>
                                            <Text className={classes.label}>
                                                Circunferencia de cintura
                                            </Text>
                                            <Text className={classes.value}>
                                                {nutricional.antropometria.circumferenciaCintura?.toString()}
                                            </Text>
                                        </div>


                                        <div>
                                            <Text className={classes.label}>
                                                Pérdida de peso
                                            </Text>
                                            <Text className={classes.value}>
                                                {nutricional.antropometria.perdidaPesoPorcentaje?.toString()}%
                                            </Text>
                                        </div>

                                    </SimpleGrid>

                                </div>

                            </Stack>

                        </Paper>

                    )}

                </div>


                {/* =================================================
                    RIGHT COLUMN
                ================================================== */}

                <div
                    className={`${classes.sideColumn} ${classes.topCard}`}
                >


                    {/* =============================================
                        PROFESIONAL
                    ============================================== */}

                    <Paper className={classes.card}>

                        <Title
                            order={4}
                            className={classes.sectionTitle}
                        >
                            Profesional responsable
                        </Title>


                        <Stack gap="lg">

                            <div>

                                <Text className={classes.label}>
                                    Nombre completo
                                </Text>

                                <Text className={classes.value}>
                                    {consulta.createdBy.nombreCompleto}
                                </Text>

                            </div>


                            <div>

                                <Text className={classes.label}>
                                    Especialidad
                                </Text>

                                <Text className={classes.value}>
                                    {consulta.createdBy.especialidad}
                                </Text>

                            </div>


                            <div>

                                <Text className={classes.label}>
                                    Usuario
                                </Text>

                                <Text className={classes.value}>
                                    {consulta.createdBy.usuario}
                                </Text>

                            </div>

                        </Stack>

                    </Paper>


                    {/* =============================================
                        HISTORIAL DEL REGISTRO
                    ============================================== */}

                    <Paper className={classes.card}>

                        <Title
                            order={4}
                            className={classes.sectionTitle}
                        >
                            Historial del registro
                        </Title>


                        <SimpleGrid
                            cols={{ base: 1, sm: 2 }}
                            spacing="lg"
                            className={classes.infoGrid}
                        >

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


                    {/* =============================================
                        TIPO DE ATENCIÓN
                    ============================================== */}

                    <Paper className={classes.card}>

                        <Title
                            order={4}
                            className={classes.sectionTitle}
                        >
                            Información de atención
                        </Title>


                        <Stack gap="lg">

                            <div>

                                <Text className={classes.label}>
                                    Tipo de consulta
                                </Text>

                                <Text className={classes.value}>
                                    {consulta.tipoConsulta}
                                </Text>

                            </div>


                            <div>

                                <Text className={classes.label}>
                                    Estado
                                </Text>

                                <Badge
                                    className={
                                        isActive
                                            ? classes.badgeActive
                                            : classes.badgeInactive
                                    }
                                >
                                    {consulta.activo}
                                </Badge>

                            </div>

                        </Stack>

                    </Paper>

                </div>

            </div>

        </div>
    );
}