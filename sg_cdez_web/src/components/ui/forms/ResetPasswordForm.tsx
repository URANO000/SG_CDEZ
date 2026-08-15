import { AuthFormLayout } from "./AuthFormLayout";
import { useState } from "react";
import { useNavigate } from "react-router";
import { restablecerContrasena } from "../../../services/authService";
import { useForm } from "@mantine/form";
import { Button, PasswordInput } from "@mantine/core";

export function ResetPasswordForm({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      contrasena: "",
      confirmarContrasena: "",
    },
    validate: {
      contrasena: (val) => {
        if (val.length < 8)
          return "La contraseña debe tener al menos 8 caracteres";
        if (!/[A-Z]/.test(val))
          return "La contraseña debe contener al menos una letra mayúscula";
        if (!/[a-z]/.test(val))
          return "La contraseña debe contener al menos una letra minúscula";
        if (!/[0-9]/.test(val))
          return "La contaseña debe contener al menos un número";
        if (!/[^A-Za-z0-9]/.test(val))
          return "La contraseña debe contener al menos un carácter especial";
        return null;
      },
      confirmarContrasena: (val, values) =>
        val !== values.contrasena ? "Las contaseñas no coinciden" : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      await restablecerContrasena(
        token,
        values.contrasena,
        values.confirmarContrasena,
      );
      navigate("/login");
    } catch (error) {
      alert("Error genérico...manejo de errores pronto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Nueva Contraseña"
      onSubmit={form.onSubmit(handleSubmit)}
      subtitle=""
    >
      <PasswordInput
        label="Contraseña"
        placeholder="Tu contraseña"
        {...form.getInputProps("contrasena")}
        required
        mt="md"
        radius="md"
      />

      <PasswordInput
        label="Confirmar Contraseña"
        placeholder="Confirmar contraseña"
        {...form.getInputProps("confirmarContrasena")}
        required
        mt="md"
        radius="md"
      />

      <Button type="submit" loading={loading} fullWidth mt="xl" radius="md">
        Cambiar Contraseña
      </Button>
    </AuthFormLayout>
  );
}
