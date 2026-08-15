import { Container, Title, Paper, Text } from "@mantine/core";


interface PersonalFormProps {
    title: string;

    subtitle: string;

    onSubmit: React.SubmitEventHandler<HTMLFormElement>;

    children: React.ReactNode;
}

export function PersonalForm({
    title,
    subtitle,
    onSubmit,
    children}: PersonalFormProps) {
    return (
        <Container>
            <Title>
                {title}
            </Title>
            <Text>
                {subtitle}
            </Text>

            <Paper>
                <form onSubmit={onSubmit}>
                    {children}
                </form>
            </Paper>
        </Container>
    )
}