import { useState } from "react";
import { iniciarSesion } from "../services/authService";

function Login() {
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");

    const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

        try {

            await iniciarSesion(
                usuario,
                contrasena
            );

            alert("Login exitoso");

        } catch (error) {

            alert("Credenciales inválidas");

        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)

                }
            />

            <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)

                }
            />

            <button type="submit">
                Iniciar Sesión
            </button>

        </form>
    );

}

export default Login;