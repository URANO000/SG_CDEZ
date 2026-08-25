import { Anchor, PasswordInput } from "@mantine/core";
import { AuthFormLayout } from "./AuthFormLayout";
import { Button } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router";
import { activarCuenta, reenviarVerificacion } from "../../../services/authService";
import { useForm } from "@mantine/form";
import { PasswordStrengthInput } from "../../../components/common/Passwordstrengthinput";
import axios from "axios";
import { notifications } from "@mantine/notifications";

export function ActivateAccountForm({ token }: { token: string }) {
    const [loading, setLoading] = useState(false);
    const [tokenExpired, setTokenExpired] = useState(false);
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            contrasena: '',
            confirmarContrasena: '',
        },
        validate: {
            contrasena: (val) => {
                if (val.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
                if (!/[A-Z]/.test(val)) return 'La contraseña debe contener al menos una letra mayúscula';
                if (!/[a-z]/.test(val)) return 'La contraseña debe contener al menos una letra minúscula';
                if (!/[0-9]/.test(val)) return 'La contaseña debe contener al menos un número';
                if (!/[^A-Za-z0-9]/.test(val)) return 'La contraseña debe contener al menos un carácter especial';
                return null;
            },
            confirmarContrasena: (val, values) =>
                val !== values.contrasena ? 'Las contaseñas no coinciden' : null,
        },

    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        setTokenExpired(false);

        try {
            await activarCuenta(token, values.contrasena, values.confirmarContrasena);
            notifications.show({
                title: "Cuenta activada",
                message: "La cuenta fue activada con éxito.",
                color: "green",
            });
            navigate("/login");

        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 410) {
                notifications.show({
                    title: "Error de activación",
                    message: error.response.data?.message,
                    color: "red",
                });
                setTokenExpired(true);
            } else {
                notifications.show({
                    title: "Error de activación",
                    message: "No fue posible activar la cuenta.",
                    color: "red",
                });
            }

        } finally {
            setLoading(false);
        }


    };

    return (
        <AuthFormLayout title="Activar Cuenta" onSubmit={form.onSubmit(handleSubmit)} subtitle="Ingresa una contraseña para activar tu cuenta.">

            <PasswordStrengthInput
                {...form.getInputProps("contrasena")}
                mt="md"
                radius="md"
            />

            <PasswordInput
                label="Confirmar contraseña"
                placeholder="Confirmar contraseña"
                {...form.getInputProps('confirmarContrasena')}
                required
                mt="md"
                radius="md"
            />

            <Button
                type="submit"
                fullWidth
                loading={loading}
                mt="xl"
                radius="md"
            >
                Activar cuenta
            </Button>

            {
                tokenExpired && (
                    <>
                        <Anchor c="red" size="sm" mt="md">
                            El código de verificación ha expirado.
                        </Anchor>

                        <Button type="button" variant="light" fullWidth loading={resending} mt="sm" radius="md" onClick={async () => {
                            setResending(true);

                            try {
                                await reenviarVerificacion(token);
                                notifications.show({
                                    title: "Reenviar verificacion",
                                    message: "Se ha enviado un nuevo correo de verificación. Por favor revisa tu bandeja de entrada.",
                                    color: "orange",
                                });
                                setTokenExpired(false);
                            } catch (error) {
                                notifications.show({
                                    title: "Reenviar verificacion",
                                    message: "No se pudo reenviar el código.",
                                    color: "red",
                                });
                            } finally {
                                setResending(false);
                            }
                        }}>
                            Reenviar código
                        </Button>
                    </>
                )
            }


        </AuthFormLayout>
    )
}