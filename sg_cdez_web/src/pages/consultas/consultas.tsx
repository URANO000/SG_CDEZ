import { useEffect, useState } from "react";
import type { PageResponse } from "../../services/interfaces/pageResponse";
import type { ConsultaFiltro } from "../../services/interfaces/consultasInterface";
import type { ConsultaPageResponse } from "../../services/interfaces/consultasInterface";
import { listarConsultasFiltradas } from "../../services/consultasService";
import classes from '../../components/ui/tables/Filter.module.css'
import { Group, Title, Select, Button, TextInput, Pagination, Tabs, SegmentedControl } from "@mantine/core";
import { AiOutlineSearch } from "react-icons/ai";
import { ConsultaTable } from "../../components/ui/tables/ConsultaTable";
import { ESPECIALIDADES } from "../../services/interfaces/personalCreateRequest";
import { Link } from "react-router";
import { BsSliders } from "react-icons/bs";

export function Consultas() {

    const [filtros, setFiltros] = useState<ConsultaFiltro>({
        searchTerm: null,
        personalView: true,
        especialidad: null,
        fecha: null,
        fechaDesde: null,
        fechaHasta: null,
    });

    const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

    const [modoFecha, setModoFecha] = useState<"single" | "range">("single");

    const limpiarFiltros = () => {
        setFiltros({
            ...filtros,
            fecha: null,
            fechaDesde: null,
            fechaHasta: null,
        });
    };


    const [pageSize] = useState(10);

    const [pageData, setPageData] = useState<
        PageResponse<ConsultaPageResponse> | null
    >(null);

    const [currentPage, setCurrentPage] = useState(0);

    const cargarConsultas = async (page: number) => {
        const response = await listarConsultasFiltradas(
            filtros,
            page,
            pageSize
        );

        setPageData(response);
        setCurrentPage(page);
    };

    useEffect(() => {
        cargarConsultas(0);
    }, []);

    const handleRefresh = () => {
        cargarConsultas(currentPage);
    };

    const handleTabChange = (value: string | null) => {
        if (value === null) return;

        const personalView = value === "mis-consultas";

        const nuevosFiltros = {
            ...filtros,
            personalView,
        };

        setFiltros(nuevosFiltros);

        // Importante: usar los nuevos filtros inmediatamente.
        listarConsultasFiltradas(
            nuevosFiltros,
            0,
            pageSize
        ).then((response) => {
            setPageData(response);
            setCurrentPage(0);
        });
    };

    const handleBuscar = () => {
        cargarConsultas(0);
    };

    return (
        <div className={classes.mainpg}>

            <div>
                <Title order={2} className={classes.pageTitle}>
                    Consultas
                </Title>
            </div>

            <div className={classes.subpg}>

                <Tabs
                    value={
                        filtros.personalView
                            ? "mis-consultas"
                            : "todas-consultas"
                    }
                    onChange={handleTabChange}>
                    <Tabs.List>
                        <Tabs.Tab value="mis-consultas">
                            Mis consultas
                        </Tabs.Tab>

                        <Tabs.Tab value="todas-consultas">
                            Todas las consultas
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>

                <div className={classes.btnBar}>
                    <Link to={'/consulta/registrar'} className={classes.createBtn}>
                        <Button>
                            Registrar Consulta
                        </Button>
                    </Link>
                </div>

                <div className={classes.filterBar}>

                    <TextInput
                        placeholder="Buscar por nombre de especialista o adulto mayor..."
                        leftSection={<AiOutlineSearch size={16} />}
                        value={filtros.searchTerm ?? ""}
                        onChange={(e) =>
                            setFiltros({
                                ...filtros,
                                searchTerm:
                                    e.target.value === ""
                                        ? null
                                        : e.target.value,
                            })
                        }
                        classNames={{
                            input: classes.input,
                            root: classes.field,
                        }}
                    />

                    <Select
                        placeholder="Todas las especialidades"
                        value={filtros.especialidad ?? ""}
                        onChange={(value) =>
                            setFiltros({
                                ...filtros,
                                especialidad:
                                    value === "" ? null : value,
                            })
                        }
                        data={[
                            {
                                value: "",
                                label: "Todas las especialidades",
                            },
                            ...ESPECIALIDADES,
                        ]}
                        classNames={{
                            input: classes.input,
                            root: classes.field,
                        }}
                    />

                    <Button
                        variant="default"
                        leftSection={<BsSliders size={16} />}
                        onClick={() => setMostrarFiltrosAvanzados((v) => !v)}
                    >
                        {mostrarFiltrosAvanzados ? "Ocultar filtros" : "Más filtros"}
                    </Button>

                    <Button
                        onClick={handleBuscar}
                        className={classes.searchButton}
                        aria-label="Buscar"
                    >
                        Buscar
                    </Button>


                </div>

                {/* FILTROS DE FECHA */}
                {mostrarFiltrosAvanzados && (
                    <Group mb="md" mt="xs" align="flex-end">
                        <SegmentedControl
                            value={modoFecha}
                            onChange={(value) => {
                                setModoFecha(value as "single" | "range");
                                // limpiar el modo que no se está usando
                                setFiltros({
                                    ...filtros,
                                    fecha: null,
                                    fechaDesde: null,
                                    fechaHasta: null,
                                });
                            }}
                            data={[
                                { label: "Fecha exacta", value: "single" },
                                { label: "Rango de fechas", value: "range" },
                            ]}
                        />

                        {modoFecha === "single" && (
                            <TextInput
                                type="date"
                                label="Fecha"
                                value={filtros.fecha ?? ""}
                                onChange={(event) =>
                                    setFiltros({
                                        ...filtros,
                                        fecha:
                                            event.currentTarget.value === ""
                                                ? null
                                                : event.currentTarget.value,
                                    })
                                }
                            />
                        )}

                        {modoFecha === "range" && (
                            <>
                                <TextInput
                                    type="date"
                                    label="Fecha desde"
                                    value={filtros.fechaDesde ?? ""}
                                    onChange={(event) =>
                                        setFiltros({
                                            ...filtros,
                                            fechaDesde:
                                                event.currentTarget.value === ""
                                                    ? null
                                                    : event.currentTarget.value,
                                        })
                                    }
                                />

                                <TextInput
                                    type="date"
                                    label="Fecha hasta"
                                    value={filtros.fechaHasta ?? ""}
                                    onChange={(event) =>
                                        setFiltros({
                                            ...filtros,
                                            fechaHasta:
                                                event.currentTarget.value === ""
                                                    ? null
                                                    : event.currentTarget.value,
                                        })
                                    }
                                />
                            </>
                        )}

                        <Button variant="default" onClick={limpiarFiltros}>
                            Limpiar filtros
                        </Button>
                    </Group>
                )}

                <ConsultaTable
                    consultas={pageData?.content ?? []}
                    onRefresh={handleRefresh} />

                <Group
                    justify="center"
                    className={classes.paginationBar}>
                    <Pagination
                        value={(pageData?.currentPage ?? 0) + 1}
                        onChange={(page) =>
                            cargarConsultas(page - 1)
                        }
                        total={pageData?.totalPages ?? 0}
                        classNames={{
                            control: classes.pageControl,
                            root: classes.paginationRoot,
                        }}
                    />
                </Group>

            </div>
        </div>
    );
}