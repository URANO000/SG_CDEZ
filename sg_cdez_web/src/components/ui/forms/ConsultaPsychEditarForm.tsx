import { useEffect, useState } from "react";

import {
    ActionIcon,
    Button,
    Group,
    Paper,
    Select,
    SimpleGrid,
    Text,
    TextInput,
    Textarea,
    Title,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import {
    useNavigate,
    useParams,
} from "react-router";

import { BsArrowLeft } from "react-icons/bs";
import axios from "axios";

import classes from "../styleModules/ConsultaRegistrarForm.module.css";

import {
    actualizarConsultaPsych,
    obtenerConsultaPorId,
} from "../../../services/consultasService";

import {
    TIPOS_TAMIZAJE,
} from "../../../services/interfaces/consultasDetailsResponse";

import type {
    ConsultaDetailResponse,
} from "../../../services/interfaces/consultasDetailsResponse";

import type {
    ConsultaPsychActualizarRequest,
    ConsultaUpdateRequest,
    TamizajePsychUpdateRequest,
} from "../../../services/interfaces/consultasUpdateInterface";


interface ConsultaUpdateFormValues
    extends Omit<
        ConsultaUpdateRequest,
        | "descripcion"
        | "diagnostico"
        | "resultadosEvaluaciones"
        | "recomendaciones"
        | "notas"
    > {
    descripcion: string;
    diagnostico: string;
    resultadosEvaluaciones: string;
    recomendaciones: string;
    notas: string;
}

interface TamizajePsychUpdateFormValues
    extends Omit<
        TamizajePsychUpdateRequest,
        "resultado" | "observaciones"
    > {
    resultado: string;
    observaciones: string;
}

interface ConsultaPsychEditarFormValues
    extends Omit<
        ConsultaPsychActualizarRequest,
        "consulta" | "tamizajes"
    > {
    consultaGeneral: ConsultaUpdateFormValues;
    tamizajes: TamizajePsychUpdateFormValues[];
}

export function ConsultaPsychEditarForm() {
    const navigate = useNavigate();

    const { consultaId } = useParams<{
        consultaId: string;
    }>();

    const [loading, setLoading] = useState(false);

    const [loadingConsulta, setLoadingConsulta] =
        useState(true);

    const [consultaPsychId, setConsultaPsychId] =
        useState<string | null>(null);

    const [adultoMayor, setAdultoMayor] =
        useState<ConsultaDetailResponse["adultoMayor"] | null>(null);


    const OPCIONES_TAMIZAJE_PSYCH =
        TIPOS_TAMIZAJE.PSICOLOGIA.map((tipo) => ({
            value: tipo,
            label: tipo.replaceAll("_", " "),
        }));


    const form = useForm<ConsultaPsychEditarFormValues>({
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

            tamizajes: [],
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

            values.tamizajes.forEach((tamizaje, index) => {
                if (tamizaje.tipo === null) {
                    errors[`tamizajes.${index}.tipo`] =
                        "Debe seleccionar el tipo de tamizaje.";
                }
            });

            return errors;
        },
    });


    useEffect(() => {
        if (!consultaId) {
            notifications.show({
                title: "Consulta inválida",
                message:
                    "No se encontró el identificador de la consulta.",
                color: "red",
            });

            navigate("/consultas");
            return;
        }

        const cargarConsulta = async () => {
            try {
                setLoadingConsulta(true);

                const data =
                    await obtenerConsultaPorId(consultaId);

                if (!data.consultaPsych) {
                    notifications.show({
                        title: "Consulta inválida",
                        message:
                            "La consulta seleccionada no contiene información psicológica.",
                        color: "orange",
                    });

                    navigate("/consultas");
                    return;
                }

                const psych = data.consultaPsych;

                setConsultaPsychId(
                    psych.consultaPsychId,
                );

                form.setValues({
                    consultaGeneral: {
                        tipoConsulta:
                            data.tipoConsulta ?? "",

                        motivo:
                            data.motivo ?? "",

                        descripcion:
                            data.descripcion ?? "",

                        diagnostico:
                            data.diagnostico ?? "",

                        resultadosEvaluaciones:
                            data.resultadosEvaluaciones ?? "",

                        recomendaciones:
                            data.recomendaciones ?? "",

                        notas:
                            data.notas ?? "",
                    },

                    tamizajes:
                        psych.tamizajes?.map(
                            (tamizaje) => ({
                                tamizajeId:
                                    tamizaje.tamizajeId,

                                tipo:
                                    tamizaje.tipo,

                                puntaje: null,

                                resultado:
                                    tamizaje.resultado ?? "",

                                observaciones:
                                    tamizaje.observaciones ?? "",
                            }),
                        ) ?? [],
                });

                setAdultoMayor(data.adultoMayor);

                form.resetDirty();
            } catch (error) {
                notifications.show({
                    title: "Error al cargar",
                    message:
                        "No se pudo cargar la consulta psicológica.",
                    color: "red",
                });
            } finally {
                setLoadingConsulta(false);
            }
        };

        cargarConsulta();
    }, [consultaId]);


    const nullable = (
        value: string,
    ): string | null => {
        const limpio = value.trim();

        return limpio.length > 0
            ? limpio
            : null;
    };


    const calcularEdad = (
        fechaNacimiento: string | null,
    ): number | null => {
        if (!fechaNacimiento) {
            return null;
        }

        const [year, month, day] =
            fechaNacimiento.split("-").map(Number);

        const hoy = new Date();

        let edad = hoy.getFullYear() - year;

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


    const handleSubmit = async (
        values: ConsultaPsychEditarFormValues,
    ) => {
        if (!consultaPsychId) {
            notifications.show({
                title: "Consulta inválida",
                message:
                    "No se encontró el identificador de la consulta psicológica.",
                color: "red",
            });

            return;
        }

        setLoading(true);

        try {
            const request: ConsultaPsychActualizarRequest = {
                consulta: {
                    tipoConsulta:
                        values.consultaGeneral
                            .tipoConsulta.trim(),

                    motivo:
                        values.consultaGeneral.motivo.trim(),

                    descripcion: nullable(
                        values.consultaGeneral.descripcion,
                    ),

                    diagnostico: nullable(
                        values.consultaGeneral.diagnostico,
                    ),

                    resultadosEvaluaciones: nullable(
                        values.consultaGeneral
                            .resultadosEvaluaciones,
                    ),

                    recomendaciones: nullable(
                        values.consultaGeneral.recomendaciones,
                    ),

                    notas: nullable(
                        values.consultaGeneral.notas,
                    ),
                },

                tamizajes: values.tamizajes.map(
                    (
                        tamizaje,
                    ): TamizajePsychUpdateRequest => ({
                        tamizajeId:
                            tamizaje.tamizajeId,

                        tipo:
                            tamizaje.tipo,

                        puntaje: null,

                        resultado: nullable(
                            tamizaje.resultado,
                        ),

                        observaciones: nullable(
                            tamizaje.observaciones,
                        ),
                    }),
                ),
            };

            await actualizarConsultaPsych(
                consultaPsychId,
                request,
            );

            notifications.show({
                title: "Consulta psicológica actualizada",
                message:
                    "La consulta psicológica se actualizó correctamente.",
                color: "green",
            });

            navigate("/consultas");
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 404
            ) {
                notifications.show({
                    title: "Consulta no encontrada",
                    message:
                        error.response.data?.message ??
                        "No se encontró la consulta que desea actualizar.",
                    color: "orange",
                });

                return;
            }

            if (
                axios.isAxiosError(error) &&
                error.response?.status === 409
            ) {
                notifications.show({
                    title: "Consulta no actualizada",
                    message:
                        error.response.data?.message ??
                        "Existe un conflicto con la información ingresada.",
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
                    "No se pudo actualizar la consulta psicológica.",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };


    const edad = adultoMayor
        ? calcularEdad(adultoMayor.fechaNacimiento)
        : null;

    return (
        <>
            <div className={classes.container}>
                <div className={classes.topBar}>
                    <Group
                        justify="space-between"
                        className={classes.topBar}
                    >
                        <ActionIcon
                            type="button"
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
                            Editar consulta psicológica
                        </Title>

                        <Text className={classes.subtitle}>
                            Modifique la información de la evaluación
                            psicológica.
                        </Text>
                    </Paper>
                </div>

                {loadingConsulta ? (
                    <Paper className={classes.card}>
                        <Text ta="center">
                            Cargando consulta psicológica...
                        </Text>
                    </Paper>
                ) : (
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        {/* ADULTO MAYOR */}
                        <Paper className={classes.card}>
                            <Group className={classes.sectionHeader}>
                                <Title
                                    order={4}
                                    className={classes.sectionTitle}
                                >
                                    Adulto mayor
                                </Title>
                            </Group>

                            {adultoMayor ? (
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
                                            value={
                                                adultoMayor.identificacion
                                            }
                                            readOnly
                                            disabled
                                            classNames={{
                                                root: classes.fieldGroup,
                                                label: classes.fieldLabel,
                                                input: classes.input,
                                            }}
                                        />

                                        <TextInput
                                            label="Edad"
                                            value={
                                                edad !== null
                                                    ? `${edad} años`
                                                    : "No registrada"
                                            }
                                            readOnly
                                            disabled
                                            classNames={{
                                                root: classes.fieldGroup,
                                                label: classes.fieldLabel,
                                                input: classes.input,
                                            }}
                                        />

                                        <TextInput
                                            label="Tipo de identificación"
                                            value={
                                                adultoMayor
                                                    .tipoIdentificacion
                                            }
                                            readOnly
                                            disabled
                                            classNames={{
                                                root: classes.fieldGroup,
                                                label: classes.fieldLabel,
                                                input: classes.input,
                                            }}
                                        />
                                    </SimpleGrid>
                                </div>
                            ) : (
                                <Text className={classes.emptyText}>
                                    No se encontró la información del adulto
                                    mayor.
                                </Text>
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
                                    key={form.key(
                                        "consultaGeneral.tipoConsulta",
                                    )}
                                    label="Tipo de consulta"
                                    withAsterisk
                                    classNames={{
                                        root: classes.fieldGroup,
                                        label: classes.fieldLabel,
                                        required: classes.required,
                                        input: classes.input,
                                    }}
                                    {...form.getInputProps(
                                        "consultaGeneral.tipoConsulta",
                                    )}
                                />

                                <Textarea
                                    key={form.key(
                                        "consultaGeneral.motivo",
                                    )}
                                    label="Motivo de consulta"
                                    placeholder="Ingrese el motivo de la consulta..."
                                    withAsterisk
                                    minRows={4}
                                    autosize
                                    maxRows={8}
                                    classNames={{
                                        root: classes.fieldGroup,
                                        label: classes.fieldLabel,
                                        required: classes.required,
                                        input: classes.textarea,
                                    }}
                                    {...form.getInputProps(
                                        "consultaGeneral.motivo",
                                    )}
                                />

                                <Textarea
                                    key={form.key(
                                        "consultaGeneral.descripcion",
                                    )}
                                    label="Descripción"
                                    placeholder="Ingrese una descripción..."
                                    minRows={4}
                                    autosize
                                    maxRows={8}
                                    classNames={{
                                        root: classes.fieldGroup,
                                        label: classes.fieldLabel,
                                        input: classes.textarea,
                                    }}
                                    {...form.getInputProps(
                                        "consultaGeneral.descripcion",
                                    )}
                                />

                                <Textarea
                                    key={form.key(
                                        "consultaGeneral.diagnostico",
                                    )}
                                    label="Diagnóstico"
                                    placeholder="Ingrese el diagnóstico..."
                                    minRows={4}
                                    autosize
                                    maxRows={8}
                                    classNames={{
                                        root: classes.fieldGroup,
                                        label: classes.fieldLabel,
                                        input: classes.textarea,
                                    }}
                                    {...form.getInputProps(
                                        "consultaGeneral.diagnostico",
                                    )}
                                />

                                <Textarea
                                    key={form.key(
                                        "consultaGeneral.resultadosEvaluaciones",
                                    )}
                                    label="Resultados de evaluaciones"
                                    placeholder="Ingrese los resultados obtenidos..."
                                    minRows={4}
                                    autosize
                                    maxRows={8}
                                    classNames={{
                                        root: classes.fieldGroup,
                                        label: classes.fieldLabel,
                                        input: classes.textarea,
                                    }}
                                    {...form.getInputProps(
                                        "consultaGeneral.resultadosEvaluaciones",
                                    )}
                                />

                                <Textarea
                                    key={form.key(
                                        "consultaGeneral.recomendaciones",
                                    )}
                                    label="Recomendaciones"
                                    placeholder="Ingrese las recomendaciones..."
                                    minRows={4}
                                    autosize
                                    maxRows={8}
                                    classNames={{
                                        root: classes.fieldGroup,
                                        label: classes.fieldLabel,
                                        input: classes.textarea,
                                    }}
                                    {...form.getInputProps(
                                        "consultaGeneral.recomendaciones",
                                    )}
                                />

                                <Textarea
                                    key={form.key(
                                        "consultaGeneral.notas",
                                    )}
                                    label="Notas"
                                    placeholder="Ingrese notas adicionales..."
                                    minRows={4}
                                    autosize
                                    maxRows={8}
                                    classNames={{
                                        root: classes.fieldGroup,
                                        label: classes.fieldLabel,
                                        input: classes.textarea,
                                    }}
                                    {...form.getInputProps(
                                        "consultaGeneral.notas",
                                    )}
                                />
                            </div>
                        </Paper>

                        {/* TAMIZAJES PSICOLÓGICOS */}
                        <Paper className={classes.card}>
                            <Group
                                justify="space-between"
                                className={classes.sectionHeader}
                            >
                                <div>
                                    <Title
                                        order={4}
                                        className={classes.sectionTitle}
                                    >
                                        Tamizajes psicológicos
                                    </Title>

                                    <Text
                                        size="sm"
                                        className={
                                            classes.sectionDescription
                                        }
                                    >
                                        Modifique los resultados de los
                                        tamizajes aplicados.
                                    </Text>
                                </div>
                            </Group>

                            {form.values.tamizajes.length === 0 && (
                                <Text className={classes.emptyText}>
                                    No se han registrado tamizajes
                                    psicológicos.
                                </Text>
                            )}

                            {form.values.tamizajes.map(
                                (tamizaje, index) => {
                                    const tipoPath =
                                        `tamizajes.${index}.tipo`;

                                    const resultadoPath =
                                        `tamizajes.${index}.resultado`;

                                    const observacionesPath =
                                        `tamizajes.${index}.observaciones`;

                                    return (
                                        <Paper
                                            key={tamizaje.tamizajeId}
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

                                            <div
                                                className={
                                                    classes.formGrid
                                                }
                                            >
                                                <Select
                                                    key={form.key(
                                                        tipoPath,
                                                    )}
                                                    label="Tipo de tamizaje"
                                                    placeholder="Seleccione el tipo"
                                                    withAsterisk
                                                    searchable
                                                    clearable
                                                    data={
                                                        OPCIONES_TAMIZAJE_PSYCH
                                                    }
                                                    classNames={{
                                                        root: classes.fieldGroup,
                                                        label: classes.fieldLabel,
                                                        input: classes.input,
                                                    }}
                                                    {...form.getInputProps(
                                                        tipoPath,
                                                    )}
                                                />

                                                <TextInput
                                                    key={form.key(
                                                        resultadoPath,
                                                    )}
                                                    label="Resultado"
                                                    placeholder="Ingrese el resultado"
                                                    classNames={{
                                                        root: classes.fieldGroup,
                                                        label: classes.fieldLabel,
                                                        input: classes.input,
                                                    }}
                                                    {...form.getInputProps(
                                                        resultadoPath,
                                                    )}
                                                />

                                                <Textarea
                                                    key={form.key(
                                                        observacionesPath,
                                                    )}
                                                    label="Observaciones"
                                                    placeholder="Ingrese observaciones sobre el tamizaje..."
                                                    minRows={3}
                                                    autosize
                                                    maxRows={7}
                                                    className={
                                                        classes.fieldFull
                                                    }
                                                    classNames={{
                                                        root: classes.fieldGroup,
                                                        label: classes.fieldLabel,
                                                        input: classes.textarea,
                                                    }}
                                                    {...form.getInputProps(
                                                        observacionesPath,
                                                    )}
                                                />
                                            </div>
                                        </Paper>
                                    );
                                },
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
                                disabled={
                                    loading ||
                                    !consultaPsychId ||
                                    !adultoMayor
                                }
                            >
                                Guardar cambios
                            </Button>
                        </Group>
                    </form>
                )}
            </div>
        </>
    )
}