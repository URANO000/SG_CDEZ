import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Paper, Title, Text, Group, Stack, Button, ActionIcon, Tooltip } from "@mantine/core";
import { BsPlus, BsTrash, BsPersonCheck, BsUpload, BsFileEarmarkText, BsX } from "react-icons/bs";
import { PersonalForm } from "../../components/ui/forms/PersonalForm";
import classes from "../../components/ui/forms/PersonalForm.module.css";
import type { ContactoCreateRequest } from "../../services/interfaces/personalCreateRequest";
import type { PersonalCreateRequest } from "../../services/interfaces/personalCreateRequest";
import { registrarPersonal } from "../../services/personalService";

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
    const [contactos, setContactos] = useState<ContactoCreateRequest[]>([
        {
            tipoValor: "",
            valor: ""
        }
    ]);

    const usuarioInputRef = useRef<HTMLInputElement>(null);

    const eliminarContacto = (index: number) => {
        setContactos(
            contactos.filter((_, i) => i !== index)
        );
    };

    const agregarContacto = () => {
        setContactos([
            ...contactos,
            {
                tipoValor: "",
                valor: ""
            }
        ]);
    };

    const actualizarContacto = (
        index: number,
        campo: keyof ContactoCreateRequest,
        valor: string
    ) => {
        setContactos(prev =>
            prev.map((contacto, i) =>
                i === index
                    ? { ...contacto, [campo]: valor }
                    : contacto
            )
        );
    };

    const usarComoUsuario = (correo: string) => {
        if (usuarioInputRef.current) {
            usuarioInputRef.current.value = correo;
            usuarioInputRef.current.focus();
        }
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
        setDocumentos(
            documentos.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        try {
            const formData = new FormData();
            const form = e.currentTarget;

            const personal: PersonalCreateRequest = {
                rol: Number(
                    (form.elements.namedItem("rol") as HTMLInputElement).value
                ),
                especialidad:
                    (form.elements.namedItem("especialidad") as HTMLInputElement).value,
                tipoIdentificacion:
                    (form.elements.namedItem("tipoIdentificacion") as HTMLSelectElement).value,

                identificacion:
                    (form.elements.namedItem("identificacion") as HTMLInputElement).value,

                primerNombre:
                    (form.elements.namedItem("primerNombre") as HTMLInputElement).value,

                segundoNombre:
                    (form.elements.namedItem("segundoNombre") as HTMLInputElement).value,

                primerApellido:
                    (form.elements.namedItem("primerApellido") as HTMLInputElement).value,

                segundoApellido:
                    (form.elements.namedItem("segundoApellido") as HTMLInputElement).value,

                direccion:
                    (form.elements.namedItem("direccion") as HTMLInputElement).value,

                carnet:
                    (form.elements.namedItem("carnet") as HTMLInputElement).value,

                usuario:
                    (form.elements.namedItem("usuario") as HTMLInputElement).value,

                contactos
            };

            formData.append("personal", new Blob([JSON.stringify(personal)],
                {
                    type: "application/json"
                }
            )
            );

            documentos.forEach(documento => { formData.append("documentos", documento); });

            await registrarPersonal(formData);
            navigate("/personal");

        } catch (error) {
            console.error(error);

            alert(
                "Ocurrió un error al registrar el personal."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <PersonalForm
            title="Registrar Personal"
            subtitle="Registrar nuevo miembro del personal."
            onSubmit={handleSubmit}>

            {/* INFORMACIÓN GENERAL */}
            <Paper className={classes.card}>
                <Group className={classes.sectionHeader}>
                    <Title order={4} className={classes.sectionTitle}>Información general</Title>
                </Group>

                <div className={classes.formGrid}>
                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Primer nombre<span className={classes.required}>*</span></label>
                        <input className={classes.input} type="text" name="primerNombre" required />
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Segundo nombre</label>
                        <input className={classes.input} type="text" name="segundoNombre" />
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Primer apellido<span className={classes.required}>*</span></label>
                        <input className={classes.input} type="text" name="primerApellido" required />
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Segundo apellido</label>
                        <input className={classes.input} type="text" name="segundoApellido" />
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Tipo de identificación<span className={classes.required}>*</span></label>
                        <select className={classes.select} name="tipoIdentificacion" defaultValue="" required>
                            <option value="" disabled>Tipo de identificación</option>
                            <option value="CIC">CIC</option>
                            <option value="CRP">CRP</option>
                            <option value="CRR">CRR</option>
                            <option value="RE">RE</option>
                            <option value="APO">APO</option>
                            <option value="CRT">CRT</option>
                            <option value="CRE">CRE</option>
                            <option value="PEX">PEX</option>
                        </select>
                        <button type="button" className={classes.infoLink}>
                            ¿Qué significan estas siglas?
                        </button>
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Identificación<span className={classes.required}>*</span></label>
                        <input className={classes.input} type="text" name="identificacion" required />
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Carné</label>
                        <input className={classes.input} type="text" name="carnet" />
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Dirección</label>
                        <input className={classes.input} type="text" name="direccion" />
                    </div>

                    <div className={`${classes.fieldGroup} ${classes.fieldFull}`}>
                        <label className={classes.fieldLabel}>Usuario</label>
                        <input
                            ref={usuarioInputRef}
                            className={classes.input}
                            type="text"
                            name="usuario"
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
                        <select className={classes.select} name="rol" defaultValue="" required>
                            <option value="" disabled>Seleccionar rol</option>
                            <option value="1">Administrador</option>
                            <option value="2">Usuario Normal</option>
                        </select>
                    </div>

                    <div className={classes.fieldGroup}>
                        <label className={classes.fieldLabel}>Especialidad<span className={classes.required}>*</span></label>
                        <select className={classes.select} name="especialidad" defaultValue="" required>
                            <option value="" disabled>Seleccionar especialidad</option>
                            <option value="Medicina">Medicina</option>
                            <option value="Enfermería">Enfermería</option>
                            <option value="Psicología">Psicología</option>
                            <option value="Nutrición">Nutrición</option>
                            <option value="Trabajo Social">Trabajo Social</option>
                            <option value="Terapia Física">Terapia Física</option>
                            <option value="Terapia Respiratoria">Terapia Respiratoria</option>
                            <option value="Terapia de Lenguaje">Terapia de Lenguaje</option>
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

                {contactos.length === 0 ? (
                    <Text className={classes.emptyText}>Sin contactos agregados.</Text>
                ) : (
                    <Stack gap="sm">
                        {contactos.map((contacto, index) => (
                            <div key={index} className={classes.contactRow}>
                                <select
                                    className={classes.select}
                                    value={contacto.tipoValor}
                                    onChange={e =>
                                        actualizarContacto(index, "tipoValor", e.target.value)
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
                                        actualizarContacto(index, "valor", e.target.value)
                                    }
                                    required
                                />

                                <Group gap={4} wrap="nowrap" className={classes.contactActions}>
                                    {contacto.tipoValor === "CORREO" && contacto.valor && (
                                        <Tooltip label="Utilizar como usuario">
                                            <ActionIcon
                                                variant="subtle"
                                                className={classes.actionEmail}
                                                title="Usar como usuario"
                                                aria-label="Usar como usuario"
                                                onClick={() => usarComoUsuario(contacto.valor)}>
                                                <BsPersonCheck size={16} />
                                            </ActionIcon>
                                        </Tooltip>
                                    )}

                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        aria-label="Eliminar contacto"
                                        onClick={() => eliminarContacto(index)}>
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
                        className={classes.dropzoneIcon}/>

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