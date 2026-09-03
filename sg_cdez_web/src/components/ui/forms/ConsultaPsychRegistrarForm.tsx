import { useState } from "react";

import {
    ActionIcon,
    Button,
    Group,
    Modal,
    Paper,
    Text,
    SimpleGrid,
    TextInput,
    Textarea,
    Title,
    Select,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router";
import { BsArrowLeft, BsPlus, BsTrash } from "react-icons/bs";
import axios from "axios";

import classes from "../styleModules/ConsultaRegistrarForm.module.css";

import {
    registrarConsultaPsych,
} from "../../../services/consultasService";

import {
    TIPOS_TAMIZAJE,
} from "../../../services/interfaces/consultasDetailsResponse";

import type {
    TipoTamizajePsych,
} from "../../../services/interfaces/consultasDetailsResponse";

import type {
    AdultoMayorResponse,
} from "../../../services/interfaces/adultoMayorInterface";

import type {
    PersonalResponse,
} from "../../../services/interfaces/personalResponse";

import type {
    ConsultaCreateRequest,
    ConsultaPsychCreateRequest,
    ReferenciaCreateRequest,
    TamizajePsychCreateRequest,
} from "../../../services/interfaces/consultasCreateInterface";

import { AdultoSelector } from "../../common/AdultoSelector";
import { PersonalSelector } from "../../common/PersonalSelector";


interface TamizajePsychFormValues
    extends Omit<
        TamizajePsychCreateRequest,
        "tipo" | "resultado" | "observaciones"
    > {
    tipo: TipoTamizajePsych | null;
    resultado: string;
    observaciones: string;
}

interface ReferenciaFormValues
    extends Omit<ReferenciaCreateRequest, "mensaje"> {
    mensaje: string;
}

interface ConsultaGeneralFormValues
    extends Omit<
        ConsultaCreateRequest,
        | "adultoId"
        | "descripcion"
        | "diagnostico"
        | "resultadosEvaluaciones"
        | "recomendaciones"
        | "notas"
        | "referencia"
    > {
    descripcion: string;
    diagnostico: string;
    resultadosEvaluaciones: string;
    recomendaciones: string;
    notas: string;
    referencia: ReferenciaFormValues;
}

interface ConsultaPsychFormValues
    extends Omit<
        ConsultaPsychCreateRequest,
        "consultaGeneral" | "tamizajes"
    > {
    consultaGeneral: ConsultaGeneralFormValues;
    tamizajes: TamizajePsychFormValues[];
}

export function ConsultaPsychRegistrarForm() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [adultoSeleccionado, setAdultoSeleccionado] =
        useState<AdultoMayorResponse | null>(null);

    const [personalSeleccionado, setPersonalSeleccionado] =
        useState<PersonalResponse | null>(null);

    const [selectorAbierto, setSelectorAbierto] =
        useState(false);


    const OPCIONES_TAMIZAJE_PSYCH =
        TIPOS_TAMIZAJE.PSICOLOGIA.map((tipo) => ({
            value: tipo,
            label: tipo.replaceAll("_", " "),
        }));


    const form = useForm<ConsultaPsychFormValues>({
        mode: "controlled",

        initialValues: {
            consultaGeneral: {
                tipoConsulta: "PSICOLOGIA",
                motivo: "",
                descripcion: "",
                diagnostico: "",
                resultadosEvaluaciones: "",
                recomendaciones: "",
                notas: "",
                referencia: {
                    receptorId: "",
                    mensaje: "",
                },
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


    const seleccionarAdulto = (
        adulto: AdultoMayorResponse,
    ) => {
        setAdultoSeleccionado(adulto);
        setSelectorAbierto(false);
    };


    const nullable = (
        value: string,
    ): string | null => {
        const limpio = value.trim();

        return limpio.length > 0
            ? limpio
            : null;
    };


    const handleSubmit = async (
        values: ConsultaPsychFormValues,
    ) => {
        if (!adultoSeleccionado) {
            notifications.show({
                title: "Adulto mayor requerido",
                message:
                    "Debe seleccionar un adulto mayor para registrar la consulta psicológica.",
                color: "orange",
            });

            return;
        }

        setLoading(true);

        try {
            const receptorId =
                values.consultaGeneral.referencia.receptorId.trim();

            const consulta: ConsultaPsychCreateRequest = {
                consultaGeneral: {
                    adultoId: adultoSeleccionado.adultoId,

                    tipoConsulta:
                        values.consultaGeneral.tipoConsulta.trim(),

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

                    referencia: receptorId
                        ? {
                            receptorId,
                            mensaje: nullable(
                                values.consultaGeneral
                                    .referencia.mensaje,
                            ),
                        }
                        : null,
                },

                tamizajes: values.tamizajes.map(
                    (
                        tamizaje,
                    ): TamizajePsychCreateRequest => {
                        if (tamizaje.tipo === null) {
                            throw new Error(
                                "Debe seleccionar el tipo de tamizaje.",
                            );
                        }

                        return {
                            tipo: tamizaje.tipo,
                            puntaje: null,
                            resultado: nullable(
                                tamizaje.resultado,
                            ),
                            observaciones: nullable(
                                tamizaje.observaciones,
                            ),
                        };
                    },
                ),
            };

            await registrarConsultaPsych(consulta);

            notifications.show({
                title: "Consulta psicológica registrada",
                message:
                    "La consulta psicológica se registró correctamente.",
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
                        "Revise los datos ingresados e intente nuevamente.",
                    color: "orange",
                });

                return;
            }

            notifications.show({
                title: "Error al registrar",
                message:
                    "No se pudo registrar la consulta psicológica.",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };


    const edad = adultoSeleccionado
        ? calcularEdad(
            adultoSeleccionado.fechaNacimiento,
        )
        : null;

    return <>
        <div className={classes.container}>
            {/* HEADER */}
            <div className={classes.topBar}>
                <Group justify="space-between">
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
                        Registrar consulta psicológica
                    </Title>

                    <Text className={classes.subtitle}>
                        Registre una nueva evaluación psicológica
                        del adulto mayor.
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
                                    No se ha seleccionado un adulto
                                    mayor.
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
                                            adultoSeleccionado
                                                .nombreCompleto
                                        }
                                        readOnly
                                        disabled
                                        classNames={{
                                            root: classes.readonlyField,
                                            label: classes.fieldLabel,
                                            input: classes.input,
                                        }}
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
                                            adultoSeleccionado
                                                .identificacion
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
                                            adultoSeleccionado
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
                            </>
                        )}
                    </div>
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
                            placeholder="Describa la condición del adulto mayor..."
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
                            label="Notas adicionales"
                            placeholder="Ingrese cualquier información adicional..."
                            minRows={4}
                            autosize
                            maxRows={8}
                            className={classes.fieldFull}
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
                                Agregue los instrumentos aplicados
                                durante la consulta.
                            </Text>
                        </div>

                        <Button
                            type="button"
                            variant="light"
                            leftSection={<BsPlus />}
                            onClick={() =>
                                form.insertListItem(
                                    "tamizajes",
                                    {
                                        tipo: null,
                                        puntaje: null,
                                        resultado: "",
                                        observaciones: "",
                                    },
                                )
                            }
                        >
                            Agregar tamizaje
                        </Button>
                    </Group>

                    {form.values.tamizajes.length === 0 && (
                        <Text className={classes.emptyText}>
                            No se han agregado tamizajes
                            psicológicos.
                        </Text>
                    )}

                    {form.values.tamizajes.map(
                        (_, index) => {
                            const tipoPath =
                                `tamizajes.${index}.tipo`;
                            const resultadoPath =
                                `tamizajes.${index}.resultado`;
                            const observacionesPath =
                                `tamizajes.${index}.observaciones`;

                            return (
                                <Paper
                                    key={form.key(
                                        `tamizajes.${index}`,
                                    )}
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

                                        <ActionIcon
                                            type="button"
                                            color="red"
                                            variant="subtle"
                                            aria-label={
                                                `Eliminar tamizaje ${index + 1
                                                }`
                                            }
                                            onClick={() =>
                                                form.removeListItem(
                                                    "tamizajes",
                                                    index,
                                                )
                                            }
                                        >
                                            <BsTrash />
                                        </ActionIcon>
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

                {/* REFERENCIA */}
                <Paper className={classes.card}>
                    <div>
                        <div className={classes.sectionHeader}>
                            <Title
                                order={4}
                                className={classes.sectionTitle}
                            >
                                Referencia de consulta
                            </Title>

                            <Text
                                size="sm"
                                className={
                                    classes.sectionDescription
                                }
                            >
                                Es completamente opcional.
                            </Text>
                        </div>

                        <PersonalSelector
                            selectedId={
                                form.values.consultaGeneral
                                    .referencia.receptorId
                            }
                            onSelect={(personal) => {
                                setPersonalSeleccionado(personal);

                                form.setFieldValue(
                                    "consultaGeneral.referencia.receptorId",
                                    personal.personalId,
                                );
                            }}
                        />

                        {personalSeleccionado && (
                            <div>
                                <Group
                                    justify="space-between"
                                    align="flex-start"
                                >
                                    <div>
                                        <Text size="sm" fw={600}>
                                            Profesional seleccionado
                                        </Text>

                                        <Text size="sm">
                                            {[
                                                personalSeleccionado
                                                    .primerNombre,
                                                personalSeleccionado
                                                    .segundoNombre,
                                                personalSeleccionado
                                                    .primerApellido,
                                                personalSeleccionado
                                                    .segundoApellido,
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                        </Text>

                                        <Text
                                            size="xs"
                                            c="dimmed"
                                        >
                                            {
                                                personalSeleccionado
                                                    .especialidad
                                            }
                                            {" · "}
                                            {
                                                personalSeleccionado
                                                    .usuario
                                            }
                                        </Text>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="subtle"
                                        color="red"
                                        size="xs"
                                        onClick={() => {
                                            setPersonalSeleccionado(
                                                null,
                                            );

                                            form.setFieldValue(
                                                "consultaGeneral.referencia.receptorId",
                                                "",
                                            );

                                            form.setFieldValue(
                                                "consultaGeneral.referencia.mensaje",
                                                "",
                                            );
                                        }}
                                    >
                                        Quitar
                                    </Button>
                                </Group>
                            </div>
                        )}

                        <Textarea
                            key={form.key(
                                "consultaGeneral.referencia.mensaje",
                            )}
                            label="Mensaje para el profesional"
                            description="Se enviará un correo con el mensaje indicado."
                            placeholder="Ingrese su mensaje..."
                            minRows={3}
                            autosize
                            maxRows={7}
                            disabled={!personalSeleccionado}
                            classNames={{
                                root: classes.fieldGroup,
                                label: classes.fieldLabel,
                                input: classes.textarea,
                            }}
                            {...form.getInputProps(
                                "consultaGeneral.referencia.mensaje",
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
                        Registrar consulta
                    </Button>
                </Group>
            </form>
        </div>

        {/* SELECTOR DE ADULTO MAYOR */}
        <Modal
            opened={selectorAbierto}
            onClose={() => setSelectorAbierto(false)}
            title="Seleccionar adulto mayor"
            size="xl"
            centered
        >
            <AdultoSelector
                onSelect={seleccionarAdulto}
            />
        </Modal>

    </>
}