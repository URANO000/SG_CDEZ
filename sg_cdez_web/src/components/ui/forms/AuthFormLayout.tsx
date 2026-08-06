import {
    Container,
    Paper,
    Title,
} from "@mantine/core";
import classes from "./LoginForm.module.css";

interface AuthFormLayoutProps {
    title: string;

    onSubmit: React.SubmitEventHandler<HTMLFormElement>;

    children: React.ReactNode;
}

export function AuthFormLayout({
    title,
    onSubmit,
    children,
}: AuthFormLayoutProps) {
    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                {title}
            </Title>

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