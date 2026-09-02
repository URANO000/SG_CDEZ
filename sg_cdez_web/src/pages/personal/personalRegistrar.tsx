import {useState } from "react";
import { useNavigate } from "react-router";
import { PersonalForm } from "../../components/ui/forms/PersonalForm";
import type { PersonalCreateRequest } from "../../services/interfaces/personalCreateRequest";
import { registrarPersonal } from "../../services/personalService";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useForm } from "@mantine/form";
import { PersonalFields } from "../../components/ui/forms/formValues/PersonalComposition";
import { PersonalSubmitBar } from "../../components/ui/forms/formValues/PersonalSubmitBar";
import type { PersonalFormValues } from "../../components/ui/forms/formValues/PersonalFormValues";


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

export function PersonalRegistrar() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [documentos, setDocumentos] = useState<File[]>([]);

    const form = useForm<PersonalFormValues>({
        initialValues,
        validate: {
            primerNombre: (value) =>
                value.trim().length === 0
                    ? "El primer nombre es obligatorio."
                    : null,

            primerApellido: (value) =>
                value.trim().length === 0
                    ? "El primer apellido es obligatorio."
                    : null,

            tipoIdentificacion: (value) =>
                value.length === 0
                    ? "Debe seleccionar un tipo de identificación."
                    : null,

            identificacion: (value) =>
                value.trim().length === 0
                    ? "La identificación es obligatoria."
                    : null,

            rol: (value) =>
                value.length === 0
                    ? "Debe seleccionar un rol."
                    : null,

            especialidad: (value) =>
                value.length === 0
                    ? "Debe seleccionar una especialidad."
                    : null,

            contactos: {
                tipoValor: (value) =>
                    value.length === 0
                        ? "Debe seleccionar un tipo de contacto."
                        : null,

                valor: (value, values, path) => {
                    if (value.trim().length === 0) {
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
                }
            }
        }
    });

    const handleSubmit = async (
       values: PersonalFormValues
    ) => {
        setLoading(true);

        try {
            const formData = new FormData();

            const personal: PersonalCreateRequest = {
                rol: Number(values.rol),
                especialidad: values.especialidad,
                tipoIdentificacion: values.tipoIdentificacion,
                identificacion: values.identificacion.trim(),
                primerNombre: values.primerNombre.trim(),
                segundoNombre: values.segundoNombre.trim(),
                primerApellido: values.primerApellido.trim(),
                segundoApellido: values.segundoApellido.trim(),
                direccion: values.direccion.trim(),
                carnet: values.carnet.trim(),
                usuario: values.usuario.trim(),
                contactos: values.contactos
            };

            formData.append(
                "personal",
                new Blob(
                    [JSON.stringify(personal)],
                    {
                        type: "application/json"
                    }
                )
            );

            documentos.forEach(documento => {
                formData.append("documentos", documento);
            });

            await registrarPersonal(formData);

            notifications.show({
                title: "Personal registrado",
                message: "El miembro del personal se registró correctamente.",
                color: "green",
            });

            navigate("/personal");

        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 409
            ) {
                notifications.show({
                    title: "Usuario registrado",
                    message: error.response.data?.message,
                    color: "orange"
                });

                return;
            }

            if (
                axios.isAxiosError(error) &&
                error.response?.status === 401
            ) {
                notifications.show({
                    title: "Falta de permisos",
                    message: error.response.data?.message,
                    color: "orange"
                });

                return;
            }

            notifications.show({
                title: "Error al registrar",
                message: "No se pudo registrar el miembro del personal.",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PersonalForm
            title="Registrar Personal"
            subtitle="Registrar nuevo miembro del personal."
            onSubmit={form.onSubmit(handleSubmit)}>

            <PersonalFields
                form={form}
                documentosNuevos={documentos}
                onDocumentosNuevosChange={setDocumentos}
                disabled={loading}
            />

            <PersonalSubmitBar
                loading={loading}
                submitLabel="Registrar personal"
                onCancel={() => navigate(-1)}
            />
        </PersonalForm>
    );
}