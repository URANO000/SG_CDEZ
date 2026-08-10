import { Button, TextInput} from "@mantine/core";
import { AuthFormLayout } from "./AuthFormLayout";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { reenviarVerificacion } from "../../../services/authService";



export function ResendVerificationForm(){
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
            await reenviarVerificacion(values.email);
            alert("Si el correo ingresado está registrado, recibirá un enlace para activar su cuenta.");

        } catch (error) {
            alert("Error :(");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthFormLayout title="Reenviar verificación de correo" onSubmit={form.onSubmit(handleSubmit)} subtitle="Introduce tu usuario para obtener un enlace de verificación.">
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
                Reenviar verificación
            </Button>
        </AuthFormLayout>
    )

}