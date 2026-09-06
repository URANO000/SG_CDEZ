import {
  Button,
  Text,
  Title,
  Card,
  ThemeIcon,
  Stack,
  Group,
} from "@mantine/core";
import { useAuth } from "../../services/authContext";
import { TbDownload, TbFileTypePdf, TbFileDescription } from "react-icons/tb";
import classes from "../../components/ui/tables/Filter.module.css";

const manualesPorRol: Record<string, { file: string; label: string }> = {
  ROLE_ADMIN: {
    file: "/Manuales de Usuario_Admin.pdf",
    label: "Manual de Usuario - Administrador",
  },
  ROLE_PERSONAL: {
    file: "/Manual de Usuario_Normal.pdf",
    label: "Manual de Usuario - Personal",
  },
  ROLE_AYUDANTE: {
    file: "/Manual de Usuario_Ayudante.pdf",
    label: "Manual de Usuario - Ayudante",
  },
};

export function Documentacion() {
  const { user } = useAuth();
  const manual = manualesPorRol[user?.rol ?? ""];

  return (
    <div className={classes.mainpg}>
      <Title order={2} className={classes.pageTitle}>
        Documentación
      </Title>

      <div
        className={classes.subpg}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Card withBorder radius="md" p="xl" maw={520}>
          <Stack align="center" gap="sm">
            <ThemeIcon size={56} radius="xl" variant="light" color="blue">
              <TbFileDescription size={30} />
            </ThemeIcon>

            <Title order={4}>Manual de Usuario</Title>

            <Text c="dimmed" ta="center" size="sm">
              A continuación se encuentra un archivo PDF para descargar. Este es
              un manual de usuario en caso de dudas o consultas.
            </Text>

            {manual ? (
              <a href={manual.file} download style={{ textDecoration: "none" }}>
                <Button
                  mt="sm"
                  size="md"
                  leftSection={<TbFileTypePdf size={18} />}
                  rightSection={<TbDownload size={16} />}
                  className={classes.reportBtn}
                >
                  {manual.label}
                </Button>
              </a>
            ) : (
              <Group mt="sm">
                <Text c="dimmed" fs="italic">
                  No hay manual disponible para tu rol.
                </Text>
              </Group>
            )}
          </Stack>
        </Card>
      </div>
    </div>
  );
}
