import { Button, Field, Heading, Text, useForm } from '@disruptive-labs/ui';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SEO } from '@app/components/SEO';
import { useAppDispatch, useAuthRedirect, useErrorIndicator } from '@app/hooks';
import { NextPageWithLayout } from '@app/types';
import { resetPassword } from './actions';
import { AuthLayout } from './AuthLayout';

interface ResetPasswordFormValues {
  password: string;
}

export const ResetPasswordPage: NextPageWithLayout = function ResetPasswordPage() {
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator({ InvalidRequest: 'Invalid password reset token' });
  const redirect = useAuthRedirect();
  const router = useRouter();
  const { token, username } = router.query;

  const {
    control,
    submitForm,
    formState: { isSubmitting, isDirty },
    getValues,
  } = useForm({
    defaultValues: { password: '' },
    onSubmit: (values: ResetPasswordFormValues) =>
      dispatch(
        resetPassword({
          password: values.password,
          token: String(token),
          username: String(username),
        }),
      )
        .unwrap()
        .then(() => redirect())
        .catch((e) => {
          showError(e);
        }),
  });

  useEffect(() => {
    if (router.isReady && (!token || !username)) {
      router.push('/');
    }
  }, [token, router, username]);

  return (
    <>
      <SEO title="Reset Password" description="" noIndex />
      <Heading as="h1" f="h2" mb={2.5}>
        Reset password
      </Heading>
      <Text mb={10}>Enter a new password for your account.</Text>
      {token && (
        <form onSubmit={submitForm}>
          <Field
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your new password"
            validate={{ minLength: 8 }}
            fluid
            control={control}
          />
          <Field
            type="password"
            name="confirm"
            label="Confirm password"
            placeholder="Confirm Password"
            validate={{
              minLength: 8,
              validate: (value) =>
                value !== getValues('password') ? 'Passwords do not match.' : undefined,
            }}
            fluid
            control={control}
            defaultValue=""
          />
          <Button
            mt={10}
            type="submit"
            colorScheme="primary"
            disabled={isSubmitting || !isDirty}
            fluid
          >
            Reset
          </Button>
        </form>
      )}
    </>
  );
};

ResetPasswordPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
