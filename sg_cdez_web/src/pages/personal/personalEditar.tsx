import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { PersonalForm } from "../../components/ui/forms/PersonalForm";
import type { DocumentoResponse } from "../../services/interfaces/personalResponse";
import { useEffect, useState } from "react";
import { actualizarPersonal, obtenerPersonalPorId } from "../../services/personalService";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { PersonalFields } from "../../components/ui/forms/formValues/PersonalComposition";
import { PersonalSubmitBar } from "../../components/ui/forms/formValues/PersonalSubmitBar";
import type { PersonalFormValues } from "../../components/ui/forms/formValues/PersonalFormValues";
import type { PersonalFormContacto } from "../../components/ui/forms/formValues/PersonalFormValues";
import { Center, Loader, Text } from "@mantine/core";
import type { PersonalActualizarRequest } from "../../services/interfaces/personalUpdateRequest";


const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialValues: PersonalFormValues = {
    rol: "",
    especialidad: "",
    tipoIdentificacion: "",
    identificacion: "",
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    direccion: "",
    carnet: "",
    usuario: "",
    contactos: [],
};

export function PersonalEditar() {
    const { personalId } = useParams();
    const navigate = useNavigate();

    const [loadingData, setLoadingData] = useState(true);
    const [loading, setLoading] = useState(false);

    const [contactosOriginalesIds, setContactosOriginalesIds] =
        useState<number[]>([]);

    const [documentosExistentes,setDocumentosExistentes,] = useState<DocumentoResponse[]>([]);

    const [
        documentosDesactivar,
        setDocumentosDesactivar,
    ] = useState<number[]>([]);

    const [documentosCrear, setDocumentosCrear] = useState<File[]>([]);

    const form = useForm<PersonalFormValues>({
        initialValues,

        validate: {
            primerNombre: value =>
                value.trim().length === 0
                    ? "El primer nombre es obligatorio."
                    : null,

            primerApellido: value =>
                value.trim().length === 0
                    ? "El primer apellido es obligatorio."
                    : null,

            tipoIdentificacion: value =>
                value.length === 0
                    ? "Debe seleccionar un tipo de identificación."
                    : null,

            identificacion: value =>
                value.trim().length === 0
                    ? "La identificación es obligatoria."
                    : null,

            rol: value =>
                value.length === 0
                    ? "Debe seleccionar un rol."
                    : null,

            especialidad: value =>
                value.length === 0
                    ? "Debe seleccionar una especialidad."
                    : null,

            contactos: {
                tipoValor: value =>
                    !value
                        ? "Debe seleccionar un tipo de contacto."
                        : null,

                valor: (value, values, path) => {
                    if (!value?.trim()) {
                        return "El contacto es obligatorio.";
                    }
                    const index = Number(path.split(".")[1]);
                    const contacto = values.contactos[index];

                    if (
                        contacto?.tipoValor === "CORREO" &&
                        !correoRegex.test(value.trim())
                    ) {
                        return "Ingrese un correo electrónico válido.";
                    }

                    return null;
                },
            },
        },
    });

    useEffect(() => {
        if (!personalId) {
            setLoadingData(false);
            return;
        }

        const cargarPersonal = async () => {
            try {
                setLoadingData(true);

                const personal = await obtenerPersonalPorId(personalId);

                const contactos: PersonalFormContacto[] = (
                    personal.contactos ?? []
                ).map(contacto => ({
                    contactoId: contacto.contactoId,
                    tipoValor: contacto.tipoValor,
                    valor: contacto.valor ?? "",
                }));

                form.setValues({
                    rol: String(personal.rol.id),
                    especialidad: personal.especialidad ?? "",
                    tipoIdentificacion:
                        personal.tipoIdentificacion ?? "",
                    identificacion: personal.identificacion ?? "",
                    primerNombre: personal.primerNombre ?? "",
                    segundoNombre: personal.segundoNombre ?? "",
                    primerApellido: personal.primerApellido ?? "",
                    segundoApellido: personal.segundoApellido ?? "",
                    direccion: personal.direccion ?? "",
                    carnet: personal.carnet ?? "",
                    usuario: personal.usuario ?? "",
                    contactos,
                });

                form.resetDirty();

                setContactosOriginalesIds(
                    contactos
                        .map(contacto => contacto.contactoId)
                        .filter(
                            (id): id is number => id !== undefined
                        )
                );

                setDocumentosExistentes(
                    personal.documentos ?? []
                );

                setDocumentosCrear([]);
                setDocumentosDesactivar([]);
            } catch (error) {
                if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 404
                ) {
                    notifications.show({
                        title: "Error al cargar datos",
                        message:
                            error.response.data?.message ??
                            "El miembro del personal no existe.",
                        color: "orange",
                    });

                    return;
                }

                notifications.show({
                    title: "Error al mostrar datos del personal",
                    message:
                        "No fue posible recuperar los datos del miembro del personal.",
                    color: "red",
                });
            } finally {
                setLoadingData(false);
            }
        };

        void cargarPersonal();
    }, [personalId]);

    const eliminarDocumentoExistente = (
        documentoId: number
    ) => {
        setDocumentosExistentes(documentos =>
            documentos.filter(
                documento =>
                    documento.documentoId !== documentoId
            )
        );

        setDocumentosDesactivar(documentos =>
            documentos.includes(documentoId)
                ? documentos
                : [...documentos, documentoId]
        );
    };

    const handleSubmit = async (
        values: PersonalFormValues
    ) => {
        if (!personalId) {
            return;
        }

        setLoading(true);

        try {
            const contactosActualizar = values.contactos
                .filter(
                    (
                        contacto
                    ): contacto is PersonalFormContacto & {
                        contactoId: number;
                    } => contacto.contactoId !== undefined
                )
                .map(contacto => ({
                    contactoId: contacto.contactoId,
                    tipoValor: contacto.tipoValor,
                    valor: contacto.valor.trim(),
                }));

            const contactosCrear = values.contactos
                .filter(
                    contacto =>
                        contacto.contactoId === undefined
                )
                .map(contacto => ({
                    tipoValor: contacto.tipoValor,
                    valor: contacto.valor.trim(),
                }));

            const contactosActualesIds = new Set(
                contactosActualizar.map(
                    contacto => contacto.contactoId
                )
            );

            const contactosDesactivar =
                contactosOriginalesIds.filter(
                    contactoId =>
                        !contactosActualesIds.has(contactoId)
                );

            const request: PersonalActualizarRequest = {
                rol: Number(values.rol),
                especialidad: values.especialidad,
                tipoIdentificacion:
                    values.tipoIdentificacion,
                identificacion: values.identificacion.trim(),
                primerNombre: values.primerNombre.trim(),
                segundoNombre: values.segundoNombre.trim(),
                primerApellido: values.primerApellido.trim(),
                segundoApellido:
                    values.segundoApellido.trim(),
                direccion: values.direccion.trim(),
                carnet: values.carnet.trim(),
                usuario: values.usuario.trim(),

                contactosActualizar,
                contactosDesactivar,
                contactosCrear,

                documentosDesactivar,
            };

            const formDataMultipart = new FormData();

            formDataMultipart.append(
                "personal",
                new Blob([JSON.stringify(request)], {
                    type: "application/json",
                })
            );

            documentosCrear.forEach(documento => {
                formDataMultipart.append(
                    "documentosCrear",
                    documento
                );
            });

            await actualizarPersonal(
                personalId,
                formDataMultipart
            );

            notifications.show({
                title: "Personal actualizado",
                message:
                    "El miembro del personal se actualizó correctamente.",
                color: "green",
            });

            navigate("/personal");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    notifications.show({
                        title: "Falta de permisos",
                        message:
                            error.response.data?.message ??
                            "No tiene permisos para realizar esta acción.",
                        color: "orange",
                    });

                    return;
                }

                if (error.response?.status === 404) {
                    notifications.show({
                        title: "Error al actualizar",
                        message:
                            error.response.data?.message ??
                            "El miembro del personal no existe.",
                        color: "orange",
                    });

                    return;
                }
            }

            notifications.show({
                title: "Error al actualizar",
                message:
                    "No se pudo actualizar el miembro del personal.",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <Center mih={300}>
                <Loader />
            </Center>
        );
    }

    if (!personalId) {
        return (
            <Center mih={300}>
                <Text c="red">
                    No se proporcionó el identificador del personal.
                </Text>
            </Center>
        );
    }

    return (
        <PersonalForm
            title="Editar personal"
            subtitle="Edición de personal y sus componentes."
            onSubmit={form.onSubmit(handleSubmit)}
        >
            <PersonalFields
                form={form}
                documentosExistentes={documentosExistentes}
                documentosNuevos={documentosCrear}
                onDocumentosNuevosChange={setDocumentosCrear}
                onEliminarDocumentoExistente={
                    eliminarDocumentoExistente
                }
                disabled={loading}
            />

            <PersonalSubmitBar
                loading={loading}
                submitLabel="Guardar cambios"
                onCancel={() => navigate(-1)}
            />
        </PersonalForm>
    );
}