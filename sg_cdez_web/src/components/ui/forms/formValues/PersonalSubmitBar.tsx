import { Button, Group } from "@mantine/core";
import classes from "../../styleModules/PersonalForm.module.css";

interface PersonalSubmitBarProps {
    loading: boolean;
    submitLabel: string;
    onCancel: () => void;
    cancelLabel?: string;
    disabled?: boolean;
}

export function PersonalSubmitBar({
    loading,
    submitLabel,
    onCancel,
    cancelLabel = "Cancelar",
    disabled = false,
}: PersonalSubmitBarProps) {
    return (
        <Group
            justify="flex-end"
            className={classes.submitBar}
        >
            <Button
                type="button"
                variant="default"
                disabled={loading || disabled}
                onClick={onCancel}
            >
                {cancelLabel}
            </Button>

            <Button
                type="submit"
                loading={loading}
                disabled={disabled}
            >
                {submitLabel}
            </Button>
        </Group>
    );
}