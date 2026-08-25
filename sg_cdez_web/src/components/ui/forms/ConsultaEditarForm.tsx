import { useEffect, useState } from "react";

import {
    ActionIcon,
    Button,
    Center,
    Group,
    Loader,
    Paper,
    SimpleGrid,
    TextInput,
    Textarea,
    Title,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { useNavigate, useParams } from "react-router";
import { BsArrowLeft } from "react-icons/bs";

import axios from "axios";

import classes from "../styleModules/ConsultaRegistrarForm.module.css";

import {
    actualizarConsulta,
    obtenerConsultaPorId,
} from "../../../services/consultasService";

import type {
    ConsultaUpdateRequest,
} from "../../../services/interfaces/consultasUpdateInterface";

import type {
    ConsultaDetailResponse,
} from "../../../services/interfaces/consultasDetailsResponse";


interface ConsultaFormValues {
    tipoConsulta: string;
    motivo: string;
    descripcion: string;
    diagnostico: string;
    resultadosEvaluaciones: string;
    recomendaciones: string;
    notas: string;
}


export function ConsultaEditarForm() {

    const navigate = useNavigate();

    const { consultaId } = useParams();

    const [loading, setLoading] =
        useState(false);

    const [loadingConsulta, setLoadingConsulta] =
        useState(true);

    const [adultoMayor, setAdultoMayor] =
        useState<ConsultaDetailResponse["adultoMayor"] | null>(null);


    const form = useForm<ConsultaFormValues>({
        mode: "controlled",

        initialValues: {
            tipoConsulta: "",
            motivo: "",
            descripcion: "",
            diagnostico: "",
            resultadosEvaluaciones: "",
            recomendaciones: "",
            notas: "",
        },

        validate: (values) => {
            const errors: Record<string, string> = {};

            if (!values.tipoConsulta.trim()) {
                errors.tipoConsulta =
                    "El tipo de consulta es obligatorio.";
            }

            if (!values.motivo.trim()) {
                errors.motivo =
                    "El motivo de la consulta es obligatorio.";
            } else if (values.motivo.trim().length < 5) {
                errors.motivo =
                    "El motivo debe contener al menos 5 caracteres.";
            }

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


                setAdultoMayor(data.adultoMayor);


                form.setValues({

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
                });


                form.resetDirty();


            } catch (error) {

                if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 404
                ) {

                    notifications.show({
                        title: "Consulta no encontrada",
                        message:
                            error.response.data?.message ??
                            "No se encontró la consulta solicitada.",
                        color: "orange",
                    });

                    navigate("/consultas");

                    return;
                }


                notifications.show({
                    title: "Error al cargar",
                    message:
                        "No se pudo cargar la información de la consulta.",
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

        const limpio =
            value.trim();

        return limpio.length > 0
            ? limpio
            : null;
    };

    const handleSubmit = async (
        values: ConsultaFormValues
    ) => {

        if (!consultaId) {
            return;
        }


        setLoading(true);


        try {

            const consulta: ConsultaUpdateRequest = {

                tipoConsulta:
                    values.tipoConsulta.trim(),

                motivo:
                    values.motivo.trim(),

                descripcion:
                    nullable(values.descripcion),

                diagnostico:
                    nullable(values.diagnostico),

                resultadosEvaluaciones:
                    nullable(
                        values.resultadosEvaluaciones
                    ),

                recomendaciones:
                    nullable(values.recomendaciones),

                notas:
                    nullable(values.notas),
            };


            await actualizarConsulta(
                consultaId,
                consulta
            );


            notifications.show({
                title: "Consulta actualizada",
                message:
                    "La consulta se actualizó correctamente.",
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
                (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                )
            ) {

                notifications.show({
                    title: "Falta de permisos",
                    message:
                        error.response.data?.message ??
                        "No tiene permisos para actualizar esta consulta.",
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
                    "No se pudo actualizar la consulta.",
                color: "red",
            });


        } finally {

            setLoading(false);

        }
    };


    const calcularEdad = (
        fechaNacimiento: string | null
    ): number | null => {

        if (!fechaNacimiento) {
            return null;
        }

        const [year, month, day] =
            fechaNacimiento
                .split("-")
                .map(Number);

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
        ? calcularEdad(
            adultoMayor.fechaNacimiento
        )
        : null;

    if (loadingConsulta) {

        return (
            <Center mih={300}>
                <Loader />
            </Center>
        );
    }


    return (

        <div className={classes.container}>

            {/* HEADER */}
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
                        Editar consulta
                    </Title>

                </Paper>

            </div>


            <form
                onSubmit={form.onSubmit(handleSubmit)}
            >

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


                    {adultoMayor && (

                        <div className={classes.adultoSelector}>

                            <TextInput
                                label="Nombre completo"
                                value={
                                    adultoMayor.nombreCompleto
                                }
                                readOnly
                                className={
                                    classes.readonlyField
                                }
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
                                />


                                <TextInput
                                    label="Edad"
                                    value={
                                        edad !== null
                                            ? `${edad} años`
                                            : "No registrada"
                                    }
                                    readOnly
                                />


                                <TextInput
                                    label="Tipo de identificación"
                                    value={
                                        adultoMayor.tipoIdentificacion
                                    }
                                    readOnly
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
                            {...form.getInputProps(
                                "tipoConsulta"
                            )}
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
                            {...form.getInputProps(
                                "motivo"
                            )}
                        />


                        <Textarea
                            label="Descripción"
                            minRows={4}
                            classNames={{
                                root: classes.fieldGroup,
                                label: classes.fieldLabel,
                                input: classes.textarea,
                            }}
                            {...form.getInputProps(
                                "descripcion"
                            )}
                        />


                        <Textarea
                            label="Diagnóstico"
                            minRows={4}
                            classNames={{
                                root: classes.fieldGroup,
                                label: classes.fieldLabel,
                                input: classes.textarea,
                            }}
                            {...form.getInputProps(
                                "diagnostico"
                            )}
                        />


                        <Textarea
                            label="Resultados de evaluaciones"
                            minRows={4}
                            classNames={{
                                root: classes.fieldGroup,
                                label: classes.fieldLabel,
                                input: classes.textarea,
                            }}
                            {...form.getInputProps(
                                "resultadosEvaluaciones"
                            )}
                        />


                        <Textarea
                            label="Recomendaciones"
                            minRows={4}
                            classNames={{
                                root: classes.fieldGroup,
                                label: classes.fieldLabel,
                                input: classes.textarea,
                            }}
                            {...form.getInputProps(
                                "recomendaciones"
                            )}
                        />


                        <Textarea
                            label="Notas"
                            minRows={4}
                            classNames={{
                                root: classes.fieldGroup,
                                label: classes.fieldLabel,
                                input: classes.textarea,
                            }}
                            {...form.getInputProps(
                                "notas"
                            )}
                        />

                    </div>

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
                        Guardar cambios
                    </Button>

                </Group>

            </form>

        </div>
    );
}