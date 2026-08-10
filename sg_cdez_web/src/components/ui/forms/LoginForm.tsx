import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import {
    Anchor,
    Button,
    Checkbox,
    Group,
    PasswordInput,
    TextInput
} from "@mantine/core";

import { iniciarSesion } from "../../../services/authService";
import { useAuth } from "../../../services/authContext";
import { AuthFormLayout } from "./AuthFormLayout";

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
        <AuthFormLayout title="Bienvenido/a" onSubmit={handleSubmit} subtitle="Inicia sesión para ingresar al sistema.">
            <TextInput
                label="Usuario"
                placeholder="ejemplo@gmail.com"
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

                <Link to="/reestablecer-contrasena">
                    <Anchor component="button" size="sm">
                        ¿Olvidaste tu contraseña?
                    </Anchor>
                </Link>
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
        </AuthFormLayout>
    );
}