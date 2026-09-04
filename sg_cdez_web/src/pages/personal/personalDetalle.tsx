import { useParams } from "react-router";
import { useEffect, useState } from "react";
import type { PersonalResponse } from "../../services/interfaces/personalResponse";
import { obtenerPersonalPorId } from "../../services/personalService";
import classes from './Detalle.module.css';
import { Paper, Title, Text, Badge, Group, SimpleGrid, Stack, ActionIcon, Loader } from '@mantine/core';
import { BsArrowLeft, BsFileEarmarkText, BsDownload } from 'react-icons/bs';
import { useNavigate } from "react-router";
import { descargarDocumento } from "../../services/documentoService";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { mostrarFecha } from "../../utils/formatHelper";
import { ESPECIALIDADES, ROL, TIPOIDENTIFICACION } from "../../services/interfaces/personalCreateRequest";


export function PersonalDetalle() {
    const { personalId } = useParams();
    const navigate = useNavigate();

    const [personal, setPersonal] = useState<PersonalResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const isActive = personal?.activo === "Activo";

    const nombreCompleto = [
        personal?.primerNombre,
        personal?.segundoNombre,
        personal?.primerApellido,
        personal?.segundoApellido
    ]
        .filter(Boolean)
        .join(" ");

    useEffect(() => {
        if (!personalId) return;

        setLoading(true);
        setError(false);

        const cargarPersonal = async () => {
            try {
                const response = await obtenerPersonalPorId(personalId);
                setPersonal(response);
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
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        cargarPersonal();
    }, [personalId]);

    const handleDescargar = async (documentoId: number, nombreArchivo: string) => {
        try {
            setDownloadingId(documentoId);
            const blob = await descargarDocumento(documentoId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = nombreArchivo;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            notifications.show({
                title: "Error al descargar",
                message: "No fue posible descargar el documento.",
                color: "red",
            });
        } finally {
            setDownloadingId(null);
        }
    };

    if (loading) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh"
            }}>
                <Loader color="var(--color-primary)" size="lg" />
            </div>
        )
    }

    if (error || !personal) {
        return (
            <div className={classes.errorState}>
                <Text className={classes.emptyText}>No se pudo cargar la información del personal.</Text>
            </div>
        )
    }


    return (
        <div className={classes.container}>

            <Group justify="space-between" className={classes.topBar}>
                <ActionIcon
                    variant="subtle"
                    onClick={() => navigate(-1)}
                    aria-label="Volver">
                    <BsArrowLeft size={18} />
                </ActionIcon>
            </Group>
            <Paper className={classes.headerCard}>
                <Group justify="space-between" wrap="wrap">
                    <div>
                        <Text className={classes.label}> Personal </Text>
                        <Title order={2} className={classes.name}>{nombreCompleto}</Title>
                        <Text size="sm" className={classes.subText}>{ROL.find(r => r.value === personal.rol.nombre)?.label ?? personal.rol.nombre}</Text>
                    </div>

                    <Badge size="lg"
                        className={
                            isActive
                                ? classes.badgeActive
                                : classes.badgeInactive
                        }>
                        {isActive ? "Activo" : "Inactivo"}
                    </Badge>
                </Group>
            </Paper>

            <div className={classes.contentGrid}>

                {/* LEFT */}
                <div className={`${classes.mainColumn} ${classes.topCard}`}>

                    <Paper className={classes.card}>
                        <Title order={4} className={classes.sectionTitle}> Información general </Title>

                        <SimpleGrid
                            cols={{ base: 1, sm: 2 }}
                            spacing="lg"
                            className={classes.infoGrid}>

                            <div>
                                <Text className={classes.label}>
                                    Identificación
                                </Text>

                                <Text className={classes.value}>
                                    {personal.identificacion}
                                </Text>
                            </div>

                            <div>
                                <Text className={classes.label}>
                                    Especialidad
                                </Text>

                                <Text className={classes.value}>
                                    {ESPECIALIDADES.find(e => e.value === personal.especialidad)?.label ?? personal.especialidad}
                                </Text>
                            </div>

                            <div>
                                <Text className={classes.label}>
                                    Carnet
                                </Text>

                                <Text className={classes.value}>
                                    {personal.carnet}
                                </Text>
                            </div>

                            <div>
                                <Text className={classes.label}>
                                    Usuario
                                </Text>

                                <Text className={classes.value}>
                                    {personal.usuario}
                                </Text>
                            </div>

                            <div>
                                <Text className={classes.label}>
                                    Dirección
                                </Text>

                                <Text className={classes.value}>
                                    {personal.direccion}
                                </Text>
                            </div>

                            <div>
                                <Text className={classes.label}>
                                    Tipo de identificación
                                </Text>

                                <Text className={classes.value}>
                                    {TIPOIDENTIFICACION.find(t => t.value === personal.tipoIdentificacion)?.label ?? personal.tipoIdentificacion}
                                </Text>
                            </div>

                        </SimpleGrid>

                    </Paper>

                </div>


                {/* RIGHT */}
                <div className={`${classes.sideColumn} ${classes.topCard}`}>

                    <div>
                        <Paper className={classes.card}>
                            <Title order={4} className={classes.sectionTitle}> Historial</Title>
                            <SimpleGrid
                                cols={{ base: 1, sm: 2 }}
                                spacing="lg"
                                className={classes.infoGrid}>
                                <div>
                                    <Text className={classes.label}>
                                        Creado Por
                                    </Text>

                                    <Text className={classes.value}>
                                        {personal.createdBy}
                                    </Text>
                                </div>
                                <div>
                                    <Text className={classes.label}>
                                        Creado En
                                    </Text>

                                    <Text className={classes.value}>
                                        {mostrarFecha(personal.createdAt)}
                                    </Text>
                                </div>
                                <div>
                                    <Text className={classes.label}>
                                        Última Actualización Por
                                    </Text>
                                    {
                                        personal.updatedBy != null ? (
                                            <Text className={classes.value}>
                                                {personal.updatedBy}
                                            </Text>
                                        ) : (
                                            <Text className={classes.emptyText}>
                                                N/A
                                            </Text>
                                        )
                                    }
                                </div>
                                <div>
                                    <Text className={classes.label}>
                                        Última Actualización En
                                    </Text>
                                    {
                                        personal.updatedAt != null ? (
                                            <Text className={classes.value}>
                                                {mostrarFecha(personal.updatedAt)}
                                            </Text>

                                        ) : (
                                            <Text className={classes.emptyText}>
                                                {mostrarFecha(personal.updatedAt)}
                                            </Text>
                                        )
                                    }
                                </div>


                            </SimpleGrid>
                        </Paper>
                    </div>

                </div>

                <div className={classes.mainColumn}>
                    {/* CONTACTOS */}

                    <Paper className={`${classes.card} ${classes.scrollCard}`}>
                        <Title order={4} className={classes.sectionTitle}> Contactos </Title>

                        <div className={classes.scrollContent}>
                            {personal.contactos.length > 0 ? (
                                <Stack gap="xs">

                                    {personal.contactos.map((contacto) => (

                                        <Group
                                            key={contacto.contactoId}
                                            className={classes.listRow}
                                        >
                                            <Text
                                                className={classes.label}
                                                style={{ minWidth: 100 }}
                                            >
                                                {contacto.tipoValor}
                                            </Text>

                                            <Text className={classes.value}>
                                                {contacto.valor}
                                            </Text>
                                        </Group>

                                    ))}

                                </Stack>

                            ) : (
                                <Text className={classes.emptyText}>
                                    Sin contactos registrados
                                </Text>
                            )}

                        </div>

                    </Paper>

                </div>

                {/* DOCUMENTOS */}

                <div className={classes.sideColumn}>
                    <Paper className={`${classes.card} ${classes.scrollCard}`}>
                        <Title order={4} className={classes.sectionTitle}> Documentos </Title>

                        <div className={classes.scrollContent}>
                            {personal.documentos.length > 0 ? (
                                <Stack gap="xs">

                                    {personal.documentos.map((documento) => {

                                        const documentoId =
                                            documento.documentoId;

                                        return (
                                            <Group
                                                key={
                                                    documentoId ??
                                                    `${documento.nombreArchivo}-${documentoId}`
                                                }
                                                justify="space-between"
                                                className={classes.listRow}
                                            >

                                                <Group gap="xs">
                                                    <BsFileEarmarkText
                                                        size={16}
                                                        className={classes.docIcon} />

                                                    <Text className={classes.value}>
                                                        {documento.nombreArchivo}
                                                    </Text>
                                                </Group>

                                                <ActionIcon
                                                    variant="subtle"
                                                    className={classes.actionView}
                                                    aria-label="Descargar"
                                                    loading={
                                                        downloadingId === documentoId
                                                    }
                                                    onClick={() => {

                                                        if (
                                                            documentoId === null ||
                                                            documentoId === undefined
                                                        ) {
                                                            return;
                                                        }

                                                        handleDescargar(
                                                            documentoId,
                                                            documento.nombreArchivo
                                                        );
                                                    }}>
                                                    <BsDownload size={16} />
                                                </ActionIcon>

                                            </Group>
                                        );

                                    })}

                                </Stack>

                            ) : (

                                <Text className={classes.emptyText}>
                                    Sin documentos registrados
                                </Text>

                            )}

                        </div>
                    </Paper>
                </div>

            </div>
        </div>
    );
}