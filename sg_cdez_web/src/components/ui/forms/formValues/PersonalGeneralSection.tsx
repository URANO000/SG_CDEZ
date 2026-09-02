import { Group, Paper, Title } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { FormField } from "../../../common/FormField";
import type { PersonalFormValues } from "./PersonalFormValues";
import classes from "../../styleModules/PersonalForm.module.css";
import { TIPOIDENTIFICACION } from "../../../../services/interfaces/personalCreateRequest";

interface PersonalGeneralSectionProps {
    form: UseFormReturnType<PersonalFormValues>;
}

export function PersonalGeneralSection({
    form,
}: PersonalGeneralSectionProps) {
    return (
        <Paper className={classes.card}>
            <Group className={classes.sectionHeader}>
                <Title order={4} className={classes.sectionTitle}>
                    Información general
                </Title>
            </Group>

            <div className={classes.formGrid}>
                <FormField
                    label="Primer nombre"
                    required
                    error={form.errors.primerNombre}
                >
                    <input
                        className={classes.input}
                        {...form.getInputProps("primerNombre")}
                    />
                </FormField>

                <FormField label="Segundo nombre">
                    <input
                        className={classes.input}
                        {...form.getInputProps("segundoNombre")}
                    />
                </FormField>

                <FormField
                    label="Primer apellido"
                    required
                    error={form.errors.primerApellido}
                >
                    <input
                        className={classes.input}
                        {...form.getInputProps("primerApellido")}
                    />
                </FormField>

                <FormField label="Segundo apellido">
                    <input
                        className={classes.input}
                        {...form.getInputProps("segundoApellido")}
                    />
                </FormField>

                <FormField
                    label="Tipo de identificación"
                    required
                    error={form.errors.tipoIdentificacion}
                >
                    <select
                        className={classes.select}
                        {...form.getInputProps("tipoIdentificacion")}
                    >
                        <option value="" disabled>
                            Tipo de identificación
                        </option>

                        {TIPOIDENTIFICACION.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField
                    label="Identificación"
                    required
                    error={form.errors.identificacion}
                >
                    <input
                        className={classes.input}
                        {...form.getInputProps("identificacion")}
                    />
                </FormField>

                <FormField label="Carné">
                    <input
                        className={classes.input}
                        {...form.getInputProps("carnet")}
                    />
                </FormField>

                <FormField label="Dirección">
                    <input
                        className={classes.input}
                        {...form.getInputProps("direccion")}
                    />
                </FormField>

                <FormField label="Usuario" fullWidth>
                    <input
                        className={classes.input}
                        placeholder="Puede completarse desde un contacto de correo abajo"
                        {...form.getInputProps("usuario")}
                    />
                </FormField>
            </div>
        </Paper>
    );
}