import '@mantine/core/styles.css';
import { zurquiTheme } from './theme';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/home/home'
import { Login } from './pages/login/login';
import { Consultas } from './pages/consultas/consultas';
import { MantineProvider } from '@mantine/core';
import { AdultosMayores } from './pages/adultosMayores/adultosMayores';
import { Personal } from './pages/personal/personal';
import { Auditoria } from './pages/auditoria/auditoria';
import { Documentacion } from './pages/documentacion/documentacion';
import { Ajustes } from './pages/ajustes/ajustes';
import { AuthProvider } from './services/authContext';
import { ProtectedRoute } from './Routes';

function App() {

  return (
    <MantineProvider theme={zurquiTheme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/consultas" element={
                <ProtectedRoute roles={["ROLE_PERSONAL", "ROLE_ADMIN"]}>
                  <Consultas />
                </ProtectedRoute>} />
              <Route path="/adultosMayores" element={
                <ProtectedRoute roles={["ROLE_PERSONAL", "ROLE_ADMIN"]}>
                  <AdultosMayores />
                </ProtectedRoute>
              } />
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
              <Route path="/documentacion" element={
                <ProtectedRoute roles={["ROLE_PERSONAL", "ROLE_ADMIN"]}>
                  <Documentacion />
                </ProtectedRoute>
              } />
              <Route path="/ajustes" element={
                <ProtectedRoute roles={["ROLE_PERSONAL", "ROLE_ADMIN"]}>
                  <Ajustes />
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
