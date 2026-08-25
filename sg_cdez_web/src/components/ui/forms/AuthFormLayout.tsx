import {
    Container,
    Paper,
    Title,
    Text
} from "@mantine/core";
import classes from "../styleModules/FormControl.module.css"

interface AuthFormLayoutProps {
    title: string;

    subtitle: string;

    onSubmit: React.SubmitEventHandler<HTMLFormElement>;

    children: React.ReactNode;
}

export function AuthFormLayout({
    title,
    subtitle,
    onSubmit,
    children,
}: AuthFormLayoutProps) {
    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                {title}
            </Title>
            <Text c="dimmed" fz="sm" ta="center">
                {subtitle}
            </Text>

            <Paper
                withBorder
                shadow="sm"
                p={22}
                mt={30}
                radius="md"
            >
                <form onSubmit={onSubmit}>
                    {children}
                </form>
            </Paper>
        </Container>
    );
}