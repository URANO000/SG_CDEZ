import { useEffect, useState } from "react";
import { Alert, Group, Loader, Pagination, Title } from "@mantine/core";

import { AuditoriaTable } from "../../components/ui/tables/AuditoriaTable";
import { listarAuditorias } from "../../services/auditoriaService";

import type { AuditoriaResponse } from "../../services/interfaces/auditoriaInterface";

import classes from "../adultosMayores/AdultosMayores.module.css";
import filterClasses from "../../components/ui/tables/Filter.module.css";

export function Auditoria() {
  const [auditorias, setAuditorias] = useState<AuditoriaResponse[]>([]);

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [, setAuditoriaSeleccionada] = useState<AuditoriaResponse | null>(null);

  useEffect(() => {
    async function cargarAuditorias() {
      try {
        setCargando(true);
        setError(null);

        const respuesta = await listarAuditorias({}, pagina - 1, 10);

        setAuditorias(respuesta.content);
        setTotalPaginas(respuesta.totalPages);
      } catch (err) {
        console.error("Error al cargar auditorías:", err);

        setError("No fue posible cargar los registros de auditoría.");
      } finally {
        setCargando(false);
      }
    }

    cargarAuditorias();
  }, [pagina]);

  return (
    <div className={classes.container}>
      {/* TÍTULO */}
      <Group justify="space-between" align="center" className={classes.heading}>
        <Title order={2} className={classes.pageTitle}>
          Auditoría
        </Title>
      </Group>

      <div className={classes.titleRule} />

      {/* ERROR */}
      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}

      {/* CARGANDO */}
      {cargando ? (
        <Group justify="center" py="xl">
          <Loader color="var(--color-primary)" />
        </Group>
      ) : (
        <>
          {/* TABLA */}
          <AuditoriaTable
            auditorias={auditorias}
            onConsultar={setAuditoriaSeleccionada}
          />

          {/* PAGINACIÓN */}
          {totalPaginas > 1 && (
            <Group justify="center" className={filterClasses.paginationBar}>
              <Pagination
                value={pagina}
                onChange={setPagina}
                total={totalPaginas}
              />
            </Group>
          )}
        </>
      )}
    </div>
  );
}
