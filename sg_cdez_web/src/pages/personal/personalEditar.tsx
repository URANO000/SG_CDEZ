import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { PersonalForm } from "../../components/ui/forms/PersonalForm";
import type { ContactoResponse } from "../../services/interfaces/personalResponse";
import type { ContactoCreateRequest } from "../../services/interfaces/personalCreateRequest";
import type { DocumentoResponse } from "../../services/interfaces/personalResponse";
import React, { useEffect, useState } from "react";
import { actualizarPersonal, obtenerPersonalPorId } from "../../services/personalService";
import { Paper, Title, Text, Group, Stack, Button, ActionIcon } from "@mantine/core";
import { BsPlus, BsTrash, BsPersonCheck, BsUpload, BsFileEarmarkText, BsX } from "react-icons/bs";
import classes from "../../components/ui/styleModules/PersonalForm.module.css";
import { useRef } from "react";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { TIPOIDENTIFICACION } from "../../services/interfaces/personalCreateRequest";
import { ESPECIALIDADES } from "../../services/interfaces/personalCreateRequest";

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

    const [contactosExistentes, setContactosExistentes] = useState<ContactoResponse[]>([]);
    const [contactosCrear, setContactosCrear] = useState<ContactoCreateRequest[]>([]);
    const [contactosDesactivar, setContactosDesactivar] = useState<number[]>([]);

    const [documentosExistentes, setDocumentosExistentes] = useState<DocumentoResponse[]>([]);
    const [documentosDesactivar, setDocumentosDesactivar] = useState<number[]>([]);
    const [documentosCrear, setDocumentosCrear] = useState<File[]>([]);

    const [formData, setFormData] = useState({
        rol: 0,
        especialidad: "",
        tipoIdentificacion: "",
        identificacion: "",
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        direccion: "",
        carnet: "",
        usuario: ""
    });

    useEffect(() => {
        if (!personalId) return;

        const cargarPersonal = async () => {
            try {
                setLoadingData(true);

                const personal = await obtenerPersonalPorId(personalId);

                setFormData({
                    rol: personal.rol.id,
                    especialidad: personal.especialidad,
                    tipoIdentificacion: personal.tipoIdentificacion,
                    identificacion: personal.identificacion,
                    primerNombre: personal.primerNombre,
                    segundoNombre: personal.segundoNombre,
                    primerApellido: personal.primerApellido,
                    segundoApellido: personal.segundoApellido,
                    direccion: personal.direccion,
                    carnet: personal.carnet,
                    usuario: personal.usuario
                });

                setContactosExistentes(personal.contactos ?? []);
                setContactosCrear([]);
                setContactosDesactivar([]);

                setDocumentosExistentes(personal.documentos ?? []);
                setDocumentosCrear([]);
                setDocumentosDesactivar([]);

            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    notifications.show({
                        title: "Error al cargar datos",
                        message: error.response.data?.message,
                        color: "orange"
                    });
                    return;
                }

                notifications.show({
                    title: "Error al mostrar datos del personal",
                    message: "No fue posible recuperar los datos del miembro del personal.",
                    color: "red",
                });
            } finally {
                setLoadingData(false);
            }
        };

        cargarPersonal();
    }, [personalId]);

    const actualizarCampo = (
        campo: keyof typeof formData,
        valor: string
    ) => {

        setFormData(prev => ({
            ...prev,
            [campo]:
                campo === "rol"
                    ? Number(valor)
                    : valor
        }));

    };

    const actualizarContactoExistente = (
        index: number,
        campo: keyof ContactoResponse,
        valor: string
    ) => {

        setContactosExistentes(prev =>
            prev.map((contacto, i) =>
                i === index
                    ? {
                        ...contacto,
                        [campo]: valor
                    }
                    : contacto
            )
        );
    };
    const eliminarContactoExistente = (
        contactoId: number
    ) => {

        setContactosExistentes(prev =>
            prev.filter(
                contacto =>
                    contacto.contactoId !== contactoId
            )
        );

        setContactosDesactivar(prev =>
            prev.includes(contactoId)
                ? prev
                : [...prev, contactoId]
        );
    };
    const agregarContacto = () => {

        setContactosCrear(prev => [
            ...prev,
            {
                tipoValor: "",
                valor: ""
            }
        ]);
    };
    const actualizarContactoNuevo = (
        index: number,
        campo: keyof ContactoCreateRequest,
        valor: string
    ) => {

        setContactosCrear(prev =>
            prev.map((contacto, i) =>
                i === index
                    ? {
                        ...contacto,
                        [campo]: valor
                    }
                    : contacto
            )
        );
    };
    const eliminarContactoNuevo = (
        index: number
    ) => {

        setContactosCrear(prev =>
            prev.filter((_, i) => i !== index)
        );
    };

    const usarComoUsuario = (correo: string) => {
        actualizarCampo("usuario", correo);
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

        setDocumentosDesactivar(prev => [
            ...prev,
            documentoId
        ]);
    };

    const manejarDocumentos = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const files = e.currentTarget.files;

        if (!files || files.length === 0) return;

        const nuevosArchivos = Array.from(files);

        setDocumentosCrear(prev => {
            const resultado = [...prev, ...nuevosArchivos];


            return resultado;
        });

        e.currentTarget.value = "";
    };
    const eliminarDocumentoNuevo = (
        index: number
    ) => {

        setDocumentosCrear(prev =>
            prev.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!personalId) return;

        setLoading(true);

        try {
            const request = {
                rol: formData.rol,
                especialidad: formData.especialidad,
                tipoIdentificacion: formData.tipoIdentificacion,
                identificacion: formData.identificacion,
                primerNombre: formData.primerNombre,
                segundoNombre: formData.segundoNombre,
                primerApellido: formData.primerApellido,
                segundoApellido: formData.segundoApellido,
                direccion: formData.direccion,
                carnet: formData.carnet,
                usuario: formData.usuario,

                contactosActualizar:
                    contactosExistentes.map(
                        contacto => ({
                            contactoId: contacto.contactoId,
                            valor: contacto.valor,
                            tipoValor: contacto.tipoValor
                        })
                    ),
                contactosDesactivar,
                contactosCrear,
                documentosDesactivar
            };

            const formDataMultipart = new FormData();
            formDataMultipart.append("personal", new Blob(
                [
                    JSON.stringify(request)
                ],
                {
                    type: "application/json"
                }
            ));

            documentosCrear.forEach(
                documento => {
                    formDataMultipart.append(
                        "documentosCrear",
                        documento
                    );
                }
            );

            await actualizarPersonal(personalId, formDataMultipart);
            notifications.show({
                title: "Personal actualizado",
                message: "El miembro del personal se actualizó correctamente.",
                color: "green",
            });


            navigate(`/personal`);

        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                notifications.show({
                    title: "Falta de permisos",
                    message: error.response.data?.message,
                    color: "orange"
                });
                return;
            }

            if (axios.isAxiosError(error) && error.response?.status === 404) {
                notifications.show({
                    title: "Error al actualizar",
                    message: error.response.data?.message,
                    color: "orange"
                });
                return;
            }

            notifications.show({
                title: "Error al actualizar",
                message: "No se pudo actualizar el miembro del personal.",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className={classes.container}>
                <Paper className={classes.card}>
                    <Text className={classes.emptyText}>Cargando información...</Text>
                </Paper>
            </div>
        );
    }

    return (
        <PersonalForm
            title="Editar Personal"
            subtitle="Edición de personal y sus componentes."
            onSubmit={handleSubmit}>

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
                            value={formData.primerNombre}
                            onChange={e => actualizarCampo("primerNombre", e.target.value)}
                            required
                        />
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Segundo nombre</label>
                        <input
                            className={classes.input}
                            type="text"
                            value={formData.segundoNombre}
                            onChange={e => actualizarCampo("segundoNombre", e.target.value)}
                        />
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Primer apellido<span className={classes.required}>*</span></label>
                        <input
                            className={classes.input}
                            type="text"
                            value={formData.primerApellido}
                            onChange={e => actualizarCampo("primerApellido", e.target.value)}
                            required
                        />
                    </div>

                    {/* Was missing in the original edit form — segundoApellido had no input. */}
                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Segundo apellido</label>
                        <input
                            className={classes.input}
                            type="text"
                            value={formData.segundoApellido}
                            onChange={e => actualizarCampo("segundoApellido", e.target.value)}
                        />
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Tipo de identificación<span className={classes.required}>*</span></label>
                        <select
                            className={classes.select}
                            value={formData.tipoIdentificacion}
                            onChange={e => actualizarCampo("tipoIdentificacion", e.target.value)}
                            required>
                            <option value="" disabled>Tipo de identificación</option>
                            {TIPOIDENTIFICACION.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Identificación<span className={classes.required}>*</span></label>
                        <input
                            className={classes.input}
                            type="text"
                            value={formData.identificacion}
                            onChange={e => actualizarCampo("identificacion", e.target.value)}
                            required
                        />
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Carné</label>
                        <input
                            className={classes.input}
                            type="text"
                            value={formData.carnet}
                            onChange={e => actualizarCampo("carnet", e.target.value)}
                        />
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Dirección</label>
                        <input
                            className={classes.input}
                            type="text"
                            value={formData.direccion}
                            onChange={e => actualizarCampo("direccion", e.target.value)}
                        />
                    </div>

                    <div className={`${classes.fieldGroup} ${classes.fieldFull}`}>
                        <label className={classes.fieldLabel}>Usuario</label>
                        <input
                            className={classes.input}
                            type="text"
                            value={formData.usuario}
                            onChange={e => actualizarCampo("usuario", e.target.value)}
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
                        <label className={classes.fieldLabel}>Rol<span className={classes.required}>*</span></label>
                        <select
                            className={classes.select}
                            value={formData.rol || ""}
                            onChange={e => actualizarCampo("rol", e.target.value)}
                            required>
                            <option value="" disabled>Seleccionar rol</option>
                            <option value="1">Administrador</option>
                            <option value="2">Usuario Normal</option>
                            <option value="3">Ayudante Administrativo</option>
                        </select>
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Especialidad<span className={classes.required}>*</span></label>
                        <select
                            className={classes.select}
                            value={formData.especialidad}
                            onChange={e => actualizarCampo("especialidad", e.target.value)}
                            required>
                            <option value="" disabled>Seleccionar especialidad</option>
                            {ESPECIALIDADES.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
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

                {contactosExistentes.length === 0 && contactosCrear.length === 0 ? (
                    <Text className={classes.emptyText}>Sin contactos agregados.</Text>
                ) : (
                    <Stack gap="sm">
                        {contactosExistentes.map((contacto, index) => (
                            <div key={contacto.contactoId} className={classes.contactRow}>
                                <select
                                    className={classes.select}
                                    value={contacto.tipoValor}
                                    onChange={e =>
                                        actualizarContactoExistente(index, "tipoValor", e.target.value)
                                    }
                                    required>
                                    <option value="" disabled>Tipo</option>
                                    <option value="TELEFONO">Número Telefónico</option>
                                    <option value="CORREO">Correo Electrónico</option>
                                </select>

                                <input
                                    className={classes.input}
                                    type={contacto.tipoValor === "CORREO" ? "email" : "text"}
                                    placeholder={contacto.tipoValor === "CORREO" ? "correo@ejemplo.com" : "Número de teléfono"}
                                    value={contacto.valor}
                                    onChange={e =>
                                        actualizarContactoExistente(index, "valor", e.target.value)
                                    }
                                    required
                                />

                                <Group gap={4} wrap="nowrap" className={classes.contactActions}>
                                    {contacto.tipoValor === "CORREO" && contacto.valor && (
                                        <ActionIcon
                                            variant="subtle"
                                            className={classes.actionEmail}
                                            title="Usar como usuario"
                                            aria-label="Usar como usuario"
                                            onClick={() => usarComoUsuario(contacto.valor)}>
                                            <BsPersonCheck size={16} />
                                        </ActionIcon>
                                    )}

                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        aria-label="Eliminar contacto"
                                        onClick={() => eliminarContactoExistente(contacto.contactoId)}>
                                        <BsTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            </div>
                        ))}

                        {contactosCrear.map((contacto, index) => (
                            <div key={`nuevo-${index}`} className={classes.contactRow}>
                                <select
                                    className={classes.select}
                                    value={contacto.tipoValor}
                                    onChange={e =>
                                        actualizarContactoNuevo(index, "tipoValor", e.target.value)
                                    }
                                    required>
                                    <option value="" disabled>Tipo</option>
                                    <option value="TELEFONO">Número Telefónico</option>
                                    <option value="CORREO">Correo Electrónico</option>
                                </select>

                                <input
                                    className={classes.input}
                                    type={contacto.tipoValor === "CORREO" ? "email" : "text"}
                                    placeholder={contacto.tipoValor === "CORREO" ? "correo@ejemplo.com" : "Número de teléfono"}
                                    value={contacto.valor}
                                    onChange={e =>
                                        actualizarContactoNuevo(index, "valor", e.target.value)
                                    }
                                    required
                                />

                                <Group gap={4} wrap="nowrap" className={classes.contactActions}>
                                    {contacto.tipoValor === "CORREO" && contacto.valor && (
                                        <ActionIcon
                                            variant="subtle"
                                            className={classes.actionEmail}
                                            title="Usar como usuario"
                                            aria-label="Usar como usuario"
                                            onClick={() => usarComoUsuario(contacto.valor)}>
                                            <BsPersonCheck size={16} />
                                        </ActionIcon>
                                    )}

                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        aria-label="Eliminar contacto"
                                        onClick={() => eliminarContactoNuevo(index)}>
                                        <BsTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            </div>
                        ))}
                    </Stack>
                )}
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

        </PersonalForm>
    );
}