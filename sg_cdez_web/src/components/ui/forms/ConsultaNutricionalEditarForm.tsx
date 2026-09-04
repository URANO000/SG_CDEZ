import { useEffect, useState } from "react";
import {
    ActionIcon,
    Button,
    Group,
    Paper,
    SimpleGrid,
    Switch,
    Text,
    TextInput,
    Textarea,
    Title,
    Select,
    Loader,
    Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useNavigate, useParams } from "react-router";
import { BsArrowLeft } from "react-icons/bs";
import axios from "axios";

import classes from "../styleModules/ConsultaRegistrarForm.module.css";

import {
    actualizarConsultaNutricional,
    obtenerConsultaPorId,
} from "../../../services/consultasService";

import type {
    ConsultaNutricionalUpdateRequest,
} from "../../../services/interfaces/consultasUpdateInterface";

import type {
    Apetito,
    ConsultaDetailResponse,
    TipoTamizajeNutricional,
} from "../../../services/interfaces/consultasDetailsResponse";

interface AntropometriaFormValues {
    antropometriaId: string;
    pesoActual: string;
    pesoHabitual: string;
    pesoHace6Meses: string;
    talla: string;
    alturaEstimada: string;
    imc: string;
    circunferenciaPantorrilla: string;
    circunferenciaBraquial: string;
    circunferenciaCintura: string;
    perdidaPesoPorcentaje: string;
}

interface TamizajeFormValues {
    tamizajeId: string;
    tipo: TipoTamizajeNutricional | null;
    puntaje: string;
    resultado: string;
    observaciones: string;
}

interface ExamenLaboratorioFormValues {
    examenId: string;
    nombre: string;
    valor: string;
    unidad: string;
    fecha: string;
    observaciones: string;
}

interface ConsultaNutricionalFormValues {
    consultaGeneral: {
        tipoConsulta: string;
        motivo: string;
        descripcion: string;
        diagnostico: string;
        resultadosEvaluaciones: string;
        recomendaciones: string;
        notas: string;
    };

    historiaAlimentaria: string;
    apetito: Apetito | null;
    masticacion: string;
    deglucion: string;

    nauseas: boolean;
    vomitos: boolean;
    distension: boolean;
    gases: boolean;
    reflujo: boolean;
    diarrea: boolean;
    estrenimiento: boolean;

    frecuenciaEvacuaciones: string;
    consistenciaBristol: string;
    estadoCognitivo: string;

    tamizajes: TamizajeFormValues[];
    examenesLaboratorio: ExamenLaboratorioFormValues[];
    antropometria: AntropometriaFormValues;
}

