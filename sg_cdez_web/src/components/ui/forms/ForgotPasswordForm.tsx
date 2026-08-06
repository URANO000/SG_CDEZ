import { Button, TextInput, Anchor, Box, Group } from "@mantine/core";
import { AuthFormLayout } from "./AuthFormLayout";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { restablecerContrasena } from "../../../services/authService";
import { BsArrowLeftShort } from "react-icons/bs";
import { Link } from "react-router";


export function ForgotPasswordForm() {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            email: '',
        },

        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Formato de correo inválido')
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            await restablecerContrasena(values.email);

        } catch (error) {

        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthFormLayout title="¿Olvidaste tu contraseña?" onSubmit={form.onSubmit(handleSubmit)} subtitle="Introduce tu usuario para obtener un enlace de restablecimiento.">
            <TextInput
                required
                label="Usuario"
                placeholder="ejemplo@gmail.com"
                {...form.getInputProps('email')}
            />

            <Button
                type="submit"
                fullWidth
                loading={loading}
                mt="lg"
                radius="md">
                Restablecer contraseña
            </Button>

            <Link to="/login">
                <Anchor component="button" c="dimmed" size="xs" mt={8}>
                    <Group justify="center" gap={1}>
                        <BsArrowLeftShort size={12} />
                        <Box ml={5}>Regresar a inicio de sesión</Box>
                    </Group>
                </Anchor>
            </Link>
        </AuthFormLayout>
    )
}