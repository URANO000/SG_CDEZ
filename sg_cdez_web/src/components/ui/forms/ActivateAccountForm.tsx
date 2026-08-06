import { PasswordInput } from "@mantine/core";
import { AuthFormLayout } from "./AuthFormLayout";
import { Button } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router";
import { activarCuenta } from "../../../services/authService";

export function ActivateAccountForm({ token }: { token: string }) {
    const [contrasena, setContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        try{
            await activarCuenta(token, contrasena, confirmarContrasena);
            navigate("/login");

        } catch (error){
            alert("Error al activar la cuenta/ voy a cambiar esto a un modal" );
            
        }finally {
            setLoading(false);
        }


    };

    return (
        <AuthFormLayout title="Activar Cuenta" onSubmit={handleSubmit}>
            <PasswordInput
                label="Contraseña"
                placeholder="Tu contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.currentTarget.value)}
                required
                mt="md"
                radius="md"
            />

            <PasswordInput
                label="Confirmar contraseña"
                placeholder="Confirmar contraseña"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.currentTarget.value)}
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