import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Paper, Title, Text, Group, Stack, Button, ActionIcon, Tooltip } from "@mantine/core";
import { BsPlus, BsTrash, BsPersonCheck, BsUpload, BsFileEarmarkText, BsX } from "react-icons/bs";
import { PersonalForm } from "../../components/ui/forms/PersonalForm";
import classes from "../../components/ui/styleModules/PersonalForm.module.css";
import type { ContactoCreateRequest } from "../../services/interfaces/personalCreateRequest";
import type { PersonalCreateRequest } from "../../services/interfaces/personalCreateRequest";
import { registrarPersonal } from "../../services/personalService";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { TIPOIDENTIFICACION } from "../../services/interfaces/personalCreateRequest";
import { ESPECIALIDADES } from "../../services/interfaces/personalCreateRequest";
import { useForm } from "@mantine/form";

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
}

export function PersonalRegistrar() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [documentos, setDocumentos] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const usuarioInputRef = useRef<HTMLInputElement>(null);

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
            contactos: [
                {
                    tipoValor: "",
                    valor: ""
                }
            ] as ContactoCreateRequest[]
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

    const eliminarContacto = (index: number) => {
        form.removeListItem("contactos", index);
    };

    const agregarContacto = () => {
        form.insertListItem("contactos", {
            tipoValor: "",
            valor: ""
        });
    };

    const usarComoUsuario = (correo: string) => {
        form.setFieldValue("usuario", correo);
        usuarioInputRef.current?.focus();
    };

    const manejarDocumentos = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.currentTarget.files;

        if (!files || files.length === 0) return;

        setDocumentos(prev => [
            ...prev,
            ...Array.from(files)
        ]);

        e.currentTarget.value = "";
    };

    const eliminarDocumento = (index: number) => {
        setDocumentos(prev =>
            prev.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = async (
        values: typeof form.values
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

            {/* INFORMACIÓN GENERAL */}
            <Paper className={classes.card}>
                <Group className={classes.sectionHeader}>
                    <Title order={4} className={classes.sectionTitle}>Información general</Title>
                </Group>

                <div className={classes.formGrid}>
                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Primer nombre<span className={classes.required}>*</span></label>
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
                            Tipo de identificación<span className={classes.required}>*</span>
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
                        <label className={classes.fieldLabel}>Identificación<span className={classes.required}>*</span></label>
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
                            ref={usuarioInputRef}
                            className={classes.input}
                            type="text"
                            placeholder="Puede completarse desde un contacto de correo abajo"
                            {...form.getInputProps("usuario")}
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
                            <option value="1">Administrador</option>
                            <option value="2">Usuario Normal</option>
                            <option value="3">Ayudante Administrativo</option>
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

                {form.values.contactos.length === 0 ? (
                    <Text className={classes.emptyText}>
                        Sin contactos agregados.
                    </Text>
                ) : (
                    <Stack gap="sm">
                        {form.values.contactos.map((contacto, index) => {
                            const tipoError =
                                form.errors[`contactos.${index}.tipoValor`];

                            const valorError =
                                form.errors[`contactos.${index}.valor`];

                            return (
                                <div key={index}>
                                    <div className={classes.contactRow}>
                                        <select
                                            className={classes.select}
                                            {...form.getInputProps(
                                                `contactos.${index}.tipoValor`
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
                                            type="text"
                                            placeholder={
                                                contacto.tipoValor === "CORREO"
                                                    ? "correo@ejemplo.com"
                                                    : "Número de teléfono"
                                            }
                                            {...form.getInputProps(
                                                `contactos.${index}.valor`
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
                                                            title="Usar como usuario"
                                                            aria-label="Usar como usuario"
                                                            onClick={() =>
                                                                usarComoUsuario(contacto.valor)
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
                                                    eliminarContacto(index)
                                                }
                                            >
                                                <BsTrash size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </div>

                                    {(tipoError || valorError) && (
                                        <Text size="xs" c="red" mt={4}>
                                            {String(tipoError || valorError)}
                                        </Text>
                                    )}
                                </div>
                            );
                        })}
                    </Stack>
                )}
            </Paper>

            {/* DOCUMENTOS */}
            <Paper className={classes.card}>
                <Group className={classes.sectionHeader}>
                    <Title order={4} className={classes.sectionTitle}>Documentos adjuntos</Title>
                </Group>

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

                    <span>Haga clic para seleccionar archivos</span>

                    <input
                        ref={fileInputRef}
                        className={classes.hiddenFileInput}
                        type="file"
                        multiple
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={manejarDocumentos}
                    />
                </div>

                {documentos.length > 0 ? (
                    <Stack gap="xs">
                        {documentos.map((documento, index) => (
                            <Group
                                key={`${documento.name}-${documento.lastModified}-${index}`}
                                justify="space-between"
                                className={classes.listRow}>
                                <Group gap="xs">
                                    <BsFileEarmarkText size={16} className={classes.docIcon} />
                                    <div>
                                        <Text className={classes.value}>{documento.name}</Text>
                                        <Text size="xs" className={classes.fileSize}>
                                            {formatBytes(documento.size)}
                                        </Text>
                                    </div>
                                </Group>

                                <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    aria-label="Quitar archivo"
                                    onClick={() => eliminarDocumento(index)}>
                                    <BsX size={18} />
                                </ActionIcon>
                            </Group>
                        ))}
                    </Stack>
                ) : (
                    <Text className={classes.emptyText}>Sin documentos seleccionados.</Text>
                )}
            </Paper>

            {/* SUBMIT */}
            <Group justify="flex-end" className={classes.submitBar}>
                <Button type="button" variant="default" onClick={() => navigate(-1)} disabled={loading}>
                    Cancelar
                </Button>
                <Button type="submit" loading={loading}>
                    Registrar
                </Button>
            </Group>

        </PersonalForm>
    );
}