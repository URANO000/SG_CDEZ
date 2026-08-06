import { Anchor, PasswordInput } from "@mantine/core";
import { AuthFormLayout } from "./AuthFormLayout";
import { Button } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router";
import { activarCuenta } from "../../../services/authService";
import {useForm} from "@mantine/form";

export function ActivateAccountForm({ token }: { token: string }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            contrasena: '',
            confirmarContrasena: '',
        },
        validate: {
            contrasena: (val) => {
                if(val.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
                if (!/[A-Z]/.test(val)) return 'La contraseña debe contener al menos una letra mayúscula';
                if(!/[a-z]/.test(val)) return 'La contraseña debe contener al menos una letra minúscula';
                if(!/[0-9]/.test(val)) return 'La contaseña debe contener al menos un número';
                if(!/[^A-Za-z0-9]/.test(val)) return 'La contraseña debe contener al menos un carácter especial';
                return null;
            },
            confirmarContrasena: (val, values) => 
                val !== values.contrasena ? 'Las contaseñas no coinciden' : null,
        },

    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);

        try {
            await activarCuenta(token, values.contrasena, values.confirmarContrasena);
            navigate("/login");

        } catch (error) {
            alert("Error al activar la cuenta/ voy a cambiar esto a un modal");

        } finally {
            setLoading(false);
        }


    };

    return (
        <AuthFormLayout title="Activar Cuenta" onSubmit={form.onSubmit(handleSubmit)} subtitle="Ingresa una contraseña para activar tu cuenta.">
            <PasswordInput
                label="Contraseña"
                placeholder="Tu contraseña"
                {...form.getInputProps('contrasena')}
                required
                mt="md"
                radius="md"
            />
            <Anchor
                c="bright"
                opacity={0.85}
                size="xs"
            >
                Tu contraseña debe tener al menos 8 caracteres y contener letras mayúsculas y minúsculas, un número y un carácter especial.
            </Anchor>

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


        </AuthFormLayout>
    )
}