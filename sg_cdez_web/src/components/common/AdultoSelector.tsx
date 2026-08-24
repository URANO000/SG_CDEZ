import { useState } from "react";
import {
    Button,
    Group,
    Loader,
    Pagination,
    Table,
    Text,
    TextInput,
} from "@mantine/core";
import { AiOutlineSearch } from "react-icons/ai";

import classes from "../ui/styleModules/AdultoSelector.module.css";

import { listarAdultosMayoresFiltrados } from "../../services/adultoMayorService";

import type { AdultoMayorFiltro } from "../../services/interfaces/adultoMayorInterface";

import type { AdultoMayorResponse } from "../../services/interfaces/adultoMayorInterface";

import type { PageResponse } from "../../services/interfaces/pageResponse";
import { obtenerFechaSinHora } from "../../utils/formatHelper";

interface AdultoSelectorProps {
    onSelect: (adulto: AdultoMayorResponse) => void;
}


export function AdultoSelector({
    onSelect,
}: AdultoSelectorProps) {

    const [filtros, setFiltros] =
        useState<AdultoMayorFiltro>({
            searchTerm: null,
            estado: "ACTIVO",
        });


    const [pageSize] = useState(10);

    const [pageData, setPageData] =
        useState<PageResponse<AdultoMayorResponse> | null>(
            null
        );

    const [currentPage, setCurrentPage] =
        useState(0);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);


    async function cargarAdultos(
        page: number,
        filtrosConsulta: AdultoMayorFiltro = filtros,
    ) {

        setLoading(true);
        setError(null);

        try {

            const response =
                await listarAdultosMayoresFiltrados(
                    filtrosConsulta,
                    page,
                    pageSize,
                );

            setPageData(response);
            setCurrentPage(page);

        } catch {

            setError(
                "No se pudo cargar la lista de adultos mayores."
            );

        } finally {

            setLoading(false);

        }
    }


    const buscar = () => {

        void cargarAdultos(
            0,
            filtros
        );

    };


    return (

        <div className={classes.container}>


            {/* BUSCADOR */}

            <Group
                align="flex-end"
                className={classes.searchBar}
            >

                <TextInput
                    label="Buscar adulto mayor"
                    placeholder="Nombre o identificación..."
                    leftSection={
                        <AiOutlineSearch size={16} />
                    }
                    value={filtros.searchTerm ?? ""}
                    onChange={(event) => {

                        const value =
                            event.currentTarget.value;

                        setFiltros({
                            ...filtros,
                            searchTerm:
                                value.trim() === ""
                                    ? null
                                    : value,
                        });

                    }}
                    onKeyDown={(event) => {

                        if (event.key === "Enter") {
                            buscar();
                        }

                    }}
                    className={classes.searchInput}
                />


                <Button
                    onClick={buscar}
                >
                    Buscar
                </Button>

            </Group>


            {/* RESULTADOS */}

            <div className={classes.resultsContainer}>

                {loading ? (

                    <div className={classes.loadingState}>

                        <Loader
                            size="sm"
                            color="var(--color-primary)"
                        />

                    </div>

                ) : error ? (

                    <Text className={classes.errorText}>
                        {error}
                    </Text>

                ) : (

                    <Table.ScrollContainer minWidth={650}>

                        <Table
                            verticalSpacing="sm"
                            highlightOnHover
                        >

                            <Table.Thead>

                                <Table.Tr>

                                    <Table.Th>
                                        Nombre completo
                                    </Table.Th>

                                    <Table.Th>
                                        Identificación
                                    </Table.Th>

                                    <Table.Th>
                                        Fecha de nacimiento
                                    </Table.Th>

                                    <Table.Th>
                                        Acción
                                    </Table.Th>

                                </Table.Tr>

                            </Table.Thead>


                            <Table.Tbody>

                                {pageData?.content?.length ? (

                                    pageData.content.map(
                                        (adulto) => (

                                            <Table.Tr
                                                key={adulto.adultoId}
                                            >

                                                <Table.Td >
                                                    {adulto.nombreCompleto}
                                                </Table.Td>

                                                <Table.Td>
                                                    {adulto.identificacion}
                                                </Table.Td>

                                                <Table.Td>
                                                    {obtenerFechaSinHora(adulto.fechaNacimiento) ??
                                                        "No registrada"}
                                                </Table.Td>

                                                <Table.Td>

                                                    <Button
                                                        size="xs"
                                                        variant="light"
                                                        onClick={() =>
                                                            onSelect(
                                                                adulto
                                                            )
                                                        }
                                                    >
                                                        Seleccionar
                                                    </Button>

                                                </Table.Td>

                                            </Table.Tr>

                                        )
                                    )

                                ) : (

                                    <Table.Tr>

                                        <Table.Td
                                            colSpan={4}
                                            className={
                                                classes.emptyState
                                            }
                                        >
                                            Sin resultados
                                        </Table.Td>

                                    </Table.Tr>

                                )}

                            </Table.Tbody>

                        </Table>

                    </Table.ScrollContainer>

                )}

            </div>


            {/* PAGINACIÓN */}

            {pageData &&
                pageData.totalPages > 1 && (

                    <Group justify="center">

                        <Pagination
                            value={
                                currentPage + 1
                            }
                            onChange={(page) =>
                                void cargarAdultos(
                                    page - 1
                                )
                            }
                            total={
                                pageData.totalPages
                            }
                        />

                    </Group>

                )}

        </div>
    );
}