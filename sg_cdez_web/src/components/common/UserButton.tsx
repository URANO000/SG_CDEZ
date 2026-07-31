import { Avatar, Group, Text, UnstyledButton, Stack } from '@mantine/core';
import { BsChevronDown } from 'react-icons/bs';
import classes from './UserButton.module.css';

export function UserButton() {
    return (
        <UnstyledButton className={classes.user}>
            <Group gap="sm" wrap="nowrap">
                <Avatar
                    src="/default-avt-light.jpg"
                    radius="lg"
                    alt="Usuario"
                />

                <Stack gap={0}>
                    <Text size="sm" fw={500}>
                        Usuario Pollito
                    </Text>
                    <Text size="xs" c="dimmed">
                        username@example.com
                    </Text>
                </Stack>

                <BsChevronDown size={15} />
            </Group>
        </UnstyledButton>
    )
}