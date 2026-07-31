import { useState } from "react";
import { useNavigate } from "react-router";
import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    Paper,
    PasswordInput,
    TextInput,
    Title,
} from "@mantine/core";

import { iniciarSesion } from "../../../services/authService";
import classes from "./LoginForm.module.css";
import { useAuth } from "../../../services/authContext";

export function LoginForm() {
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { refreshSession } = useAuth();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        try {
            await iniciarSesion(usuario, contrasena);
            await refreshSession();
            navigate("/");
        } catch (error) {
            alert("Error :(");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Bienvenido/a
            </Title>

            <Paper
                component="form"
                onSubmit={handleSubmit}
                withBorder
                shadow="sm"
                p={22}
                mt={30}
                radius="md"
            >
                <TextInput
                    label="Usuario"
                    placeholder="usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.currentTarget.value)}
                    required
                    radius="md"
                />

                <PasswordInput
                    label="Contraseña"
                    placeholder="Tu contraseña"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.currentTarget.value)}
                    required
                    mt="md"
                    radius="md"
                />

                <Group justify="space-between" mt="lg">
                    <Checkbox label="Recordarme" />

                    <Anchor component="button" size="sm">
                        ¿Olvidaste tu contraseña?
                    </Anchor>
                </Group>

                <Button
                    type="submit"
                    loading={loading}
                    fullWidth
                    mt="xl"
                    radius="md"
                >
                    Iniciar Sesión
                </Button>
            </Paper>
        </Container>
    );
}