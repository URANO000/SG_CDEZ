import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { zurquiTheme } from "./theme";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/home/home";
import { Login } from "./pages/auth/login";
import { Activar } from "./pages/auth/activarCuenta";
import { ForgotPassword } from "./pages/auth/forgotPassword";
import { ResendVerification } from "./pages/auth/resendVerification";
import { Consultas } from "./pages/consultas/consultas";
import { AdultosMayores } from "./pages/adultosMayores/adultosMayores";
import { AdultoMayorExpediente } from "./pages/adultosMayores/adultoMayorExpediente";
import { Personal } from "./pages/personal/personal";
import { Auditoria } from "./pages/auditoria/auditoria";
import { Documentacion } from "./pages/documentacion/documentacion";
import { AuthProvider } from "./services/authContext";
import { ProtectedRoute } from "./Routes";
import { RestablecerContrasena } from "./pages/auth/restablecerContrasena";
import { NotFound } from "./pages/error/404";
import { ServerError } from "./pages/error/500";
import { PersonalDetalle } from "./pages/personal/personalDetalle";
import { PersonalEditar } from "./pages/personal/personalEditar";
import { PersonalRegistrar } from "./pages/personal/personalRegistrar";
import { AdultoMayorRegistrar } from "./pages/adultosMayores/adultoMayorRegistrar";

function App() {
  return (
    <MantineProvider theme={zurquiTheme}>
      <Notifications position="top-right" />
      <AuthProvider>
        <Router>
          <Routes>
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
            <Route path="*" element={<NotFound />} />
            <Route path="/500" element={<ServerError />} />
            <Route
              element={
                <ProtectedRoute roles={["ROLE_PERSONAL", "ROLE_ADMIN"]}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/consultas" element={
                <ProtectedRoute roles={["ROLE_PERSONAL"]}>
                  <Consultas />
                </ProtectedRoute>
              } />
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
              <Route path="/documentacion" element={<Documentacion />} />

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
              <Route
                path="/auditoria"
                element={
                  <ProtectedRoute roles={["ROLE_ADMIN"]}>
                    <Auditoria />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
