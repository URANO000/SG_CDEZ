import '@mantine/core/styles.css';
import { zurquiTheme } from './theme';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/home/home';
import { Login } from "./pages/auth/login";
import { Activar } from './pages/auth/activarCuenta';
import { ForgotPassword } from './pages/auth/forgotPassword';
import { ResendVerification} from "./pages/auth/resendVerification";
import { Consultas } from './pages/consultas/consultas';
import { MantineProvider } from '@mantine/core';
import { AdultosMayores } from './pages/adultosMayores/adultosMayores';
import { Personal } from './pages/personal/personal';
import { Auditoria } from './pages/auditoria/auditoria';
import { Documentacion } from './pages/documentacion/documentacion';
import { AuthProvider } from './services/authContext';
import { ProtectedRoute } from './Routes';
import { RestablecerContrasena } from './pages/auth/restablecerContrasena';

function App() {

  return (
    <MantineProvider theme={zurquiTheme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/activar" element={<Activar />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
            <Route path="/reenviar-verificacion" element={<ResendVerification />} />
            <Route element={
              <ProtectedRoute roles={["ROLE_PERSONAL", "ROLE_ADMIN"]}>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Home />} />
              <Route path="/consultas" element={<Consultas />} />
              <Route path="/adultosMayores" element={<AdultosMayores />} />
              <Route path='/documentacion' element={<Documentacion />} />

              <Route path="/personal" element={
                <ProtectedRoute roles={["ROLE_ADMIN"]}>
                  <Personal />
                </ProtectedRoute>
              } />
              <Route path="/auditoria" element={
                <ProtectedRoute roles={["ROLE_ADMIN"]}>
                  <Auditoria />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </MantineProvider>
  )
}

export default App
