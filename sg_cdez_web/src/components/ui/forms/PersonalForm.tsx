import { Container, Paper, Title, Text, Group, ActionIcon } from "@mantine/core";
import { useNavigate } from "react-router";
import { BsArrowLeft } from "react-icons/bs";
import classes from "./PersonalForm.module.css";

interface PersonalFormProps {
    title: string;
    subtitle: string;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    children: React.ReactNode;
}

export function PersonalForm({
    title,
    subtitle,
    onSubmit,
    children
}: PersonalFormProps) {
    const navigate = useNavigate();

    return (
        <Container className={classes.container}>
            <Group justify="space-between" className={classes.topBar}>
                <ActionIcon
                    variant="subtle"
                    onClick={() => navigate(-1)}
                    aria-label="Volver">
                    <BsArrowLeft size={18} />
                </ActionIcon>
            </Group>

            <Paper className={classes.headerCard}>
                <Text className={classes.label}>Personal</Text>
                <Title order={2} className={classes.title}>
                    {title}
                </Title>
                <Text size="sm" className={classes.subtitle}>
                    {subtitle}
                </Text>
            </Paper>

            <form onSubmit={onSubmit} className={classes.form}>
                {children}
            </form>
        </Container>
    );
}