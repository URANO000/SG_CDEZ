import { useEffect, useState } from "react";
import { PersonalTable } from "../../components/ui/tables/personalTable";
import type { PersonalResponse } from "../../services/interfaces/personalResponse";
import type { PersonalFiltro } from "../../services/interfaces/personalFiltroInterface";
import { listarPersonalFiltrado } from "../../services/personalService";
import type { PageResponse } from "../../services/interfaces/pageResponse";
import classes from '../../components/ui/tables/Filter.module.css';
import { Group, Title, Select, Button, TextInput, Pagination } from "@mantine/core";
import { AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router";

export function Personal() {
    const [filtros, setFiltros] = useState<PersonalFiltro>({
        searchTerm: null,
        especialidad: null,
        activo: null
    });

    const [pageSize] = useState(10);
    const [pageData, setPageData] = useState<PageResponse<PersonalResponse> | null>(null);

    const cargarPersonal = async (page: number) => {
        const response = await listarPersonalFiltrado(filtros, page, pageSize);
        setPageData(response);
    }

    useEffect(() => { cargarPersonal(0); }, []);

    return (
        <div className={classes.mainpg}>
            <div>
                <Title order={2} className={classes.pageTitle}>Personal</Title>
            </div>

            <div className={classes.subpg}>
                <Link to={'/personal/registrar'} className={classes.createBtn}>
                    <Button>
                        Registrar Personal
                    </Button>
                </Link>
                <div className={classes.filterBar}>
                    <TextInput
                        placeholder="Buscar..."
                        leftSection={<AiOutlineSearch size={16} />}
                        value={filtros.searchTerm ?? ""}
                        onChange={(e) => setFiltros({ ...filtros, searchTerm: e.target.value === "" ? null : e.target.value })}
                        classNames={{ input: classes.input, root: classes.field }}
                    />

                    <Select
                        placeholder="Todas las especialidades"
                        value={filtros.especialidad ?? ""}
                        onChange={(value) => setFiltros({ ...filtros, especialidad: value === "" ? null : value })}
                        data={[
                            { value: "", label: "Todas las especialidades" },
                            { value: "Medicina", label: "Medicina" },
                            { value: "Enfermería", label: "Enfermería" },
                            { value: "Psicología", label: "Psicología" },
                            { value: "Nutrición", label: "Nutrición" },
                            { value: "Trabajo Social", label: "Trabajo Social" },
                            { value: "Terapia Física", label: "Terapia Física" },
                            { value: "Terapia Respiratoria", label: "Terapia Respiratoria" },
                            { value: "Terapia de Lenguaje", label: "Terapia de Lenguaje" },

                        ]}
                        classNames={{ input: classes.input, root: classes.field }}
                    />

                    <Select
                        placeholder="Todos"
                        value={filtros.activo === null ? "" : filtros.activo.toString()}
                        onChange={(value) => setFiltros({ ...filtros, activo: value === "" ? null : value === "true" })}
                        data={[
                            { value: "", label: "Todos" },
                            { value: "true", label: "Activos" },
                            { value: "false", label: "Inactivos" },
                        ]}
                        classNames={{ input: classes.input, root: classes.field }}
                    />

                    <Button onClick={() => cargarPersonal(0)} className={classes.searchButton} aria-label="Buscar">
                        Buscar
                    </Button>
                </div>

                <PersonalTable personal={pageData?.content ?? []} />

                <Group justify="center" className={classes.paginationBar}>
                    <Pagination
                        value={(pageData?.currentPage ?? 0) + 1}
                        onChange={(page) => cargarPersonal(page - 1)}
                        total={pageData?.totalPages ?? 0}
                        classNames={{
                            control: classes.pageControl,
                            root: classes.paginationRoot,
                        }}
                    />
                </Group>
            </div>
        </div>
    )
}