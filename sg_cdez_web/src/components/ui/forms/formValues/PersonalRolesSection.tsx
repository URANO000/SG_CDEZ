import { Group, Paper, Title } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";

import { FormField } from "../../../common/FormField";
import type { PersonalFormValues } from "./PersonalFormValues";
import { ESPECIALIDADES, ROLES } from "../../../../services/interfaces/personalCreateRequest";
import classes from "../../styleModules/PersonalForm.module.css";

interface PersonalRolesSectionProps {
    form: UseFormReturnType<PersonalFormValues>;
}

export function PersonalRolesSection({
    form,
}: PersonalRolesSectionProps) {
    return (
        <Paper className={classes.card}>
            <Group className={classes.sectionHeader}>
                <Title order={4} className={classes.sectionTitle}>
                    Roles en el centro
                </Title>
            </Group>

            <div className={classes.formGrid}>
                <FormField
                    label="Rol"
                    required
                    error={form.errors.rol}
                >
                    <select
                        className={classes.select}
                        {...form.getInputProps("rol")}
                    >
                        <option value="" disabled>
                            Seleccionar rol
                        </option>
                        {ROLES.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField
                    label="Especialidad"
                    required
                    error={form.errors.especialidad}
                >
                    <select
                        className={classes.select}
                        {...form.getInputProps("especialidad")}
                    >
                        <option value="" disabled>
                            Seleccionar especialidad
                        </option>

                        {ESPECIALIDADES.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </FormField>
            </div>
        </Paper>
    );
}