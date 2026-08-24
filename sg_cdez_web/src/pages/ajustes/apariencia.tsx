import {
  Paper,
  Radio,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import {
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";

import classes from "../../components/ui/forms/PersonalForm.module.css";

export function Apariencia() {
  const { setColorScheme } = useMantineColorScheme();

  const colorScheme = useComputedColorScheme("light");

  return (
    <div className={classes.container}>
      <Paper className={classes.headerCard}>
        <Text className={classes.label}>
          Ajustes
        </Text>

        <Title order={2} className={classes.title}>
          Apariencia
        </Title>

        <Text size="sm" className={classes.subtitle}>
          Personalice la apariencia visual del sistema.
        </Text>
      </Paper>

      <Paper className={classes.card}>
        <Stack gap="md">
          <div>
            <Title order={4} className={classes.sectionTitle}>
              Tema del sistema
            </Title>

            <Text size="sm" c="dimmed" mt={4}>
              Seleccione el modo de visualización que desea utilizar.
            </Text>
          </div>

          <Radio.Group
            value={colorScheme}
            onChange={(value) =>
              setColorScheme(value as "light" | "dark")
            }
          >
            <Stack gap="sm">
              <Radio
                value="light"
                label="Modo claro"
                description="Utiliza fondos claros y texto oscuro."
              />

              <Radio
                value="dark"
                label="Modo oscuro"
                description="Utiliza fondos oscuros y texto claro."
              />
            </Stack>
          </Radio.Group>
        </Stack>
      </Paper>
    </div>
  );
}