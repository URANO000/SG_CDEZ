import {
    ActionIcon,
    Button,
    Group,
    Paper,
    Stack,
    Text,
    Title,
    Tooltip,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { BsPersonCheck, BsPlus, BsTrash } from "react-icons/bs";
import { emptyContacto } from "./PersonalFormValues";
import type { PersonalFormValues } from "./PersonalFormValues";
import classes from "../../styleModules/PersonalForm.module.css";

interface PersonalContactsSectionProps {
    form: UseFormReturnType<PersonalFormValues>;
}

export function PersonalContactsSection({
    form,
}: PersonalContactsSectionProps) {
    const agregarContacto = () => {
        form.insertListItem("contactos", emptyContacto());
    };

    const eliminarContacto = (index: number) => {
        form.removeListItem("contactos", index);
    };

    const usarComoUsuario = (correo: string) => {
        form.setFieldValue("usuario", correo);
    };

    return (
        <Paper className={classes.card}>
            <Group justify="space-between" className={classes.sectionHeader}>
                <Title order={4} className={classes.sectionTitle}>
                    Contactos
                </Title>

                <Button
                    type="button"
                    size="xs"
                    variant="light"
                    leftSection={<BsPlus size={16} />}
                    onClick={agregarContacto}
                >
                    Agregar contacto
                </Button>
            </Group>

            <Stack>
                {form.values.contactos.map((contacto, index) => {
                    const tipoPath = `contactos.${index}.tipoValor`;
                    const valorPath = `contactos.${index}.valor`;

                    return (
                        <div key={contacto.contactoId ?? `nuevo-${index}`}>
                            <div className={classes.contactRow}>
                                <select
                                    className={classes.select}
                                    {...form.getInputProps(tipoPath)}
                                >
                                    <option value="" disabled>
                                        Tipo
                                    </option>
                                    <option value="TELEFONO">
                                        Número telefónico
                                    </option>
                                    <option value="CORREO">
                                        Correo electrónico
                                    </option>
                                </select>

                                <input
                                    className={classes.input}
                                    type={
                                        contacto.tipoValor === "CORREO"
                                            ? "email"
                                            : "text"
                                    }
                                    placeholder={
                                        contacto.tipoValor === "CORREO"
                                            ? "correo@ejemplo.com"
                                            : "Número de teléfono"
                                    }
                                    {...form.getInputProps(valorPath)}
                                />

                                <Group
                                    gap={4}
                                    wrap="nowrap"
                                    className={classes.contactActions}
                                >
                                    {contacto.tipoValor === "CORREO" &&
                                        contacto.valor && (
                                            <Tooltip label="Utilizar como usuario">
                                                <ActionIcon
                                                    type="button"
                                                    variant="subtle"
                                                    className={
                                                        classes.actionEmail
                                                    }
                                                    aria-label="Usar como usuario"
                                                    onClick={() =>
                                                        usarComoUsuario(
                                                            contacto.valor
                                                        )
                                                    }
                                                >
                                                    <BsPersonCheck size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        )}

                                    <ActionIcon
                                        type="button"
                                        variant="subtle"
                                        color="red"
                                        aria-label="Eliminar contacto"
                                        onClick={() =>
                                            eliminarContacto(index)
                                        }
                                    >
                                        <BsTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            </div>

                            {(form.errors[tipoPath] ||
                                form.errors[valorPath]) && (
                                <Text size="xs" c="red" mt={4}>
                                    {String(
                                        form.errors[tipoPath] ??
                                            form.errors[valorPath]
                                    )}
                                </Text>
                            )}
                        </div>
                    );
                })}

                {form.values.contactos.length === 0 && (
                    <Text className={classes.emptyText}>
                        No hay contactos registrados.
                    </Text>
                )}
            </Stack>
        </Paper>
    );
}