import { useState } from "react";
import {
    Button,
    Group,
    Modal,
    Paper,
    SimpleGrid,
    Text,
    TextInput,
    Title,
    ActionIcon
} from "@mantine/core";
import { useNavigate } from "react-router";
import { BsArrowLeft } from "react-icons/bs";
import { notifications } from "@mantine/notifications";
import axios from "axios";

import classes from '../styleModules/ConsultaRegistrarForm.module.css';

import { registrarConsulta } from "../../../services/consultasService";
import type { ConsultaCreateRequest } from "../../../services/interfaces/consultasCreateInterface";
import type { AdultoMayorResponse } from "../../../services/interfaces/adultoMayorInterface";

import { AdultoSelector } from "../../common/AdultoSelector";

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


    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (!adultoSeleccionado) {

            notifications.show({
                title: "Adulto mayor requerido",
                message: "Debe seleccionar un adulto mayor para la consulta.",
                color: "orange",
            });

            return;
        }


        setLoading(true);

        try {

            const form = e.currentTarget;

            const consulta: ConsultaCreateRequest = {

                adultoId:
                    adultoSeleccionado.adultoId,

                tipoConsulta:
                    (
                        form.elements.namedItem(
                            "tipoConsulta"
                        ) as HTMLInputElement
                    ).value,

                motivo:
                    (
                        form.elements.namedItem(
                            "motivo"
                        ) as HTMLTextAreaElement
                    ).value,

                descripcion:
                    (
                        form.elements.namedItem(
                            "descripcion"
                        ) as HTMLTextAreaElement
                    ).value || null,

                diagnostico:
                    (
                        form.elements.namedItem(
                            "diagnostico"
                        ) as HTMLTextAreaElement
                    ).value || null,

                resultadosEvaluaciones:
                    (
                        form.elements.namedItem(
                            "resultadosEvaluaciones"
                        ) as HTMLTextAreaElement
                    ).value || null,

                recomendaciones:
                    (
                        form.elements.namedItem(
                            "recomendaciones"
                        ) as HTMLTextAreaElement
                    ).value || null,

                notas:
                    (
                        form.elements.namedItem(
                            "notas"
                        ) as HTMLTextAreaElement
                    ).value || null,
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
                error.response?.status === 401
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
                            Registrar consulta
                        </Title>

                        <Text className={classes.subtitle}>
                            Registrar una nueva consulta clínica.
                        </Text>
                    </Paper>

                </div>


                <form onSubmit={handleSubmit}>


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
                                        align="flex-end"
                                    >

                                        <TextInput
                                            label="Nombre completo"
                                            value={
                                                adultoSeleccionado.nombreCompleto
                                            }
                                            readOnly
                                            className={classes.readonlyField}
                                        />

                                        <Button
                                            type="button"
                                            variant="light"
                                            onClick={() =>
                                                setSelectorAbierto(true)
                                            }
                                        >
                                            Cambiar
                                        </Button>

                                    </Group>


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

                        <Group className={classes.sectionHeader}>

                            <Title
                                order={4}
                                className={classes.sectionTitle}
                            >
                                Información de la consulta
                            </Title>

                        </Group>


                        <div className={classes.formGrid}>


                            <div
                                className={`${classes.fieldGroup} ${classes.fieldFull}`}
                            >

                                <label
                                    className={classes.fieldLabel}
                                >
                                    Tipo de consulta
                                    <span className={classes.required}>
                                        *
                                    </span>
                                </label>

                                <input
                                    className={classes.input}
                                    type="text"
                                    name="tipoConsulta"
                                    required
                                />

                            </div>


                            <div
                                className={`${classes.fieldGroup} ${classes.fieldFull}`}
                            >

                                <label
                                    className={classes.fieldLabel}
                                >
                                    Motivo de consulta
                                    <span className={classes.required}>
                                        *
                                    </span>
                                </label>

                                <textarea
                                    className={classes.textarea}
                                    name="motivo"
                                    rows={4}
                                    required
                                />

                            </div>


                            <div
                                className={`${classes.fieldGroup} ${classes.fieldFull}`}
                            >

                                <label
                                    className={classes.fieldLabel}
                                >
                                    Descripción
                                </label>

                                <textarea
                                    className={classes.textarea}
                                    name="descripcion"
                                    rows={5}
                                />

                            </div>


                            <div
                                className={`${classes.fieldGroup} ${classes.fieldFull}`}
                            >

                                <label
                                    className={classes.fieldLabel}
                                >
                                    Diagnóstico
                                </label>

                                <textarea
                                    className={classes.textarea}
                                    name="diagnostico"
                                    rows={5}
                                />

                            </div>


                            <div
                                className={`${classes.fieldGroup} ${classes.fieldFull}`}
                            >

                                <label
                                    className={classes.fieldLabel}
                                >
                                    Resultados de evaluaciones
                                </label>

                                <textarea
                                    className={classes.textarea}
                                    name="resultadosEvaluaciones"
                                    rows={5}
                                />

                            </div>


                            <div
                                className={`${classes.fieldGroup} ${classes.fieldFull}`}
                            >

                                <label
                                    className={classes.fieldLabel}
                                >
                                    Recomendaciones
                                </label>

                                <textarea
                                    className={classes.textarea}
                                    name="recomendaciones"
                                    rows={5}
                                />

                            </div>


                            <div
                                className={`${classes.fieldGroup} ${classes.fieldFull}`}
                            >

                                <label
                                    className={classes.fieldLabel}
                                >
                                    Notas
                                </label>

                                <textarea
                                    className={classes.textarea}
                                    name="notas"
                                    rows={4}
                                />

                            </div>

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

            </div>


            {/* SELECTOR DE ADULTO */}

            <Modal
                opened={selectorAbierto}
                onClose={() => setSelectorAbierto(false)}
                title="Seleccionar adulto mayor"
                size="lg"
                centered
            >

                <AdultoSelector
                    onSelect={seleccionarAdulto}
                />

            </Modal>

        </>
    );
}