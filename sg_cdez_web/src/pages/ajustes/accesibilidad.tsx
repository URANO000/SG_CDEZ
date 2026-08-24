import { useState } from "react";

import {
  Button,
  Paper,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";

import {
  defaultAccessibilitySettings,
  loadAccessibilitySettings,
  saveAccessibilitySettings,
  type AccessibilitySettings,
  type FontSizePreference,
} from "../../utils/accessibility";

import classes from "../../components/ui/styleModules/PersonalForm.module.css";

export function Accesibilidad() {
  const [settings, setSettings] = useState<AccessibilitySettings>(
    loadAccessibilitySettings(),
  );

  function actualizar(nuevosValores: Partial<AccessibilitySettings>) {
    const actualizado = {
      ...settings,
      ...nuevosValores,
    };

    setSettings(actualizado);
    saveAccessibilitySettings(actualizado);
  }

  function restablecer() {
    setSettings(defaultAccessibilitySettings);

    saveAccessibilitySettings(defaultAccessibilitySettings);
  }

  return (
    <div className={classes.container}>
      <Paper className={classes.headerCard}>
        <Text className={classes.label}>Ajustes</Text>

        <Title order={2} className={classes.title}>
          Accesibilidad
        </Title>

        <Text size="sm" className={classes.subtitle}>
          Personalice la visualización del sistema según sus necesidades.
        </Text>
      </Paper>

      <Paper className={classes.card}>
        <Stack gap="xl">
          <div>
            <Title order={4} className={classes.sectionTitle}>
              Tamaño del texto
            </Title>

            <Text size="sm" c="dimmed" mt={4} mb="md">
              Ajuste el tamaño general del texto del sistema.
            </Text>

            <SegmentedControl
              fullWidth
              value={settings.fontSize}
              onChange={(value) =>
                actualizar({
                  fontSize: value as FontSizePreference,
                })
              }
              data={[
                {
                  value: "normal",
                  label: "Normal",
                },
                {
                  value: "large",
                  label: "Grande",
                },
                {
                  value: "extra-large",
                  label: "Muy grande",
                },
              ]}
            />
          </div>

          <div>
            <Title order={4} className={classes.sectionTitle}>
              Contraste
            </Title>

            <Text size="sm" c="dimmed" mt={4} mb="md">
              Mejore la diferenciación entre texto, fondos y componentes.
            </Text>

            <Switch
              label="Usar contraste alto"
              checked={settings.highContrast}
              onChange={(event) =>
                actualizar({
                  highContrast: event.currentTarget.checked,
                })
              }
            />
          </div>

          <div>
            <Title order={4} className={classes.sectionTitle}>
              Movimiento
            </Title>

            <Text size="sm" c="dimmed" mt={4} mb="md">
              Reduzca animaciones y transiciones de la interfaz.
            </Text>

            <Switch
              label="Reducir animaciones"
              checked={settings.reduceMotion}
              onChange={(event) =>
                actualizar({
                  reduceMotion: event.currentTarget.checked,
                })
              }
            />
          </div>

          <Button variant="default" onClick={restablecer}>
            Restablecer valores predeterminados
          </Button>
        </Stack>
      </Paper>
    </div>
  );
}
