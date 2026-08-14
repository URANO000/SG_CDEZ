import { useParams } from "react-router";
import { useEffect, useState } from "react";
import type { PersonalResponse } from "../../services/interfaces/personalResponse";
import { obtenerPersonalPorId } from "../../services/personalService";
import classes from './Detalle.module.css';
import { Paper, Title, Text, Badge, Group, SimpleGrid, Stack, ActionIcon, Loader } from '@mantine/core';
import { BsArrowLeft, BsFileEarmarkText, BsDownload } from 'react-icons/bs';
import { useNavigate } from "react-router";
import { descargarDocumento } from "../../services/documentoService";

export function PersonalDetalle() {
    const { personalId } = useParams();
    const navigate = useNavigate();

    const [personal, setPersonal] = useState<PersonalResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const isActive = personal?.activo === "Activo";

    useEffect(() => {
        if (!personalId) return;

        setLoading(true);
        setError(false);

        const cargarPersonal = async () => {
            try {
                const response = await obtenerPersonalPorId(personalId);
                setPersonal(response);
            } catch (error) {
                console.error("Error obteniendo personal:", error);
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
            alert("Error...I need to make notifs properly")
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
                    aria-label="Volver"
                >
                    <BsArrowLeft size={18} />
                </ActionIcon>
            </Group>
            <Paper className={classes.headerCard}>
                <Group justify="space-between" wrap="wrap">
                    <div>
                        <Text className={classes.label}> Personal </Text>
                        <Title order={2} className={classes.name}>{personal.nombreCompleto}</Title>
                        <Text size="sm" className={classes.subText}>{personal.rol}</Text>
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
                <div className={classes.mainColumn}>

                    <Paper className={classes.card}>

                        <Title order={4} className={classes.sectionTitle}> Información general </Title>

                        <SimpleGrid
                            cols={{ base: 1, sm: 2 }}
                            spacing="lg"
                            className={classes.infoGrid}
                        >

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
                                    {personal.especialidad}
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
                                    {personal.tipoIdentificacion}
                                </Text>
                            </div>

                        </SimpleGrid>

                    </Paper>

                </div>


                {/* RIGHT */}
                <div className={classes.sideColumn}>

                    {/* CONTACTOS */}

                    <Paper className={`${classes.card} ${classes.scrollCard}`}>

                        <Title
                            order={4}
                            className={classes.sectionTitle}
                        >
                            Contactos
                        </Title>

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


                    {/* DOCUMENTOS */}

                    <Paper className={`${classes.card} ${classes.scrollCard}`}>

                        <Title
                            order={4}
                            className={classes.sectionTitle}
                        >
                            Documentos
                        </Title>

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
                                                        className={classes.docIcon}
                                                    />

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
                                                    }}
                                                >
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