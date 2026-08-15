import { useEffect, useState } from "react";

import {
  ActionIcon,
  Alert,
  Badge,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Tabs,
  Text,
  Title,
} from "@mantine/core";

import { BsArrowLeft } from "react-icons/bs";

import { useNavigate, useParams } from "react-router";

import { obtenerAdultoMayorPorId } from "../../services/adultoMayorService";

import type { AdultoMayorResponse } from "../../services/interfaces/adultoMayorInterface";

import classes from "./Expediente.module.css";

interface CampoInformacion {
  etiqueta: string;
  valor: string;
}

function mostrarFecha(fecha: string | null): string {
  if (!fecha) {
    return "No registrada";
  }

  return new Intl.DateTimeFormat("es-CR").format(new Date(fecha));
}

function mostrarSexo(sexo: string): string {
  if (sexo === "H") {
    return "Hombre";
  }

  if (sexo === "M") {
    return "Mujer";
  }

  return sexo;
}

function Campo({ etiqueta, valor }: CampoInformacion) {
  return (
    <div>
      <Text className={classes.label}>{etiqueta}</Text>

      <Text className={classes.value}>{valor}</Text>
    </div>
  );
}

export function AdultoMayorExpediente() {
  const { adultoId } = useParams();
  const navigate = useNavigate();

  const [adultoMayor, setAdultoMayor] = useState<AdultoMayorResponse | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  useEffect(() => {
    const id = adultoId;

    if (!id) {
      return;
    }

    obtenerAdultoMayorPorId(id)
      .then(setAdultoMayor)
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [adultoId]);

  if (!adultoId) {
    return (
      <Alert color="red">No se indicó el expediente que desea consultar.</Alert>
    );
  }

  if (loading) {
    return (
      <div className={classes.loadingState}>
        <Loader color="var(--color-primary)" />
      </div>
    );
  }

  if (error || !adultoMayor) {
    return (
      <Alert color="red">
        No se pudo cargar el expediente del adulto mayor.
      </Alert>
    );
  }

  const resumen: CampoInformacion[] = [
    {
      etiqueta: "Nombre completo",
      valor: adultoMayor.nombreCompleto,
    },
    {
      etiqueta: "Identificación",
      valor: adultoMayor.identificacion,
    },
    {
      etiqueta: "Fecha de ingreso",
      valor: mostrarFecha(adultoMayor.fechaIngreso),
    },
    {
      etiqueta: "Nacionalidad",
      valor: adultoMayor.nacionalidad,
    },
    {
      etiqueta: "Sexo",
      valor: mostrarSexo(adultoMayor.sexo),
    },
    {
      etiqueta: "Estado",
      valor: adultoMayor.activo,
    },
  ];

  const informacionGeneral: CampoInformacion[] = [
    {
      etiqueta: "Tipo de identificación",
      valor: adultoMayor.tipoIdentificacion,
    },
    {
      etiqueta: "Identificación",
      valor: adultoMayor.identificacion,
    },
    {
      etiqueta: "Fecha de nacimiento",
      valor: mostrarFecha(adultoMayor.fechaNacimiento),
    },
    {
      etiqueta: "Nacionalidad",
      valor: adultoMayor.nacionalidad,
    },
    {
      etiqueta: "Dirección",
      valor: adultoMayor.direccion,
    },
    {
      etiqueta: "Escolaridad",
      valor: adultoMayor.escolaridad,
    },
    {
      etiqueta: "Grupo familiar",
      valor: adultoMayor.grupoFamiliar ?? "No registrado",
    },
    {
      etiqueta: "Recibe pensión",
      valor: adultoMayor.pension ? "Sí" : "No",
    },
    {
      etiqueta: "Funcionalidad física",
      valor: adultoMayor.funcionalidadFisica ?? "No registrada",
    },
    {
      etiqueta: "Ayuda biomecánica",
      valor: adultoMayor.ayudaBiomecanica ? "Sí" : "No",
    },
  ];

  return (
    <div className={classes.container}>
      <Group gap="sm" className={classes.topBar}>
        <ActionIcon
          variant="subtle"
          aria-label="Volver al listado"
          onClick={() => {
            navigate("/adultosMayores");
          }}
        >
          <BsArrowLeft size={18} />
        </ActionIcon>

        <div>
          <Title order={2} className={classes.pageTitle}>
            Adultos Mayores
          </Title>

          <Text size="sm" className={classes.breadcrumb}>
            Adultos Mayores » Expediente
          </Text>
        </div>
      </Group>

      <Paper className={classes.headerCard}>
        <Group justify="space-between" wrap="wrap">
          <div>
            <Text className={classes.label}>Expediente digital</Text>

            <Title order={3} className={classes.personName}>
              {adultoMayor.nombreCompleto}
            </Title>

            <Text size="sm" className={classes.secondaryText}>
              {adultoMayor.tipoIdentificacion}
              {": "}
              {adultoMayor.identificacion}
            </Text>
          </div>

          <Badge
            size="lg"
            className={
              adultoMayor.activo === "Activo"
                ? classes.badgeActive
                : classes.badgeInactive
            }
          >
            {adultoMayor.activo}
          </Badge>
        </Group>
      </Paper>

      <Tabs defaultValue="resumen" className={classes.tabs}>
        <Tabs.List>
          <Tabs.Tab value="resumen">Resumen</Tabs.Tab>

          <Tabs.Tab value="general">Información general</Tabs.Tab>

          <Tabs.Tab value="encargados">Encargados legales</Tabs.Tab>

          <Tabs.Tab value="epicrisis">Epicrisis</Tabs.Tab>

          <Tabs.Tab value="documentos">Documentos</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="resumen" className={classes.panel}>
          <SimpleGrid
            cols={{
              base: 1,
              sm: 2,
              lg: 3,
            }}
            spacing="xl"
          >
            {resumen.map((campo) => (
              <Campo
                key={campo.etiqueta}
                etiqueta={campo.etiqueta}
                valor={campo.valor}
              />
            ))}
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="general" className={classes.panel}>
          <SimpleGrid
            cols={{
              base: 1,
              sm: 2,
            }}
            spacing="xl"
          >
            {informacionGeneral.map((campo) => (
              <Campo
                key={campo.etiqueta}
                etiqueta={campo.etiqueta}
                valor={campo.valor}
              />
            ))}
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="encargados" className={classes.panelPlaceholder}>
          La información de encargados legales se integrará posteriormente.
        </Tabs.Panel>

        <Tabs.Panel value="epicrisis" className={classes.panelPlaceholder}>
          El historial de epicrisis se integrará posteriormente.
        </Tabs.Panel>

        <Tabs.Panel value="documentos" className={classes.panelPlaceholder}>
          Los documentos del expediente se integrarán posteriormente.
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
