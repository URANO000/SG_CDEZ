import { useState } from "react";
import {
    ActionIcon,
    Button,
    Group,
    Modal,
    Paper,
    SimpleGrid,
    Text,
    Textarea,
    TextInput,
    Title,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { useNavigate } from "react-router";
import { BsArrowLeft } from "react-icons/bs";
import { notifications } from "@mantine/notifications";
import axios from "axios";

import classes from '../styleModules/ConsultaRegistrarForm.module.css';

import { registrarConsulta } from "../../../services/consultasService";
import type { ConsultaCreateRequest } from "../../../services/interfaces/consultasCreateInterface";
import type { AdultoMayorResponse } from "../../../services/interfaces/adultoMayorInterface";

import { AdultoSelector } from "../../common/AdultoSelector";

interface ConsultaFormValues {
    tipoConsulta: string;
    motivo: string;
    descripcion: string;
    diagnostico: string;
    resultadosEvaluaciones: string;
    recomendaciones: string;
    notas: string;
}

export function ConsultaRegistrarForm() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [adultoSeleccionado, setAdultoSeleccionado] =
        useState<AdultoMayorResponse | null>(null);

    const [selectorAbierto, setSelectorAbierto] =
        useState(false);


    const calcularEdad = (
        fechaNacimiento: string | null
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


    const seleccionarAdulto = (
        adulto: AdultoMayorResponse
    ) => {

        setAdultoSeleccionado(adulto);
        setSelectorAbierto(false);
    };

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

        validate: {
            tipoConsulta: (value) => {
                const valor = value.trim();

                if (!valor) {
                    return "El tipo de consulta es obligatorio.";
                }

                if (valor.length < 3) {
                    return "El tipo de consulta debe contener al menos 3 caracteres.";
                }

                if (valor.length > 100) {
                    return "El tipo de consulta no puede superar los 100 caracteres.";
                }

                return null;
            },

            motivo: (value) => {
                const valor = value.trim();

                if (!valor) {
                    return "El motivo de la consulta es obligatorio.";
                }

                if (valor.length < 5) {
                    return "El motivo debe contener al menos 5 caracteres.";
                }

                if (valor.length > 1000) {
                    return "El motivo no puede superar los 1000 caracteres.";
                }

                return null;
            },

            descripcion: (value) => {
                if (
                    value.trim() &&
                    value.trim().length < 5
                ) {
                    return "La descripción debe contener al menos 5 caracteres.";
                }

                return null;
            },

            diagnostico: (value) => {
                if (
                    value.trim() &&
                    value.trim().length < 3
                ) {
                    return "El diagnóstico debe contener al menos 3 caracteres.";
                }

                return null;
            },

            resultadosEvaluaciones: (value) => {
                if (
                    value.trim() &&
                    value.trim().length < 3
                ) {
                    return "Los resultados deben contener al menos 3 caracteres.";
                }

                return null;
            },

            recomendaciones: (value) => {
                if (
                    value.trim() &&
                    value.trim().length < 3
                ) {
                    return "Las recomendaciones deben contener al menos 3 caracteres.";
                }

                return null;
            },

            notas: (value) => {
                if (
                    value.trim() &&
                    value.trim().length > 1500
                ) {
                    return "Las notas no pueden superar los 1500 caracteres.";
                }

                return null;
            },
        },
    });

    const nullable = (value: string): string | null => {
        const limpio = value.trim();

        return limpio.length > 0
            ? limpio
            : null;
    };


    const handleSubmit = async (
        values: ConsultaFormValues
    ) => {

        if (!adultoSeleccionado) {
            notifications.show({
                title: "Adulto mayor requerido",
                message:
                    "Debe seleccionar un adulto mayor para registrar la consulta.",
                color: "orange",
            });

            return;
        }

        setLoading(true);

        try {

            const consulta: ConsultaCreateRequest = {
                adultoId:
                    adultoSeleccionado.adultoId,

                tipoConsulta:
                    values.tipoConsulta.trim(),

                motivo:
                    values.motivo.trim(),

                descripcion:
                    nullable(values.descripcion),

                diagnostico:
                    nullable(values.diagnostico),

                resultadosEvaluaciones:
                    nullable(values.resultadosEvaluaciones),

                recomendaciones:
                    nullable(values.recomendaciones),

                notas:
                    nullable(values.notas),
            };


            await registrarConsulta(consulta);


            notifications.show({
                title: "Consulta registrada",
                message:
                    "La consulta se registró correctamente.",
                color: "green",
            });


            navigate("/consultas");

        } catch (error) {

            if (
                axios.isAxiosError(error) &&
                error.response?.status === 409
            ) {

                notifications.show({
                    title: "Consulta no registrada",
                    message:
                        error.response.data?.message ??
                        "Ya existe un registro que entra en conflicto.",
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
                        "No tiene permisos para registrar la consulta.",
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
                        "Revise la información ingresada.",
                    color: "orange",
                });

                return;
            }


            notifications.show({
                title: "Error al registrar",
                message:
                    "No se pudo registrar la consulta.",
                color: "red",
            });

        } finally {

            setLoading(false);
        }
    };


    const edad = adultoSeleccionado
        ? calcularEdad(adultoSeleccionado.fechaNacimiento)
        : null;


    return (

        <>

            <div className={classes.container}>

                <div className={classes.topBar}>
                    <Group justify="space-between" className={classes.topBar}>
                        <ActionIcon
                            variant="subtle"
                            onClick={() => navigate(-1)}
                            aria-label="Volver">
                            <BsArrowLeft size={18} />
                        </ActionIcon>
                    </Group>
                    <Paper className={classes.headerCard}>

                        <Title
                            order={2}
                            className={classes.pageTitle}
                        >
                            Registrar consulta general
                        </Title>

                        <Text className={classes.subtitle}>
                            Registre la información clínica y la valoración
                            general del adulto mayor.
                        </Text>

                    </Paper>

                </div>


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


                        <div className={classes.adultoSelector}>

                            {!adultoSeleccionado ? (

                                <div className={classes.noAdulto}>

                                    <Text className={classes.emptyText}>
                                        No se ha seleccionado un adulto mayor.
                                    </Text>

                                    <Button
                                        type="button"
                                        onClick={() =>
                                            setSelectorAbierto(true)
                                        }
                                    >
                                        Buscar adulto mayor
                                    </Button>

                                </div>

                            ) : (

                                <>

                                    <Group
                                        justify="space-between"
                                        align="flex-end">

                                        <TextInput
                                            label="Nombre completo"
                                            value={
                                                adultoSeleccionado.nombreCompleto
                                            }
                                            readOnly
                                            className={classes.readonlyField} />

                                        <Button
                                            type="button"
                                            variant="light"
                                            onClick={() =>
                                                setSelectorAbierto(true)
                                            }>
                                            Cambiar
                                        </Button>

                                    </Group>


                                    <SimpleGrid
                                        cols={{
                                            base: 1,
                                            sm: 2,
                                            md: 3,
                                        }}
                                        mt="md">

                                        <TextInput
                                            label="Identificación"
                                            value={
                                                adultoSeleccionado.identificacion
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
                                                adultoSeleccionado.tipoIdentificacion
                                            }
                                            readOnly
                                        />

                                    </SimpleGrid>

                                </>

                            )}

                        </div>

                    </Paper>


                    {/* INFORMACIÓN DE LA CONSULTA */}
                    <Paper className={classes.card}>
                        <div className={classes.sectionHeader}>

                            <Title
                                order={4}
                                className={classes.sectionTitle}>
                                Información de la consulta
                            </Title>

                            <Text
                                size="sm"
                                className={classes.sectionDescription}>
                                Complete la información clínica correspondiente
                                a esta consulta.
                            </Text>

                        </div>



                        <div className={classes.formGrid}>

                            <TextInput
                                label="Tipo de consulta"
                                description="Indique el tipo o categoría de la consulta."
                                placeholder="Ej. Consulta de seguimiento"
                                withAsterisk
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    required: classes.required,
                                    input: classes.input,
                                }}
                                {...form.getInputProps("tipoConsulta")}
                            />


                            <Textarea
                                label="Motivo de consulta"
                                description="Describa la razón principal por la que se realiza la consulta."
                                placeholder="Ingrese el motivo principal de la consulta..."
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
                                {...form.getInputProps("motivo")}
                            />


                            <Textarea
                                label="Descripción"
                                description="Información adicional relevante sobre la situación actual."
                                placeholder="Ingrese una descripción general..."
                                minRows={4}
                                autosize
                                maxRows={8}
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    input: classes.textarea,
                                }}
                                {...form.getInputProps("descripcion")}
                            />


                            <Textarea
                                label="Diagnóstico"
                                description="Registre el diagnóstico o valoración obtenida."
                                placeholder="Ingrese el diagnóstico..."
                                minRows={4}
                                autosize
                                maxRows={8}
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    input: classes.textarea,
                                }}
                                {...form.getInputProps("diagnostico")}
                            />


                            <Textarea
                                label="Resultados de evaluaciones"
                                description="Documente los principales resultados encontrados durante la evaluación."
                                placeholder="Ingrese los resultados de las evaluaciones..."
                                minRows={4}
                                autosize
                                maxRows={8}
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    input: classes.textarea,
                                }}
                                {...form.getInputProps("resultadosEvaluaciones")}
                            />


                            <Textarea
                                label="Recomendaciones"
                                description="Indique las recomendaciones brindadas al adulto mayor."
                                placeholder="Ingrese las recomendaciones..."
                                minRows={4}
                                autosize
                                maxRows={8}
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    input: classes.textarea,
                                }}
                                {...form.getInputProps("recomendaciones")}
                            />


                            <Textarea
                                label="Notas adicionales"
                                description="Agregue cualquier observación que considere importante."
                                placeholder="Ingrese notas adicionales..."
                                minRows={3}
                                autosize
                                maxRows={7}
                                classNames={{
                                    root: classes.fieldGroup,
                                    label: classes.fieldLabel,
                                    input: classes.textarea,
                                }}
                                {...form.getInputProps("notas")}
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
                        disabled={!adultoSeleccionado}
                    >
                        Registrar consulta
                    </Button>

                </Group>


                </form>


            </div >


            {/* SELECTOR DE ADULTO */}

            < Modal
                opened={selectorAbierto}
                onClose={() => setSelectorAbierto(false)
                }
                title="Seleccionar adulto mayor"
                size="lg"
                centered
            >

                <AdultoSelector
                    onSelect={seleccionarAdulto}
                />

            </Modal >

        </>
    );
}