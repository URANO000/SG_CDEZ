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

import { listarPersonalFiltrado } from "../../services/personalService";
import type { PersonalResponse } from "../../services/interfaces/personalResponse";
import type { PersonalFiltro } from "../../services/interfaces/personalFiltroInterface";
import type { PageResponse } from "../../services/interfaces/pageResponse";

interface PersonalSelectorProps {
    onSelect: (personal: PersonalResponse) => void;
    selectedId?: string | null;
}

export function PersonalSelector({
    onSelect,
    selectedId,
}: PersonalSelectorProps) {

    const [filtros, setFiltros] = useState<PersonalFiltro>({
        searchTerm: null,
        especialidad: null,
        activo: true
    });

    const [pageSize] = useState(5);

    const [pageData, setPageData] = useState<PageResponse<PersonalResponse> | null>(null);

    const [currentPage, setCurrentPage] = useState(0);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] = useState<string | null>(null);

    async function cargarPersonal(
        page: number,
        filtrosConsulta: PersonalFiltro = filtros
    ) {
        setLoading(true);
        setError(null);

        try {
            const response =
                await listarPersonalFiltrado(
                    filtrosConsulta,
                    page,
                    pageSize
                );

            setPageData(response);
            setCurrentPage(page);

        } catch {
            setError(
                "No se pudo cargar la lista de profesionales."
            );
        } finally {
            setLoading(false);
        }
    }

    const buscar = () => {
        void cargarPersonal(0, filtros);
    };

    const nombreCompleto = (
        personal: PersonalResponse
    ) => {
        return [
            personal.primerNombre,
            personal.segundoNombre,
            personal.primerApellido,
            personal.segundoApellido,
        ]
            .filter(Boolean)
            .join(" ");
    };

    return (
        <div>

            <Group align="flex-end">
                <TextInput
                    label="Buscar profesional"
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
                            event.preventDefault();
                            buscar();
                        }
                    }}
                    style={{ flex: 1 }}
                />

                <Button type="button" onClick={buscar}>
                    Buscar
                </Button>
            </Group>

            <div style={{ marginTop: 16 }}>
                {loading ? (
                    <Group justify="center">
                        <Loader size="sm" />
                    </Group>
                ) : error ? (
                    <Text c="red">
                        {error}
                    </Text>
                ) : (
                    pageData && (
                        <Table
                            verticalSpacing="xs"
                            highlightOnHover
                        >
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>
                                        Nombre
                                    </Table.Th>

                                    <Table.Th>
                                        Identificación
                                    </Table.Th>

                                    <Table.Th>
                                        Especialidad
                                    </Table.Th>

                                    <Table.Th>
                                        Usuario
                                    </Table.Th>

                                    <Table.Th />
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {pageData.content.length ? (
                                    pageData.content.map(
                                        (personal) => {

                                            const seleccionado =
                                                personal.personalId ===
                                                selectedId;

                                            return (
                                                <Table.Tr
                                                    key={
                                                        personal.personalId
                                                    }
                                                >
                                                    <Table.Td>
                                                        {nombreCompleto(
                                                            personal
                                                        )}
                                                    </Table.Td>

                                                    <Table.Td>
                                                        {
                                                            personal.identificacion
                                                        }
                                                    </Table.Td>

                                                    <Table.Td>
                                                        {
                                                            personal.especialidad
                                                        }
                                                    </Table.Td>

                                                    <Table.Td>
                                                        {
                                                            personal.usuario
                                                        }
                                                    </Table.Td>

                                                    <Table.Td>
                                                        <Button
                                                        type="button"
                                                            size="xs"
                                                            variant={
                                                                seleccionado
                                                                    ? "filled"
                                                                    : "light"
                                                            }
                                                            disabled={
                                                                seleccionado
                                                            }
                                                            onClick={() =>
                                                                onSelect(
                                                                    personal
                                                                )
                                                            }
                                                        >
                                                            {seleccionado
                                                                ? "Seleccionado"
                                                                : "Seleccionar"}
                                                        </Button>
                                                    </Table.Td>
                                                </Table.Tr>
                                            );
                                        }
                                    )
                                ) : (
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={5}
                                            ta="center"
                                        >
                                            Sin resultados
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    )
                )}
            </div>

            {pageData &&
                pageData.totalPages > 1 && (
                    <Group
                        justify="center"
                        mt="md"
                    >
                        <Pagination
                            value={currentPage + 1}
                            total={
                                pageData.totalPages
                            }
                            onChange={(page) =>
                                void cargarPersonal(
                                    page - 1
                                )
                            }
                        />
                    </Group>
                )}
        </div>
    );
}