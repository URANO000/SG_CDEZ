import { Avatar, Group, Text, Stack, Menu, ActionIcon } from '@mantine/core';
import { BsChevronDown, BsPersonFill, BsBrightnessHighFill, BsUniversalAccess, BsBoxArrowRight } from 'react-icons/bs';
import classes from './UserButton.module.css';
import { useNavigate } from 'react-router';
import { cerrarSesion } from '../../services/authService';
import { useAuth } from '../../services/authContext';

export function UserButton() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { user } = useAuth();

    async function handleLogout() {

        try {
            await cerrarSesion();
            navigate("/login", { replace: true })
        }
        finally {
            logout();
            navigate("/login", { replace: true });
        }
    }

    return (
        <Group gap="sm" wrap="nowrap" className={classes.user}>
            <Avatar
                src="/default-avt-light.jpg"
                radius="lg"
                alt="Usuario"
            />

            <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                <Text size="sm" fw={500} truncate="end">
                    {
                        user?.nombreCompleto.length != 0 ? user?.nombreCompleto : "Sin Nombre"
                    }
                </Text>
                <Text size="xs" c="dimmed" truncate="end">
                    {
                        user?.usuario
                    }
                </Text>
            </Stack>

            <Menu withArrow width={300} position='bottom' transitionProps={{ transition: 'pop' }} withinPortal>
                <Menu.Target>
                    <ActionIcon variant='transparent' aria-label='Menu de Usuario'>
                        <BsChevronDown size={15} />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item>
                        <Text size="sm" fw={500} truncate="end">
                            {
                                user?.nombreCompleto.length != 0 ? user?.nombreCompleto : "Sin Nombre"
                            }
                        </Text>
                        <Text size="xs" c="dimmed" truncate="end">
                            {
                                user?.usuario
                            }
                        </Text>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>
                        Ajustes de usuario
                    </Menu.Label>
                    <Menu.Item leftSection={<BsPersonFill size={20} />}>
                        Perfil
                    </Menu.Item>
                    <Menu.Item leftSection={<BsBrightnessHighFill size={20} />}>
                        Apariencia
                    </Menu.Item>
                    <Menu.Item leftSection={<BsUniversalAccess size={20} />}>
                        Accesibilidad
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item color='red' leftSection={<BsBoxArrowRight size={20} />} onClick={handleLogout}>
                        Cerrar Sesión
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Group>
    )
}