export function ConsultaNutricionalEditarForm() {

    const navigate = useNavigate();
    const { consultaId } = useParams();

    const [loading, setLoading] = useState(false);
    const [loadingConsulta, setLoadingConsulta] = useState(true);
    const [adultoMayor, setAdultoMayor] =
        useState<ConsultaDetailResponse["adultoMayor"] | null>(null);
    const [consultaNutricionalId, setConsultaNutricionalId] =
        useState<string | null>(null);

    const form = useForm<ConsultaNutricionalFormValues>({
        mode: "controlled",

        initialValues: {
            consultaGeneral: {
                tipoConsulta: "",
                motivo: "",
                descripcion: "",
                diagnostico: "",
                resultadosEvaluaciones: "",
                recomendaciones: "",
                notas: "",
            },

            historiaAlimentaria: "",
            apetito: null,
            masticacion: "",
            deglucion: "",

            nauseas: false,
            vomitos: false,
            distension: false,
            gases: false,
            reflujo: false,
            diarrea: false,
            estrenimiento: false,

            frecuenciaEvacuaciones: "",
            consistenciaBristol: "",
            estadoCognitivo: "",

            tamizajes: [],
            examenesLaboratorio: [],

            antropometria: {
                antropometriaId: "",
                pesoActual: "",
                pesoHabitual: "",
                pesoHace6Meses: "",
                talla: "",
                alturaEstimada: "",
                imc: "",
                circunferenciaPantorrilla: "",
                circunferenciaBraquial: "",
                circunferenciaCintura: "",
                perdidaPesoPorcentaje: "",
            },
        },

        validate: (values) => {
            const errors: Record<string, string> = {};

            if (!values.consultaGeneral.tipoConsulta.trim()) {
                errors["consultaGeneral.tipoConsulta"] =
                    "El tipo de consulta es obligatorio.";
            }

            if (!values.consultaGeneral.motivo.trim()) {
                errors["consultaGeneral.motivo"] =
                    "El motivo de la consulta es obligatorio.";
            } else if (
                values.consultaGeneral.motivo.trim().length < 5
            ) {
                errors["consultaGeneral.motivo"] =
                    "El motivo debe contener al menos 5 caracteres.";
            }


            const validarDecimalPositivo = (
                valor: string,
                campo: string,
                nombre: string
            ) => {
                if (!valor.trim()) {
                    errors[campo] = `${nombre} es obligatorio.`;
                    return;
                }

                const numero = Number(valor);

                if (Number.isNaN(numero)) {
                    errors[campo] =
                        `${nombre} debe ser un número válido.`;
                    return;
                }

                if (numero <= 0) {
                    errors[campo] =
                        `${nombre} debe ser mayor que cero.`;
                }
            };

            validarDecimalPositivo(
                values.antropometria.pesoActual,
                "antropometria.pesoActual",
                "El peso actual"
            );

            validarDecimalPositivo(
                values.antropometria.pesoHabitual,
                "antropometria.pesoHabitual",
                "El peso habitual"
            );

            validarDecimalPositivo(
                values.antropometria.pesoHace6Meses,
                "antropometria.pesoHace6Meses",
                "El peso de hace 6 meses"
            );

            validarDecimalPositivo(
                values.antropometria.talla,
                "antropometria.talla",
                "La talla"
            );

            validarDecimalPositivo(
                values.antropometria.alturaEstimada,
                "antropometria.alturaEstimada",
                "La altura estimada"
            );

            validarDecimalPositivo(
                values.antropometria.imc,
                "antropometria.imc",
                "El IMC"
            );

            validarDecimalPositivo(
                values.antropometria.circunferenciaPantorrilla,
                "antropometria.circunferenciaPantorrilla",
                "La circunferencia de pantorrilla"
            );

            validarDecimalPositivo(
                values.antropometria.circunferenciaBraquial,
                "antropometria.circunferenciaBraquial",
                "La circunferencia braquial"
            );

            validarDecimalPositivo(
                values.antropometria.circunferenciaCintura,
                "antropometria.circunferenciaCintura",
                "La circunferencia de cintura"
            );

            if (!values.antropometria.perdidaPesoPorcentaje.trim()) {
                errors["antropometria.perdidaPesoPorcentaje"] =
                    "El porcentaje de pérdida de peso es obligatorio.";
            } else {
                const perdida = Number(
                    values.antropometria.perdidaPesoPorcentaje
                );

                if (Number.isNaN(perdida)) {
                    errors["antropometria.perdidaPesoPorcentaje"] =
                        "El porcentaje debe ser un número válido.";
                } else if (perdida < 0) {
                    errors["antropometria.perdidaPesoPorcentaje"] =
                        "El porcentaje no puede ser negativo.";
                } else if (perdida > 100) {
                    errors["antropometria.perdidaPesoPorcentaje"] =
                        "El porcentaje no puede ser mayor a 100.";
                }
            }

            values.tamizajes.forEach((tamizaje, index) => {
                if (!tamizaje.tipo) {
                    errors[`tamizajes.${index}.tipo`] =
                        "Debe seleccionar el tipo de tamizaje.";
                }

                if (
                    tamizaje.puntaje.trim() &&
                    Number.isNaN(Number(tamizaje.puntaje))
                ) {
                    errors[`tamizajes.${index}.puntaje`] =
                        "El puntaje debe ser un número válido.";
                }
            });

            values.examenesLaboratorio.forEach((examen, index) => {
                if (!examen.nombre.trim()) {
                    errors[`examenesLaboratorio.${index}.nombre`] =
                        "El nombre del examen es obligatorio.";
                }

                if (
                    examen.fecha &&
                    Number.isNaN(new Date(examen.fecha).getTime())
                ) {
                    errors[`examenesLaboratorio.${index}.fecha`] =
                        "La fecha ingresada no es válida.";
                }
            });

            return errors;
        },
    });

    const calcularEdad = (
        fechaNacimiento: string | null
    ): number | null => {
        if (!fechaNacimiento) {
            return null;
        }

        const [year, month, day] =
            fechaNacimiento.split("-").map(Number);

        const hoy = new Date();

        let edad =
            hoy.getFullYear() - year;

        const yaCumplio =
            hoy.getMonth() + 1 > month ||
            (
                hoy.getMonth() + 1 === month &&
                hoy.getDate() >= day
            );

        if (!yaCumplio) {
            edad--;
        }

        return edad;
    };

    const edad = adultoMayor
        ? calcularEdad(adultoMayor.fechaNacimiento)
        : null;

    // Hydration
    useEffect(() => {
        if (!consultaId) {
            notifications.show({
                title: "Consulta inválida",
                message: "No se encontró el identificador de la consulta.",
                color: "red",
            });

            navigate("/consultas");
            return;
        }

        const cargarConsulta = async () => {
            try {
                setLoadingConsulta(true);

                const data = await obtenerConsultaPorId(consultaId);

                if (!data.consultaNutricional) {
                    notifications.show({
                        title: "Consulta inválida",
                        message:
                            "La consulta seleccionada no contiene información nutricional.",
                        color: "orange",
                    });

                    navigate("/consultas");
                    return;
                }

                const nutricional = data.consultaNutricional;
                const antropometria = nutricional.antropometria;
                setConsultaNutricionalId(
                    nutricional.consultaNutricionalId);

                form.setValues({
                    consultaGeneral: {
                        tipoConsulta: data.tipoConsulta ?? "",
                        motivo: data.motivo ?? "",
                        descripcion: data.descripcion ?? "",
                        diagnostico: data.diagnostico ?? "",
                        resultadosEvaluaciones:
                            data.resultadosEvaluaciones ?? "",
                        recomendaciones: data.recomendaciones ?? "",
                        notas: data.notas ?? "",
                    },

                    historiaAlimentaria:
                        nutricional.historiaAlimentaria ?? "",

                    apetito:
                        nutricional.apetito ?? null,

                    masticacion:
                        nutricional.masticacion ?? "",

                    deglucion:
                        nutricional.deglucion ?? "",

                    nauseas:
                        nutricional.nauseas ?? false,

                    vomitos:
                        nutricional.vomitos ?? false,

                    distension:
                        nutricional.distension ?? false,

                    gases:
                        nutricional.gases ?? false,

                    reflujo:
                        nutricional.reflujo ?? false,
                    diarrea:
                        nutricional.diarrea ?? false,
                    estrenimiento:
                        nutricional.estrenimiento ?? false,

                    frecuenciaEvacuaciones:
                        nutricional.frecuenciaEvacuaciones ?? "",

                    consistenciaBristol:
                        nutricional.consistenciaBristol ?? "",

                    estadoCognitivo:
                        nutricional.estadoCognitivo ?? "",

                    tamizajes:
                        nutricional.tamizajes?.map((tamizaje) => ({
                            tamizajeId: tamizaje.tamizajeId,
                            tipo: tamizaje.tipo,
                            puntaje:
                                tamizaje.puntaje != null
                                    ? String(tamizaje.puntaje)
                                    : "",
                            resultado:
                                tamizaje.resultado ?? "",
                            observaciones:
                                tamizaje.observaciones ?? "",
                        })) ?? [],

                    examenesLaboratorio:
                        nutricional.examenesLaboratorio?.map(
                            (examen) => ({
                                examenId: examen.examenId,
                                nombre: examen.nombre ?? "",
                                valor: examen.valor ?? "",
                                unidad: examen.unidad ?? "",

                                fecha: examen.fecha
                                    ? examen.fecha.substring(0, 10)
                                    : "",

                                observaciones:
                                    examen.observaciones ?? "",
                            })
                        ) ?? [],

                    antropometria: {
                        antropometriaId:
                            antropometria.antropometriaId,

                        pesoActual:
                            String(antropometria.pesoActual ?? ""),

                        pesoHabitual:
                            String(antropometria.pesoHabitual ?? ""),

                        pesoHace6Meses:
                            String(antropometria.pesoHace6Meses ?? ""),

                        talla:
                            String(antropometria.talla ?? ""),

                        alturaEstimada:
                            String(antropometria.alturaEstimada ?? ""),

                        imc:
                            String(antropometria.imc ?? ""),

                        circunferenciaPantorrilla:
                            String(
                                antropometria.circunferenciaPantorrilla ??
                                ""
                            ),

                        circunferenciaBraquial:
                            String(
                                antropometria.circunferenciaBraquial ??
                                ""
                            ),

                        circunferenciaCintura:
                            String(
                                antropometria.circunferenciaCintura ??
                                ""
                            ),

                        perdidaPesoPorcentaje:
                            String(
                                antropometria.perdidaPesoPorcentaje ??
                                ""
                            ),
                    },
                });

                setAdultoMayor(data.adultoMayor);

                form.resetDirty();
            } catch (error) {
                notifications.show({
                    title: "Error al cargar",
                    message:
                        "No se pudo cargar la consulta nutricional.",
                    color: "red",
                });
            } finally {
                setLoadingConsulta(false);
            }
        };

        cargarConsulta();
    }, [consultaId]);

    const nullable = (
        value: string
    ): string | null => {
        const limpio = value.trim();

        return limpio.length > 0
            ? limpio
            : null;
    };

    const handleSubmit = async (
        values: ConsultaNutricionalFormValues
    ) => {
        if (!consultaNutricionalId) {
            notifications.show({
                title: "Consulta inválida",
                message:
                    "No se encontró el identificador de la consulta nutricional.",
                color: "red",
            });

            return;
        }

        setLoading(true);

        try {
            const consulta: ConsultaNutricionalUpdateRequest = {
                consulta: {
                    tipoConsulta:
                        values.consultaGeneral.tipoConsulta.trim(),

                    motivo:
                        values.consultaGeneral.motivo.trim(),

                    descripcion:
                        nullable(
                            values.consultaGeneral.descripcion
                        ),

                    diagnostico:
                        nullable(
                            values.consultaGeneral.diagnostico
                        ),

                    resultadosEvaluaciones:
                        nullable(
                            values.consultaGeneral
                                .resultadosEvaluaciones
                        ),

                    recomendaciones:
                        nullable(
                            values.consultaGeneral.recomendaciones
                        ),

                    notas:
                        nullable(
                            values.consultaGeneral.notas
                        ),
                },

                historiaAlimentaria:
                    nullable(values.historiaAlimentaria),

                apetito:
                    values.apetito,

                masticacion:
                    nullable(values.masticacion),

                deglucion:
                    nullable(values.deglucion),

                nauseas:
                    values.nauseas,

                vomitos:
                    values.vomitos,

                distension:
                    values.distension,

                gases:
                    values.gases,

                reflujo:
                    values.reflujo,
                diarrea:
                    values.diarrea,
                estrenimiento:
                    values.estrenimiento,

                frecuenciaEvacuaciones:
                    values.frecuenciaEvacuaciones.trim(),

                consistenciaBristol:
                    values.consistenciaBristol.trim(),

                estadoCognitivo:
                    values.estadoCognitivo.trim(),

                tamizajes:
                    values.tamizajes.map((tamizaje) => ({
                        tamizajeId:
                            tamizaje.tamizajeId,

                        tipo:
                            tamizaje.tipo,

                        puntaje:
                            tamizaje.puntaje.trim()
                                ? Number(tamizaje.puntaje)
                                : null,

                        resultado:
                            nullable(tamizaje.resultado),

                        observaciones:
                            nullable(tamizaje.observaciones),
                    })),

                examenesLaboratorio:
                    values.examenesLaboratorio.map(
                        (examen) => ({
                            examenId:
                                examen.examenId,

                            nombre:
                                nullable(examen.nombre),

                            valor:
                                nullable(examen.valor),

                            unidad:
                                nullable(examen.unidad),

                            fecha:
                                nullable(
                                    examen.fecha
                                        ? `${examen.fecha}T00:00:00`
                                        : examen.fecha
                                ),

                            observaciones:
                                nullable(examen.observaciones),
                        })
                    ),

                antropometria: {
                    antropometriaId:
                        values.antropometria.antropometriaId,

                    pesoActual:
                        Number(
                            values.antropometria.pesoActual
                        ),

                    pesoHabitual:
                        Number(
                            values.antropometria.pesoHabitual
                        ),

                    pesoHace6Meses:
                        Number(
                            values.antropometria.pesoHace6Meses
                        ),

                    talla:
                        Number(
                            values.antropometria.talla
                        ),

                    alturaEstimada:
                        Number(
                            values.antropometria.alturaEstimada
                        ),

                    imc:
                        Number(
                            values.antropometria.imc
                        ),

                    circunferenciaPantorrilla:
                        Number(
                            values.antropometria
                                .circunferenciaPantorrilla
                        ),

                    circunferenciaBraquial:
                        Number(
                            values.antropometria
                                .circunferenciaBraquial
                        ),

                    circunferenciaCintura:
                        Number(
                            values.antropometria
                                .circunferenciaCintura
                        ),

                    perdidaPesoPorcentaje:
                        Number(
                            values.antropometria
                                .perdidaPesoPorcentaje
                        ),
                },
            };


            await actualizarConsultaNutricional(
                consultaNutricionalId,
                consulta
            );

            notifications.show({
                title: "Consulta nutricional actualizada",
                message:
                    "La consulta nutricional se actualizó correctamente.",
                color: "green",
            });

            navigate("/consultas");

        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 409
            ) {
                notifications.show({
                    title: "Consulta no actualizada",
                    message:
                        error.response.data?.message ??
                        "Existe un conflicto al actualizar la consulta.",
                    color: "orange",
                });

                return;
            }

            if (
                axios.isAxiosError(error) &&
                (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                )
            ) {
                notifications.show({
                    title: "Falta de permisos",
                    message:
                        error.response.data?.message ??
                        "No tiene permisos para actualizar la consulta.",
                    color: "orange",
                });

                return;
            }

            if (
                axios.isAxiosError(error) &&
                error.response?.status === 400
            ) {
                notifications.show({
                    title: "Datos inválidos",
                    message:
                        error.response.data?.message ??
                        "Revise los datos ingresados e intente nuevamente.",
                    color: "orange",
                });

                return;
            }

            notifications.show({
                title: "Error al actualizar",
                message:
                    "No se pudo actualizar la consulta nutricional.",
                color: "red",
            });

        } finally {
            setLoading(false);
        }
    };

    if (loadingConsulta) {
        return (
            <Center mih={300}>
                <Loader />
            </Center>
        );
    }

    return (
        <>
            <div className={classes.container}>
                <div className={classes.topBar}>
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
                    <Paper className={classes.headerCard}>
                        <Title
                            order={2}
                            className={classes.pageTitle}
                        >
                            Editar consulta nutricional
                        </Title>

                        <Text className={classes.subtitle}>
                            Modifique la información de la evaluación nutricional.
                        </Text>
                    </Paper>

                </div>

                <form onSubmit={form.onSubmit(handleSubmit)}>

                    <Paper className={classes.card}>
                        <Group className={classes.sectionHeader}>
                            <Title
                                order={4}
                                className={classes.sectionTitle}
                            >
                                Adulto mayor
                            </Title>
                        </Group>

                        {adultoMayor && (
                            <div className={classes.adultoSelector}>
                                <TextInput
                                    label="Nombre completo"
                                    value={adultoMayor.nombreCompleto}
                                    readOnly
                                    disabled
                                    classNames={{
                                        root: classes.readonlyField,
                                        label: classes.fieldLabel,
                                        input: classes.input,
                                    }}
                                />

                                <SimpleGrid
                                    cols={{
                                        base: 1,
                                        sm: 2,
                                        md: 3,
                                    }}
                                    mt="md"
                                >
                                    <TextInput
                                        label="Identificación"
                                        value={adultoMayor.identificacion}
                                        readOnly
                                        classNames={{
                                            root: classes.fieldGroup,
                                            label: classes.fieldLabel,
                                            input: classes.input,
                                        }}
                                        disabled
                                    />

                                    <TextInput
                                        label="Edad"
                                        value={
                                            edad !== null
                                                ? `${edad} años`
                                                : "No registrada"
                                        }
                                        readOnly
                                        classNames={{
                                            root: classes.fieldGroup,
                                            label: classes.fieldLabel,
                                            input: classes.input,
                                        }}
                                        disabled
                                    />

                                    <TextInput
                                        label="Tipo de identificación"
                                        value={adultoMayor.tipoIdentificacion}
                                        readOnly
                                        classNames={{
                                            root: classes.fieldGroup,
                                            label: classes.fieldLabel,
                                            input: classes.input,
                                        }}
                                        disabled
                                    />
                                </SimpleGrid>
                            </div>
                        )}
                    </Paper>
                    {/* INFORMACIÓN GENERAL */}
                    <Paper className={classes.card}>

                        <Group className={classes.sectionHeader}>
                            <Title
                                order={4}
                                className={classes.sectionTitle}
                            >
                                Información de la consulta
                            </Title>
                        </Group>


                        <div className={classes.formGrid}>

                            <TextInput
                                label="Tipo de consulta"
                                withAsterisk
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    required: classes.required,
                                    input: classes.input,
                                }}
                                {...form.getInputProps("consultaGeneral.tipoConsulta")}
                            />


                            <Textarea
                                label="Motivo de consulta"
                                withAsterisk
                                minRows={4}
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    required: classes.required,
                                    input: classes.textarea,
                                }}
                                {...form.getInputProps("consultaGeneral.motivo")}
                            />


                            <Textarea
                                label="Descripción"
                                minRows={4}
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    input: classes.textarea,
                                }}
                                {...form.getInputProps("consultaGeneral.descripcion")}
                            />


                            <Textarea
                                label="Diagnóstico"
                                minRows={4}
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    input: classes.textarea,
                                }}
                                {...form.getInputProps("consultaGeneral.diagnostico")}
                            />


                            <Textarea
                                label="Resultados de evaluaciones"
                                minRows={4}
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    input: classes.textarea,
                                }}
                                {...form.getInputProps("consultaGeneral.resultadosEvaluaciones")}
                            />


                            <Textarea
                                label="Recomendaciones"
                                minRows={4}
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    input: classes.textarea,
                                }}
                                {...form.getInputProps("consultaGeneral.recomendaciones")}
                            />


                            <Textarea
                                label="Notas"
                                minRows={4}
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    input: classes.textarea,
                                }}
                                {...form.getInputProps("consultaGeneral.notas")}
                            />

                        </div>

                    </Paper>


                    {/* HISTORIA ALIMENTARIA */}
                    <Paper className={classes.card}>

                        <Group className={classes.sectionHeader}>
                            <Title
                                order={4}
                                className={classes.sectionTitle}
                            >
                                Historia alimentaria
                            </Title>
                        </Group>


                        <div className={classes.formGrid}>

                            <Textarea
                                label="Historia alimentaria"
                                minRows={4}
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    input: classes.textarea,
                                }}
                                {...form.getInputProps("historiaAlimentaria")}
                            />


                            <Select
                                label="Apetito"
                                placeholder="Seleccione el apetito"
                                data={[
                                    { value: "BUENO", label: "Bueno" },
                                    { value: "REGULAR", label: "Regular" },
                                    { value: "MALO", label: "Malo" },
                                ]}
                                clearable
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    input: classes.input,
                                }}
                                {...form.getInputProps("apetito")}
                            />


                            <TextInput
                                label="Masticación"
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    input: classes.input,
                                }}
                                {...form.getInputProps("masticacion")}
                            />


                            <TextInput
                                label="Deglución"
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    input: classes.input,
                                }}
                                {...form.getInputProps("deglucion")}
                            />

                        </div>

                    </Paper>


                    {/* SÍNTOMAS GASTROINTESTINALES */}
                    <Paper className={classes.card}>

                        <Group className={classes.sectionHeader}>
                            <Title
                                order={4}
                                className={classes.sectionTitle}
                            >
                                Síntomas gastrointestinales
                            </Title>
                        </Group>


                        <SimpleGrid
                            cols={{
                                base: 1,
                                sm: 2,
                                md: 5,
                            }}
                            mb="lg">

                            <Switch
                                label="Náuseas"
                                {...form.getInputProps(
                                    "nauseas",
                                    { type: "checkbox" }
                                )}
                            />

                            <Switch
                                label="Vómitos"
                                {...form.getInputProps(
                                    "vomitos",
                                    { type: "checkbox" }
                                )}
                            />

                            <Switch
                                label="Distensión"
                                {...form.getInputProps(
                                    "distension",
                                    { type: "checkbox" }
                                )}
                            />

                            <Switch
                                label="Gases"
                                {...form.getInputProps(
                                    "gases",
                                    { type: "checkbox" }
                                )}
                            />

                            <Switch
                                label="Reflujo"
                                {...form.getInputProps(
                                    "reflujo",
                                    { type: "checkbox" }
                                )}
                            />
                            <Switch
                                label="Diarrea"
                                {...form.getInputProps(
                                    "diarrea",
                                    { type: "checkbox" }
                                )}
                            />
                            <Switch
                                label="Estreñimiento"
                                {...form.getInputProps(
                                    "estrenimiento",
                                    { type: "checkbox" }
                                )}
                            />

                        </SimpleGrid>


                        <div className={classes.formGrid}>

                            <TextInput
                                label="Frecuencia de evacuaciones"
                                placeholder="Ej. 1 vez al día"
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    input: classes.input,
                                }}
                            />

                            <TextInput
                                label="Consistencia Bristol"
                                placeholder="Ej. Tipo 4"
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    input: classes.input,
                                }}
                            />


                            <Textarea
                                label="Estado cognitivo"
                                minRows={3}
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    input: classes.textarea,
                                }}
                            />
                        </div>

                    </Paper>


                    {/* ANTROPOMETRÍA */}
                    <Paper className={classes.card}>

                        <Group className={classes.sectionHeader}>
                            <Title
                                order={4}
                                className={classes.sectionTitle}
                            >
                                Antropometría
                            </Title>
                        </Group>


                        <div className={classes.formGrid}>

                            <TextInput
                                label="Peso actual (kg)"
                                withAsterisk
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    required: classes.required,
                                    input: classes.input,
                                }}
                                type="number"
                                step="0.01"
                                min="0"
                                {...form.getInputProps(
                                    "antropometria.pesoActual"
                                )}
                            />


                            <TextInput
                                label="Peso habitual (kg)"
                                withAsterisk
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    required: classes.required,
                                    input: classes.input,
                                }}
                                type="number"
                                step="0.01"
                                min="0"
                                {...form.getInputProps(
                                    "antropometria.pesoHabitual"
                                )}
                            />


                            <TextInput
                                label="Peso hace 6 meses (kg)"
                                withAsterisk
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    required: classes.required,
                                    input: classes.input,
                                }}
                                type="number"
                                step="0.01"
                                min="0"
                                {...form.getInputProps(
                                    "antropometria.pesoHace6Meses"
                                )}
                            />


                            <TextInput
                                label="Talla (m)"
                                withAsterisk
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    required: classes.required,
                                    input: classes.input,
                                }}
                                type="number"
                                step="0.01"
                                min="0"
                                {...form.getInputProps(
                                    "antropometria.talla"
                                )}
                            />


                            <TextInput
                                label="Altura de rodilla (m)"
                                withAsterisk
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    required: classes.required,
                                    input: classes.input,
                                }}
                                type="number"
                                step="0.01"
                                min="0"
                                {...form.getInputProps(
                                    "antropometria.alturaEstimada"
                                )}
                            />


                            <TextInput
                                label="IMC"
                                withAsterisk
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    required: classes.required,
                                    input: classes.input,
                                }}
                                type="number"
                                step="0.01"
                                min="0"
                                {...form.getInputProps(
                                    "antropometria.imc"
                                )}
                            />


                            <TextInput
                                label="Circunferencia de pantorrilla (cm)"
                                withAsterisk
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    required: classes.required,
                                    input: classes.input,
                                }}
                                type="number"
                                step="0.01"
                                min="0"
                                {...form.getInputProps(
                                    "antropometria.circunferenciaPantorrilla"
                                )}
                            />


                            <TextInput
                                label="Circunferencia braquial (cm)"
                                withAsterisk
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    required: classes.required,
                                    input: classes.input,
                                }}
                                type="number"
                                step="0.01"
                                min="0"
                                {...form.getInputProps(
                                    "antropometria.circunferenciaBraquial"
                                )}
                            />


                            <TextInput
                                label="Circunferencia de cintura (cm)"
                                withAsterisk
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    required: classes.required,
                                    input: classes.input,
                                }}
                                type="number"
                                step="0.01"
                                min="0"
                                {...form.getInputProps(
                                    "antropometria.circunferenciaCintura"
                                )}
                            />


                            <TextInput
                                label="Pérdida de peso (%)"
                                withAsterisk
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    required: classes.required,
                                    input: classes.input,
                                }}
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                {...form.getInputProps(
                                    "antropometria.perdidaPesoPorcentaje"
                                )}
                            />

                        </div>

                    </Paper>


                    {/* TAMIZAJES */}
                    <Paper className={classes.card}>

                        <Group
                            justify="space-between"
                            className={classes.sectionHeader}
                        >

                            <Title
                                order={4}
                                className={classes.sectionTitle}
                            >
                                Tamizajes nutricionales
                            </Title>


                        </Group>


                        {form.values.tamizajes.length === 0 && (

                            <Text className={classes.emptyText}>
                                No se han agregado tamizajes nutricionales.
                            </Text>

                        )}


                        {form.values.tamizajes.map(
                            (_, index) => (

                                <Paper
                                    key={index}
                                    withBorder
                                    p="md"
                                    mb="md"
                                >

                                    <Group
                                        justify="space-between"
                                        mb="md"
                                    >

                                        <Text fw={600}>
                                            Tamizaje {index + 1}
                                        </Text>


                                    </Group>


                                    <div className={classes.formGrid}>

                                        <Select
                                            label="Tipo de tamizaje"
                                            placeholder="Seleccione el tipo"
                                            withAsterisk
                                            classNames={{
                                                root: classes.fieldGroup,
                                                label: classes.fieldLabel,
                                                input: classes.textinput,
                                            }}
                                            data={[
                                                { value: "MNA", label: "MNA" },
                                                { value: "SARC_F", label: "SARC-F" },
                                                { value: "MUST", label: "MUST" },
                                                { value: "NRS", label: "NRS" },
                                            ]}
                                            {...form.getInputProps(
                                                `tamizajes.${index}.tipo`
                                            )}
                                        />


                                        <TextInput
                                            label="Puntaje"
                                            type="number"
                                            step="0.01"
                                            {...form.getInputProps(
                                                `tamizajes.${index}.puntaje`
                                            )}
                                            classNames={{
                                                root: classes.fieldGroup,
                                                label: classes.fieldLabel,
                                                input: classes.textinput,
                                            }}
                                        />


                                        <TextInput
                                            label="Resultado"
                                            {...form.getInputProps(
                                                `tamizajes.${index}.resultado`
                                            )}
                                            classNames={{
                                                root: classes.fieldGroup,
                                                label: classes.fieldLabel,
                                                input: classes.textinput,
                                            }}
                                        />


                                        <Textarea
                                            label="Observaciones"
                                            minRows={3}
                                            classNames={{
                                                root: classes.fieldGroup,
                                                label: classes.fieldLabel,
                                                input: classes.textarea,
                                            }}
                                            {...form.getInputProps(
                                                `tamizajes.${index}.observaciones`
                                            )}
                                        />

                                    </div>

                                </Paper>

                            )
                        )}

                    </Paper>


                    {/* EXÁMENES DE LABORATORIO */}
                    <Paper className={classes.card}>

                        <Group
                            justify="space-between"
                            className={classes.sectionHeader}
                        >

                            <Title
                                order={4}
                                className={classes.sectionTitle}
                            >
                                Exámenes de laboratorio
                            </Title>

                        </Group>


                        {form.values.examenesLaboratorio.length === 0 && (

                            <Text className={classes.emptyText}>
                                No se han agregado exámenes de laboratorio.
                            </Text>

                        )}


                        {form.values.examenesLaboratorio.map(
                            (_, index) => (

                                <Paper
                                    key={index}
                                    withBorder
                                    p="md"
                                    mb="md"
                                >

                                    <Group
                                        justify="space-between"
                                        mb="md"
                                    >

                                        <Text fw={600}>
                                            Examen {index + 1}
                                        </Text>

                                    </Group>


                                    <div className={classes.formGrid}>

                                        <TextInput
                                            label="Nombre"
                                            withAsterisk
                                            classNames={{
                                                root: classes.fieldGroup,
                                                label: classes.fieldLabel,
                                                input: classes.textinput,
                                            }}
                                            {...form.getInputProps(
                                                `examenesLaboratorio.${index}.nombre`
                                            )}
                                        />


                                        <TextInput
                                            label="Valor"
                                            classNames={{
                                                root: classes.fieldGroup,
                                                label: classes.fieldLabel,
                                                input: classes.textinput,
                                            }}
                                            {...form.getInputProps(
                                                `examenesLaboratorio.${index}.valor`
                                            )}
                                        />


                                        <TextInput
                                            label="Unidad"
                                            classNames={{
                                                root: classes.fieldGroup,
                                                label: classes.fieldLabel,
                                                input: classes.textinput,
                                            }}
                                            placeholder="Ej. mg/dL"
                                            {...form.getInputProps(
                                                `examenesLaboratorio.${index}.unidad`
                                            )}
                                        />


                                        <TextInput
                                            label="Fecha"
                                            type="date"
                                            classNames={{
                                                root: classes.fieldGroup,
                                                label: classes.fieldLabel,
                                                input: classes.textinput,
                                            }}
                                            {...form.getInputProps(
                                                `examenesLaboratorio.${index}.fecha`
                                            )}
                                        />


                                        <Textarea
                                            label="Observaciones"
                                            minRows={3}
                                            className={classes.fieldFull}
                                            classNames={{
                                                root: classes.fieldGroup,
                                                label: classes.fieldLabel,
                                                input: classes.textarea,
                                            }}
                                            {...form.getInputProps(
                                                `examenesLaboratorio.${index}.observaciones`
                                            )}
                                        />

                                    </div>

                                </Paper>

                            )
                        )}

                    </Paper>


                    {/* BOTONES */}
                    <Group
                        justify="flex-end"
                        className={classes.submitBar}
                    >

                        <Button
                            type="button"
                            variant="default"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>


                        <Button
                            type="submit"
                            loading={loading}
                        >
                            Actualizar consulta nutricional
                        </Button>

                    </Group>

                </form>
            </div>
        </>
    )

}