import { TbCheck, TbX } from "react-icons/tb";
import { Box, Center, Group, PasswordInput, Progress, Text } from '@mantine/core';

const requirements = [
    { re: /[0-9]/, label: 'Incluye un número' },
    { re: /[a-z]/, label: 'Incluye una minúscula' },
    { re: /[A-Z]/, label: 'Incluye una mayúscula' },
    { re: /[^A-Za-z0-9]/, label: 'Incluye un carácter especial' },
];

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
    return (
        <Text component="div" c={meets ? 'teal' : 'red'} mt={5} size="sm">
            <Center inline>
                {meets ? <TbCheck size={14} /> : <TbX size={14} />}
                <Box ml={7}>{label}</Box>
            </Center>
        </Text>
    );
}

function getStrength(password: string) {
    let multiplier = password.length > 7 ? 0 : 1;
    requirements.forEach((requirement) => {
        if (!requirement.re.test(password)) {
            multiplier += 1;
        }
    });
    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

export function PasswordStrengthInput({
  value = '',
  onChange,
  error,
  label = 'Contraseña',
  placeholder = 'Tu contraseña',
  ...rest
}: {
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: React.ReactNode;
  label?: string;
  placeholder?: string;
  [key: string]: any;
}) {
  const strength = getStrength(value);
 
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
  ));
 
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ section: { transitionDuration: '0ms' } }}
        value={value.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0}
        color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
        key={index}
        size={4}
        aria-label={`Password strength segment ${index + 1}`}
      />
    ));
 
  return (
    <div>
      <PasswordInput
        value={value}
        onChange={onChange}
        error={error}
        label={label}
        placeholder={placeholder}
        {...rest}
      />
      {value.length > 0 && (
        <>
          <Group gap={5} grow mt="xs" mb="md">
            {bars}
          </Group>
          <PasswordRequirement label="Tiene al menos 8 caracteres" meets={value.length > 7} />
          {checks}
        </>
      )}
    </div>
  );
}