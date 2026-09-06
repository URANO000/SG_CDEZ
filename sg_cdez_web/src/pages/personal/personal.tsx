import { useEffect, useState } from "react";
import { PersonalTable } from "../../components/ui/tables/personalTable";
import type { PersonalResponse } from "../../services/interfaces/personalResponse";
import type { PersonalFiltro } from "../../services/interfaces/personalFiltroInterface";
import { listarPersonalFiltrado } from "../../services/personalService";
import type { PageResponse } from "../../services/interfaces/pageResponse";
import classes from "../../components/ui/tables/Filter.module.css";
import {
  Group,
  Title,
  Select,
  Button,
  TextInput,
  Pagination,
  Menu,
} from "@mantine/core";
import { AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router";
import {
  generarReportePDF,
  generarReporteExcel,
} from "../../services/personalService";
import { ESPECIALIDADES } from "../../services/interfaces/personalCreateRequest";
import { TbFileTypePdf, TbFileTypeXls, TbChevronDown } from "react-icons/tb";
import { BsPlusLg } from "react-icons/bs";

export function Personal() {
  const [filtros, setFiltros] = useState<PersonalFiltro>({
    searchTerm: null,
    especialidad: null,
    activo: null,
  });

  const [pageSize] = useState(10);
  const [pageData, setPageData] =
    useState<PageResponse<PersonalResponse> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  function downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  const handleGenerateReport = async (type: "pdf" | "excel") => {
    if (type === "pdf") {
      const blob = await generarReportePDF();
      downloadBlob(blob, "reporte_de_personal.pdf");
    } else {
      const blob = await generarReporteExcel();
      downloadBlob(blob, "reporte_de_personal.xlsx");
    }
  };

  const cargarPersonal = async (page: number) => {
    const response = await listarPersonalFiltrado(filtros, page, pageSize);
    setPageData(response);
    setCurrentPage(page);
  };

  useEffect(() => {
    cargarPersonal(0);
  }, []);

  const handleRefresh = () => {
    cargarPersonal(currentPage);
  };

  return (
    <div className={classes.mainpg}>
      <div>
        <Title order={2} className={classes.pageTitle}>
          Personal
        </Title>
      </div>

      <div className={classes.subpg}>
        <div className={classes.btnBar}>
          <Link to={"/personal/registrar"} className={classes.createBtn}>
            <Button leftSection={<BsPlusLg size={15} />}>
              Registrar Personal
            </Button>
          </Link>
          <Menu position="top-end" withinPortal radius="md">
            <Menu.Target>
              <Button
                rightSection={<TbChevronDown size={18} />}
                className={classes.reportBtn}
              >
                Generar Reporte
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<TbFileTypePdf size={16} />}
                onClick={() => handleGenerateReport("pdf")}
              >
                PDF
              </Menu.Item>
              <Menu.Item
                leftSection={<TbFileTypeXls size={16} />}
                onClick={() => handleGenerateReport("excel")}
              >
                Excel
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
        <div className={classes.titleRule} />
        <div className={classes.filterBar}>
          <TextInput
            placeholder="Buscar por nombre o identificación..."
            leftSection={<AiOutlineSearch size={16} />}
            value={filtros.searchTerm ?? ""}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                searchTerm: e.target.value === "" ? null : e.target.value,
              })
            }
            classNames={{ input: classes.input, root: classes.field }}
          />

          <Select
            placeholder="Todas las especialidades"
            value={filtros.especialidad ?? ""}
            onChange={(value) =>
              setFiltros({
                ...filtros,
                especialidad: value === "" ? null : value,
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

          <Select
            placeholder="Todos"
            value={filtros.activo === null ? "" : filtros.activo.toString()}
            onChange={(value) =>
              setFiltros({
                ...filtros,
                activo: value === "" ? null : value === "true",
              })
            }
            data={[
              { value: "", label: "Todos" },
              { value: "true", label: "Activos" },
              { value: "false", label: "Inactivos" },
            ]}
            classNames={{ input: classes.input, root: classes.field }}
          />

          <Button
            onClick={() => cargarPersonal(0)}
            className={classes.searchButton}
            aria-label="Buscar"
          >
            Buscar
          </Button>
        </div>

        <PersonalTable
          personal={pageData?.content ?? []}
          onRefresh={handleRefresh}
        />

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
  );
}
