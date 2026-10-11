import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '@/api/endpoints/authApi';
import { FormTextField } from '@/components/common/form-text-field';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Paragraph } from '@/components/ui/paragraph';
import { Stack } from '@/components/ui/stack';
import { ROUTES } from '@/constants/paths';
import { getErrorMessage } from '@/utils/apiError';
import { loginSchema, type LoginFormValues } from './login.schema';

const Login = () => {
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async ({ username, password }: LoginFormValues) => {
    setError(null);
    try {
      await login({ username, password }).unwrap();
      navigate(ROUTES.VERIFY, { state: { ...state, username } });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="2xs">
        <Heading as="h1">Sign in</Heading>
        <Paragraph>Use your admin username and password.</Paragraph>
      </Stack>
      <FormTextField name="username" control={control} label="Username" autoFocus />
      <FormTextField name="password" control={control} label="Password" type="password" />
      {error && <Alert variant="error">{error}</Alert>}
      <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </Form>
  );
};

export default Login;
