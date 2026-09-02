import { Text } from "@mantine/core";
import type { ReactNode } from "react";
import classes from "../ui/styleModules/PersonalForm.module.css";

interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: ReactNode;
    fullWidth?: boolean;
    children: ReactNode;
}

export function FormField({
    label,
    required = false,
    error,
    fullWidth = false,
    children,
}: FormFieldProps) {
    return (
        <div
            className={`${classes.fieldGroup} ${
                fullWidth ? classes.fieldFull : ""
            }`}
        >
            <label className={classes.fieldLabel}>
                {label}
                {required && <span className={classes.required}>*</span>}
            </label>

            {children}

            {error && (
                <Text size="xs" c="red">
                    {String(error)}
                </Text>
            )}
        </div>
    );
}