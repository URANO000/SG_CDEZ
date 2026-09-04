import { useEffect, useState } from "react";
import { ActionIcon, Loader, Group, Text, Button } from "@mantine/core";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate, useParams } from "react-router";
import { notifications } from "@mantine/notifications";

import classes from "../../components/ui/styleModules/ConsultaDetalle.module.css";

import { generarReportePDF, obtenerConsultaPorId } from "../../services/consultasService";

import type { ConsultaDetailResponse } from "../../services/interfaces/consultasDetailsResponse";

import { ConsultaHeader } from "../../components/ui/InfoCards/ConsultaHeader";
import { AdultoMayorCard } from "../../components/ui/InfoCards/AdultoMayorCard";
import { ConsultaClinicaCard } from "../../components/ui/InfoCards/ConsultaClinicaCard";
import { ProfesionalCard } from "../../components/ui/InfoCards/ProfesionalCard";
import { HistorialConsultaCard } from "../../components/ui/InfoCards/HistorialConsultaCard";
import { ConsultaNutricionalCard } from "../../components/ui/InfoCards/ConsultaNutricionalCard";
import { ConsultaPsychCard } from "../../components/ui/InfoCards/ConsultaPsychCard";

export function ConsultaDetalle() {

    const { consultaId } = useParams();
    const navigate = useNavigate();

    const [consulta, setConsulta] =
        useState<ConsultaDetailResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [generating, isGenerating] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {

        if (!consultaId) return;

        const cargarConsulta = async () => {

            setLoading(true);
            setError(false);

            try {

                const response =
                    await obtenerConsultaPorId(consultaId);

                setConsulta(response);

            } catch (error) {

                notifications.show({
                    title: "Error al mostrar datos de la consulta",
                    message: "No fue posible recuperar los datos de la consulta.",
                    color: "red",
                });

                setError(true);

            } finally {

                setLoading(false);

            }
        };

        cargarConsulta();

    }, [consultaId]);


    if (loading) {

        return (
            <div className={classes.loadingState}>
                <Loader
                    color="var(--color-primary)"
                    size="lg"
                />
            </div>
        );
    }


    if (error || !consulta) {

        return (
            <div className={classes.errorState}>
                <Text className={classes.emptyText}>
                    No se pudo cargar la información de la consulta.
                </Text>
            </div>
        );
    }

    function downloadBlob(blob: Blob, filename: string) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }


    const handleGenerateReport = async () => {
        isGenerating(true);
        try {
            const blob = await generarReportePDF(consultaId!);
            downloadBlob(blob, 'reporte_de_consulta.pdf');
        } finally {
            isGenerating(false);
        }
    };


    return (
        <div className={classes.container}>

            <Group className={classes.topBar} justify="space-between">
                <ActionIcon variant="subtle" onClick={() => navigate(-1)} aria-label="Volver">
                    <BsArrowLeft size={18} />
                </ActionIcon>

                <Button className={classes.reportBtn} onClick={handleGenerateReport} loading={generating}>
                    Generar PDF
                </Button>
            </Group>


            <ConsultaHeader consulta={consulta} />


            <div className={classes.contentGrid}>

                <div className={classes.mainColumn}>

                    <AdultoMayorCard
                        adultoMayor={consulta.adultoMayor}
                    />

                    <ConsultaClinicaCard
                        consulta={consulta}
                    />

                    {consulta.consultaNutricional && (
                        <ConsultaNutricionalCard
                            nutricional={
                                consulta.consultaNutricional
                            }
                        />
                    )}

                    {
                        consulta.consultaPsych && (
                            <ConsultaPsychCard
                                psych={consulta.consultaPsych}
                            />
                        )
                    }

                </div>


                <div className={classes.sideColumn}>

                    <ProfesionalCard
                        personal={consulta.createdBy}
                    />

                    <HistorialConsultaCard
                        consulta={consulta}
                    />

                </div>

            </div>

        </div>
    );
}