import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useVerifyMutation } from '@/api/endpoints/authApi';
import { FormTextField } from '@/components/common/form-text-field';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Paragraph } from '@/components/ui/paragraph';
import { Stack } from '@/components/ui/stack';
import { ROUTES } from '@/constants/paths';
import { getErrorMessage } from '@/utils/apiError';
import { OTP_LENGTH, verifyOtpSchema, type VerifyOtpFormValues } from './verify-otp.schema';

const VerifyOtp = () => {
  const [verify] = useVerifyMutation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const username = (state as { username?: string } | null)?.username;
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<VerifyOtpFormValues>({
    resolver: yupResolver(verifyOtpSchema),
    defaultValues: { code: '' },
  });

  if (!username) return <Navigate to={ROUTES.LOGIN} replace />;

  const onSubmit = async ({ code }: VerifyOtpFormValues) => {
    setError(null);
    try {
      await verify({ username, code }).unwrap();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="2xs">
        <Heading as="h1">Verification</Heading>
        <Paragraph>
          Enter the {OTP_LENGTH}-digit code sent to {username}.
        </Paragraph>
      </Stack>
      <FormTextField name="code" control={control} label="Verification code" autoFocus />
      {error && <Alert variant="error">{error}</Alert>}
      <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Verifying...' : 'Verify'}
      </Button>
      <Button variant="text" onClick={() => navigate(ROUTES.LOGIN, { state })}>
        Back
      </Button>
    </Form>
  );
};

export default VerifyOtp;
