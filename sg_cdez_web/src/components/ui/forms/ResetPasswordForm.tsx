import { AuthFormLayout } from "./AuthFormLayout";
import { useState } from "react";
import { useNavigate } from "react-router";
import { restablecerContrasena } from "../../../services/authService";
import { useForm } from "@mantine/form";
import { Button, PasswordInput } from "@mantine/core";
import { PasswordStrengthInput } from "../../../components/common/Passwordstrengthinput";
import { notifications } from "@mantine/notifications";
import axios from "axios";

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
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        notifications.show({
          title: "Error de restablecimiento de contraseña",
          message: error.response.data?.message,
          color: "orange",
        });
      } else {
        notifications.show({
          title: "Error de restablecimiento de contraseña",
          message: "Error al restablecer la contraseña.",
          color: "red",
        });
      }
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
      <PasswordStrengthInput
        {...form.getInputProps("contrasena")}
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