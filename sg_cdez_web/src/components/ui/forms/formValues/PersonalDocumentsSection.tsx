import {
    ActionIcon,
    Group,
    Paper,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useRef, type ChangeEvent, type KeyboardEvent } from "react";
import {
    BsFileEarmarkText,
    BsTrash,
    BsUpload,
    BsX,
} from "react-icons/bs";

import classes from "../../styleModules/PersonalForm.module.css";

export interface PersonalExistingDocument {
    documentoId: number | null;
    nombreArchivo: string;
}

interface PersonalDocumentsSectionProps {
    documentosExistentes?: PersonalExistingDocument[];
    documentosNuevos: File[];
    onDocumentosNuevosChange: (documentos: File[]) => void;
    onEliminarExistente?: (documentoId: number) => void | Promise<void>;
    disabled?: boolean;
}

const ACCEPTED_FILE_EXTENSIONS = [
    ".png",
    ".jpg",
    ".jpeg",
    ".pdf",
];

function formatBytes(bytes: number): string {
    if (bytes === 0) {
        return "0 bytes";
    }

    const units = ["bytes", "KB", "MB", "GB"];
    const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / 1024 ** unitIndex;

    return `${value.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

function getFileKey(file: File): string {
    return `${file.name}-${file.size}-${file.lastModified}`;
}

export function PersonalDocumentsSection({
    documentosExistentes = [],
    documentosNuevos,
    onDocumentosNuevosChange,
    onEliminarExistente,
    disabled = false,
}: PersonalDocumentsSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const abrirSelector = () => {
        if (!disabled) {
            fileInputRef.current?.click();
        }
    };

    const manejarTeclado = (
        event: KeyboardEvent<HTMLDivElement>
    ) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            abrirSelector();
        }
    };

    const manejarDocumentos = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const archivosSeleccionados = Array.from(
            event.target.files ?? []
        );

        if (archivosSeleccionados.length === 0) {
            return;
        }

        const archivosActuales = new Set(
            documentosNuevos.map(getFileKey)
        );

        const archivosSinDuplicados = archivosSeleccionados.filter(
            archivo => !archivosActuales.has(getFileKey(archivo))
        );

        onDocumentosNuevosChange([
            ...documentosNuevos,
            ...archivosSinDuplicados,
        ]);
        event.target.value = "";
    };

    const eliminarDocumentoNuevo = (index: number) => {
        onDocumentosNuevosChange(
            documentosNuevos.filter(
                (_, documentoIndex) => documentoIndex !== index
            )
        );
    };

    return (
        <Paper className={classes.card}>
            <Group className={classes.sectionHeader}>
                <Title order={4} className={classes.sectionTitle}>
                    Documentos adjuntos
                </Title>
            </Group>

            {documentosExistentes.length > 0 && (
                <>
                    <Text className={classes.helperText}>
                        Documentos registrados
                    </Text>

                    <Stack gap="xs" mb="md">
                        {documentosExistentes.map(documento => (
                            <Group
                                key={documento.documentoId}
                                justify="space-between"
                                className={classes.listRow}
                            >
                                <Group gap="xs">
                                    <BsFileEarmarkText
                                        size={16}
                                        className={classes.docIcon}
                                    />

                                    <Text className={classes.value}>
                                        {documento.nombreArchivo}
                                    </Text>
                                </Group>

                                {onEliminarExistente && (
                                    <ActionIcon
                                        type="button"
                                        variant="subtle"
                                        color="red"
                                        disabled={disabled}
                                        aria-label={`Eliminar ${documento.nombreArchivo}`}
                                        onClick={() =>
                                            documento.documentoId != null &&
                                            onEliminarExistente(
                                                documento.documentoId
                                            )
                                        }
                                    >
                                        <BsTrash size={16} />
                                    </ActionIcon>
                                )}
                            </Group>
                        ))}
                    </Stack>
                </>
            )}

            <Text className={classes.helperText}>
                Se pueden elegir múltiples documentos. PNG, JPG,
                JPEG o PDF.
            </Text>

            <div
                className={classes.dropzone}
                onClick={abrirSelector}
                onKeyDown={manejarTeclado}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-disabled={disabled}
            >
                <BsUpload
                    size={18}
                    className={classes.dropzoneIcon}
                />

                <span>Hacé clic para seleccionar archivos</span>

                <input
                    ref={fileInputRef}
                    className={classes.hiddenFileInput}
                    type="file"
                    multiple
                    disabled={disabled}
                    accept={ACCEPTED_FILE_EXTENSIONS.join(",")}
                    onChange={manejarDocumentos}
                />
            </div>

            {documentosNuevos.length > 0 ? (
                <Stack gap="xs" mt="md">
                    {documentosNuevos.map((documento, index) => (
                        <Group
                            key={`${getFileKey(documento)}-${index}`}
                            justify="space-between"
                            className={classes.listRow}
                        >
                            <Group gap="xs">
                                <BsFileEarmarkText
                                    size={16}
                                    className={classes.docIcon}
                                />

                                <div>
                                    <Text className={classes.value}>
                                        {documento.name}
                                    </Text>

                                    <Text
                                        size="xs"
                                        className={classes.fileSize}
                                    >
                                        {formatBytes(documento.size)}
                                    </Text>
                                </div>
                            </Group>

                            <ActionIcon
                                type="button"
                                variant="subtle"
                                color="red"
                                disabled={disabled}
                                aria-label={`Quitar ${documento.name}`}
                                onClick={() =>
                                    eliminarDocumentoNuevo(index)
                                }
                            >
                                <BsX size={18} />
                            </ActionIcon>
                        </Group>
                    ))}
                </Stack>
            ) : (
                <Text className={classes.emptyText} mt="md">
                    Sin documentos nuevos seleccionados.
                </Text>
            )}
        </Paper>
    );
}