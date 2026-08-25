import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { PersonalForm } from "../../components/ui/forms/PersonalForm";
import type { ContactoResponse } from "../../services/interfaces/personalResponse";
import type { ContactoCreateRequest } from "../../services/interfaces/personalCreateRequest";
import type { DocumentoResponse } from "../../services/interfaces/personalResponse";
import React, { useEffect, useState } from "react";
import { actualizarPersonal, obtenerPersonalPorId } from "../../services/personalService";
import { Paper, Title, Text, Group, Stack, Button, ActionIcon, Tooltip } from "@mantine/core";
import { BsPlus, BsTrash, BsPersonCheck, BsUpload, BsFileEarmarkText, BsX } from "react-icons/bs";
import classes from "../../components/ui/styleModules/PersonalForm.module.css";
import { useRef } from "react";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { TIPOIDENTIFICACION } from "../../services/interfaces/personalCreateRequest";
import { ESPECIALIDADES } from "../../services/interfaces/personalCreateRequest";
import { useForm } from "@mantine/form";

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
}

export function PersonalEditar() {
    const { personalId } = useParams();
    const navigate = useNavigate();

    const [loadingData, setLoadingData] = useState(true);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [contactosDesactivar, setContactosDesactivar] = useState<number[]>([]);

    const [documentosExistentes, setDocumentosExistentes] = useState<DocumentoResponse[]>([]);
    const [documentosDesactivar, setDocumentosDesactivar] = useState<number[]>([]);
    const [documentosCrear, setDocumentosCrear] = useState<File[]>([]);
    const usarComoUsuario = (correo: string) => {
        form.setFieldValue("usuario", correo);
    };

    const form = useForm({
        initialValues: {
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

            contactosExistentes: [] as ContactoResponse[],
            contactosCrear: [] as ContactoCreateRequest[],
        },

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

            contactosExistentes: {
                tipoValor: (value) =>
                    !value
                        ? "Debe seleccionar un tipo de contacto."
                        : null,

                valor: (value, values, path) => {
                    if (!value?.trim()) {
                        return "El contacto es obligatorio.";
                    }

                    const index = Number(path.split(".")[1]);
                    const contacto = values.contactosExistentes[index];

                    if (contacto?.tipoValor === "CORREO") {
                        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                        if (!correoRegex.test(value.trim())) {
                            return "Ingrese un correo electrónico válido.";
                        }
                    }

                    return null;
                }
            },

            contactosCrear: {
                tipoValor: (value) =>
                    !value
                        ? "Debe seleccionar un tipo de contacto."
                        : null,

                valor: (value, values, path) => {
                    if (!value?.trim()) {
                        return "El contacto es obligatorio.";
                    }

                    const index = Number(path.split(".")[1]);
                    const contacto = values.contactosCrear[index];

                    if (contacto?.tipoValor === "CORREO") {
                        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                        if (!correoRegex.test(value.trim())) {
                            return "Ingrese un correo electrónico válido.";
                        }
                    }

                    return null;
                }
            }
        }
    });

    useEffect(() => {
        if (!personalId) return;

        const cargarPersonal = async () => {
            try {
                setLoadingData(true);

                const personal = await obtenerPersonalPorId(personalId);

                form.setValues({
                    rol: String(personal.rol.id),
                    especialidad: personal.especialidad ?? "",
                    tipoIdentificacion: personal.tipoIdentificacion ?? "",
                    identificacion: personal.identificacion ?? "",
                    primerNombre: personal.primerNombre ?? "",
                    segundoNombre: personal.segundoNombre ?? "",
                    primerApellido: personal.primerApellido ?? "",
                    segundoApellido: personal.segundoApellido ?? "",
                    direccion: personal.direccion ?? "",
                    carnet: personal.carnet ?? "",
                    usuario: personal.usuario ?? "",
                    contactosExistentes: personal.contactos ?? [],
                    contactosCrear: []
                });

                form.resetDirty();

                setContactosDesactivar([]);

                setDocumentosExistentes(personal.documentos ?? []);
                setDocumentosCrear([]);
                setDocumentosDesactivar([]);

            } catch (error) {
                if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 404
                ) {
                    notifications.show({
                        title: "Error al cargar datos",
                        message: error.response.data?.message,
                        color: "orange"
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

        cargarPersonal();

    }, [personalId]);

    const eliminarContactoExistente = (index: number) => {
        const contacto = form.values.contactosExistentes[index];

        if (!contacto) return;

        setContactosDesactivar(prev =>
            prev.includes(contacto.contactoId)
                ? prev
                : [...prev, contacto.contactoId]
        );

        form.removeListItem("contactosExistentes", index);
    };

    const agregarContacto = () => {
        form.insertListItem("contactosCrear", {
            tipoValor: "",
            valor: ""
        });
    };

    const eliminarContactoNuevo = (index: number) => {
        form.removeListItem("contactosCrear", index);
    };

    const eliminarDocumentoExistente = (
        documentoId: number
    ) => {
        setDocumentosExistentes(prev =>
            prev.filter(
                documento =>
                    documento.documentoId !== documentoId
            )
        );

        setDocumentosDesactivar(prev =>
            prev.includes(documentoId)
                ? prev
                : [...prev, documentoId]
        );
    };

    const manejarDocumentos = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.currentTarget.files;

        if (!files || files.length === 0) return;

        setDocumentosCrear(prev => [
            ...prev,
            ...Array.from(files)
        ]);

        e.currentTarget.value = "";
    };

    const eliminarDocumentoNuevo = (
        index: number
    ) => {
        setDocumentosCrear(prev =>
            prev.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = async (
        values: typeof form.values
    ) => {
        if (!personalId) return;

        setLoading(true);

        try {
            const request = {
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

                contactosActualizar:
                    values.contactosExistentes.map(
                        contacto => ({
                            contactoId: contacto.contactoId,
                            valor: contacto.valor,
                            tipoValor: contacto.tipoValor
                        })
                    ),

                contactosDesactivar,

                contactosCrear: values.contactosCrear,

                documentosDesactivar
            };

            const formDataMultipart = new FormData();

            formDataMultipart.append(
                "personal",
                new Blob(
                    [JSON.stringify(request)],
                    {
                        type: "application/json"
                    }
                )
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

            if (
                axios.isAxiosError(error) &&
                error.response?.status === 404
            ) {
                notifications.show({
                    title: "Error al actualizar",
                    message: error.response.data?.message,
                    color: "orange"
                });

                return;
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

    return (
        <PersonalForm
            title="Editar Personal"
            subtitle="Edición de personal y sus componentes."
            onSubmit={form.onSubmit(handleSubmit)}>

            {/* INFORMACIÓN GENERAL */}
            <Paper className={classes.card}>
                <Group className={classes.sectionHeader}>
                    <Title order={4} className={classes.sectionTitle}>Información general</Title>
                </Group>

                <div className={classes.formGrid}>
                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>
                            Primer nombre
                            <span className={classes.required}>*</span>
                        </label>

                        <input
                            className={classes.input}
                            type="text"
                            {...form.getInputProps("primerNombre")}
                        />

                        {form.errors.primerNombre && (
                            <Text size="xs" c="red">
                                {form.errors.primerNombre}
                            </Text>
                        )}
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Segundo nombre</label>
                        <input
                            className={classes.input}
                            type="text"
                            {...form.getInputProps("segundoNombre")}
                        />
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Primer apellido<span className={classes.required}>*</span></label>
                        <input
                            className={classes.input}
                            type="text"
                            {...form.getInputProps("primerApellido")}
                        />

                        {form.errors.primerApellido && (
                            <Text size="xs" c="red">
                                {form.errors.primerApellido}
                            </Text>
                        )}
                    </div>

                    {/* Was missing in the original edit form — segundoApellido had no input. */}
                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Segundo apellido</label>
                        <input
                            className={classes.input}
                            type="text"
                            {...form.getInputProps("segundoApellido")}
                        />
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>
                            Tipo de identificación
                            <span className={classes.required}>*</span>
                        </label>

                        <select
                            className={classes.select}
                            {...form.getInputProps("tipoIdentificacion")}
                        >
                            <option value="" disabled>
                                Tipo de identificación
                            </option>

                            {TIPOIDENTIFICACION.map(({ value, label }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>

                        {form.errors.tipoIdentificacion && (
                            <Text size="xs" c="red">
                                {form.errors.tipoIdentificacion}
                            </Text>
                        )}
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>
                            Identificación
                            <span className={classes.required}>*</span>
                        </label>

                        <input
                            className={classes.input}
                            type="text"
                            {...form.getInputProps("identificacion")}
                        />

                        {form.errors.identificacion && (
                            <Text size="xs" c="red">
                                {form.errors.identificacion}
                            </Text>
                        )}
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Carné</label>
                        <input
                            className={classes.input}
                            type="text"
                            {...form.getInputProps("carnet")}
                        />
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Dirección</label>
                        <input
                            className={classes.input}
                            type="text"
                            {...form.getInputProps("direccion")}
                        />
                    </div>

                    <div className={`${classes.fieldGroup} ${classes.fieldFull}`}>
                        <label className={classes.fieldLabel}>Usuario</label>
                        <input
                            className={classes.input}
                            type="text"
                            {...form.getInputProps("usuario")}
                            placeholder="Puede completarse desde un contacto de correo abajo"
                        />
                    </div>
                </div>
            </Paper>

            {/* ROLES */}
            <Paper className={classes.card}>
                <Group className={classes.sectionHeader}>
                    <Title order={4} className={classes.sectionTitle}>Roles en el centro</Title>
                </Group>

                <div className={classes.formGrid}>
                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>
                            Rol
                            <span className={classes.required}>*</span>
                        </label>

                        <select
                            className={classes.select}
                            {...form.getInputProps("rol")}
                        >
                            <option value="" disabled>
                                Seleccionar rol
                            </option>
                            <option value="1">
                                Administrador
                            </option>
                            <option value="2">
                                Usuario Normal
                            </option>
                        </select>

                        {form.errors.rol && (
                            <Text size="xs" c="red">
                                {form.errors.rol}
                            </Text>
                        )}
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>
                            Especialidad
                            <span className={classes.required}>*</span>
                        </label>

                        <select
                            className={classes.select}
                            {...form.getInputProps("especialidad")}
                        >
                            <option value="" disabled>
                                Seleccionar especialidad
                            </option>

                            {ESPECIALIDADES.map(({ value, label }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>

                        {form.errors.especialidad && (
                            <Text size="xs" c="red">
                                {form.errors.especialidad}
                            </Text>
                        )}
                    </div>
                </div>
            </Paper>

            {/* CONTACTOS */}
            <Paper className={classes.card}>
                <Group justify="space-between" className={classes.sectionHeader}>
                    <Title order={4} className={classes.sectionTitle}>Contactos</Title>
                    <Button
                        type="button"
                        size="xs"
                        variant="light"
                        leftSection={<BsPlus size={16} />}
                        onClick={agregarContacto}>
                        Agregar contacto
                    </Button>
                </Group>

                <Stack>
                    {form.values.contactosExistentes.map(
                        (contacto, index) => (
                            <div key={contacto.contactoId}>
                                <div className={classes.contactRow}>
                                    <select
                                        className={classes.select}
                                        {...form.getInputProps(
                                            `contactosExistentes.${index}.tipoValor`
                                        )}
                                    >
                                        <option value="" disabled>
                                            Tipo
                                        </option>

                                        <option value="TELEFONO">
                                            Número Telefónico
                                        </option>

                                        <option value="CORREO">
                                            Correo Electrónico
                                        </option>
                                    </select>

                                    <input
                                        className={classes.input}
                                        type={contacto.tipoValor === "CORREO" ? "email" : "text"}
                                        placeholder={
                                            contacto.tipoValor === "CORREO"
                                                ? "correo@ejemplo.com"
                                                : "Número de teléfono"
                                        }
                                        {...form.getInputProps(
                                            `contactosExistentes.${index}.valor`
                                        )}
                                    />

                                    <Group
                                        gap={4}
                                        wrap="nowrap"
                                        className={classes.contactActions}
                                    >
                                        {contacto.tipoValor === "CORREO" &&
                                            contacto.valor && (
                                                <Tooltip label="Utilizar como usuario">
                                                    <ActionIcon
                                                        type="button"
                                                        variant="subtle"
                                                        className={classes.actionEmail}
                                                        aria-label="Usar como usuario"
                                                        onClick={() =>
                                                            usarComoUsuario(
                                                                contacto.valor
                                                            )
                                                        }
                                                    >
                                                        <BsPersonCheck size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}

                                        <ActionIcon
                                            type="button"
                                            variant="subtle"
                                            color="red"
                                            aria-label="Eliminar contacto"
                                            onClick={() =>
                                                eliminarContactoExistente(index)
                                            }
                                        >
                                            <BsTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                </div>

                                {(form.errors[
                                    `contactosExistentes.${index}.tipoValor`
                                ] ||
                                    form.errors[
                                    `contactosExistentes.${index}.valor`
                                    ]) && (
                                        <Text size="xs" c="red" mt={4}>
                                            {form.errors[`contactosExistentes.${index}.tipoValor`] && (
                                                <Text size="xs" c="red" mt={4}>
                                                    {form.errors[
                                                        `contactosExistentes.${index}.tipoValor`
                                                    ]}
                                                </Text>
                                            )}

                                            {form.errors[`contactosExistentes.${index}.valor`] && (
                                                <Text size="xs" c="red" mt={4}>
                                                    {form.errors[
                                                        `contactosExistentes.${index}.valor`
                                                    ]}
                                                </Text>
                                            )}
                                        </Text>
                                    )}
                            </div>
                        )
                    )}
                </Stack>
                <Stack>
                    {form.values.contactosCrear.map(
                        (contacto, index) => (
                            <div key={`nuevo-${index}`}>
                                <div className={classes.contactRow}>
                                    <select
                                        className={classes.select}
                                        {...form.getInputProps(
                                            `contactosCrear.${index}.tipoValor`
                                        )}
                                    >
                                        <option value="" disabled>
                                            Tipo
                                        </option>

                                        <option value="TELEFONO">
                                            Número Telefónico
                                        </option>

                                        <option value="CORREO">
                                            Correo Electrónico
                                        </option>
                                    </select>

                                    <input
                                        className={classes.input}
                                        type={contacto.tipoValor === "CORREO" ? "email" : "text"}
                                        placeholder={
                                            contacto.tipoValor === "CORREO"
                                                ? "correo@ejemplo.com"
                                                : "Número de teléfono"
                                        }
                                        {...form.getInputProps(
                                            `contactosCrear.${index}.valor`
                                        )}
                                    />

                                    <Group
                                        gap={4}
                                        wrap="nowrap"
                                        className={classes.contactActions}
                                    >
                                        {contacto.tipoValor === "CORREO" &&
                                            contacto.valor && (
                                                <Tooltip label="Utilizar como usuario">
                                                    <ActionIcon
                                                        type="button"
                                                        variant="subtle"
                                                        className={classes.actionEmail}
                                                        aria-label="Usar como usuario"
                                                        onClick={() =>
                                                            usarComoUsuario(
                                                                contacto.valor
                                                            )
                                                        }
                                                    >
                                                        <BsPersonCheck size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}

                                        <ActionIcon
                                            type="button"
                                            variant="subtle"
                                            color="red"
                                            aria-label="Eliminar contacto"
                                            onClick={() =>
                                                eliminarContactoNuevo(index)
                                            }
                                        >
                                            <BsTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                </div>

                                {(form.errors[
                                    `contactosCrear.${index}.tipoValor`
                                ] ||
                                    form.errors[
                                    `contactosCrear.${index}.valor`
                                    ]) && (
                                        <Text size="xs" c="red" mt={4}>
                                            {String(
                                                form.errors[
                                                `contactosCrear.${index}.tipoValor`
                                                ] ||
                                                form.errors[
                                                `contactosCrear.${index}.valor`
                                                ]
                                            )}
                                        </Text>
                                    )}
                            </div>

                        )
                    )}
                </Stack>

            </Paper>

            {/* DOCUMENTOS */}
            <Paper className={classes.card}>
                <Group className={classes.sectionHeader}>
                    <Title order={4} className={classes.sectionTitle}>Documentos adjuntos</Title>
                </Group>

                {documentosExistentes.length > 0 && (
                    <Stack gap="xs" mb="md">
                        {documentosExistentes.map(documento => (
                            <Group
                                key={documento.documentoId}
                                justify="space-between"
                                className={classes.listRow}>
                                <Group gap="xs">
                                    <BsFileEarmarkText size={16} className={classes.docIcon} />
                                    <Text className={classes.value}>{documento.nombreArchivo}</Text>
                                </Group>

                                <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    aria-label="Quitar documento"
                                    onClick={() =>
                                        documento.documentoId != null &&
                                        eliminarDocumentoExistente(documento.documentoId)
                                    }>
                                    <BsX size={18} />
                                </ActionIcon>
                            </Group>
                        ))}
                    </Stack>
                )}

                <Text className={classes.helperText}>
                    Se pueden elegir múltiples documentos. PNG, JPG, JPEG, PDF.
                </Text>

                <div
                    className={classes.dropzone}
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}>
                    <BsUpload
                        size={18}
                        className={classes.dropzoneIcon} />

                    <span>Hacé clic para seleccionar archivos</span>

                    <input
                        ref={fileInputRef}
                        className={classes.hiddenFileInput}
                        type="file"
                        multiple
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={manejarDocumentos}
                    />
                </div>

                {documentosCrear.length > 0 ? (
                    <Stack gap="xs">
                        {documentosCrear.map((documento, index) => (
                            <Group
                                key={`${documento.name}-${documento.lastModified}-${index}`}
                                justify="space-between"
                                className={classes.listRow}>
                                <Group gap="xs">
                                    <BsFileEarmarkText
                                        size={16}
                                        className={classes.docIcon} />

                                    <div>
                                        <Text className={classes.value}>
                                            {documento.name}
                                        </Text>

                                        <Text size="xs" className={classes.fileSize}>
                                            {formatBytes(documento.size)}
                                        </Text>
                                    </div>
                                </Group>

                                <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    aria-label="Quitar archivo"
                                    onClick={() => eliminarDocumentoNuevo(index)}
                                >
                                    <BsX size={18} />
                                </ActionIcon>
                            </Group>
                        ))}
                    </Stack>
                ) : (
                    <Text className={classes.emptyText}>
                        Sin documentos nuevos seleccionados.
                    </Text>
                )}
            </Paper>

            {/* SUBMIT */}
            <Group justify="flex-end" className={classes.submitBar}>
                <Button type="button" variant="default" onClick={() => navigate(-1)} disabled={loading}>
                    Cancelar
                </Button>
                <Button type="submit" loading={loading}>
                    Guardar cambios
                </Button>
            </Group>

        </PersonalForm >
    );
}