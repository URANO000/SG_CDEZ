import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { useEffect } from "react";
import { MantineProvider, localStorageColorSchemeManager } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import { zurquiTheme } from "./theme";
import "./App.css";

import { Layout } from "./components/layout/Layout";

import { Home } from "./pages/home/home";
import { Login } from "./pages/auth/login";
import { Activar } from "./pages/auth/activarCuenta";
import { ForgotPassword } from "./pages/auth/forgotPassword";
import { ResendVerification } from "./pages/auth/resendVerification";
import { RestablecerContrasena } from "./pages/auth/restablecerContrasena";

import { Consultas } from "./pages/consultas/consultas";
import { ConsultaDetalle } from "./pages/consultas/consultaDetalle";

import { AdultosMayores } from "./pages/adultosMayores/adultosMayores";
import { AdultoMayorExpediente } from "./pages/adultosMayores/adultoMayorExpediente";
import { AdultoMayorEditar } from "./pages/adultosMayores/adultoMayorEditar";
import { AdultoMayorRegistrar } from "./pages/adultosMayores/adultoMayorRegistrar";

import { Personal } from "./pages/personal/personal";
import { PersonalDetalle } from "./pages/personal/personalDetalle";
import { PersonalEditar } from "./pages/personal/personalEditar";
import { PersonalRegistrar } from "./pages/personal/personalRegistrar";

import { Auditoria } from "./pages/auditoria/auditoria";
import { Documentacion } from "./pages/documentacion/documentacion";

import { Ajustes } from "./pages/ajustes/ajustes";
import { Apariencia } from "./pages/ajustes/apariencia";
import { Accesibilidad } from "./pages/ajustes/accesibilidad";

import { NotFound } from "./pages/error/404";
import { ServerError } from "./pages/error/500";

import { AuthProvider } from "./services/authContext";
import { ProtectedRoute } from "./Routes";

import {
  applyAccessibilitySettings,
  loadAccessibilitySettings,
} from "./utils/accessibility";
import { ConsultaRegistrar } from "./pages/consultas/consultaRegistrar";

const colorSchemeManager = localStorageColorSchemeManager({
  key: "sg-cdez-color-scheme",
});

function App() {
  useEffect(() => {
    applyAccessibilitySettings(loadAccessibilitySettings());
  }, []);

  return (
    <MantineProvider
      theme={zurquiTheme}
      colorSchemeManager={colorSchemeManager}
      defaultColorScheme="light"
    >
      <Notifications position="top-right" />

      <AuthProvider>
        <Router>
          <Routes>
            {/* RUTAS PÚBLICAS */}
            <Route path="/activar" element={<Activar />} />
            <Route path="/login" element={<Login />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route
              path="/restablecer-contrasena"
              element={<RestablecerContrasena />}
            />

            <Route
              path="/reenviar-verificacion"
              element={<ResendVerification />}
            />

            <Route path="/500" element={<ServerError />} />

            {/* RUTAS AUTENTICADAS */}
            <Route
              element={
                <ProtectedRoute roles={["ROLE_PERSONAL", "ROLE_ADMIN"]}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Home />} />

              {/* CONSULTAS */}
              <Route
                path="/consultas"
                element={
                  <ProtectedRoute roles={["ROLE_PERSONAL"]}>
                    <Consultas />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/consulta/:consultaId/detalle"
                element={
                  <ProtectedRoute roles={["ROLE_PERSONAL"]}>
                    <ConsultaDetalle />
                  </ProtectedRoute>
                }
              />

              <Route 
              path="consulta/registrar"
              element={
                <ProtectedRoute roles={["ROLE_PERSONAL"]}>
                  <ConsultaRegistrar />
                </ProtectedRoute>
              }
              />

              {/* AJUSTES */}
              <Route path="/perfil" element={<Ajustes />} />

              <Route path="/apariencia" element={<Apariencia />} />

              <Route path="/accesibilidad" element={<Accesibilidad />} />

              {/* ADULTOS MAYORES */}
              <Route path="/adultosMayores" element={<AdultosMayores />} />

              <Route
                path="/adultosMayores/:adultoId/expediente"
                element={<AdultoMayorExpediente />}
              />

              <Route
                path="/adultosMayores/registrar"
                element={
                  <ProtectedRoute roles={["ROLE_ADMIN"]}>
                    <AdultoMayorRegistrar />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/adultosMayores/:adultoId/editar"
                element={<AdultoMayorEditar />}
              />

              {/* DOCUMENTACIÓN */}
              <Route path="/documentacion" element={<Documentacion />} />

              {/* PERSONAL */}
              <Route
                path="/personal"
                element={
                  <ProtectedRoute roles={["ROLE_ADMIN"]}>
                    <Personal />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/personal/:personalId/detalle"
                element={
                  <ProtectedRoute roles={["ROLE_ADMIN"]}>
                    <PersonalDetalle />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/personal/:personalId/editar"
                element={
                  <ProtectedRoute roles={["ROLE_ADMIN"]}>
                    <PersonalEditar />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/personal/registrar"
                element={
                  <ProtectedRoute roles={["ROLE_ADMIN"]}>
                    <PersonalRegistrar />
                  </ProtectedRoute>
                }
              />

              {/* AUDITORÍA */}
              <Route
                path="/auditoria"
                element={
                  <ProtectedRoute roles={["ROLE_ADMIN"]}>
                    <Auditoria />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
