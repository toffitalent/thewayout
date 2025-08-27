import { Button, Field, Heading, Text, useForm } from '@disruptive-labs/ui';
import { useState } from 'react';
import { SEO } from '@app/components/SEO';
import { useAppDispatch, useAuthRedirect, useErrorIndicator } from '@app/hooks';
import { NextPageWithLayout } from '@app/types';
import { forgotPassword } from './actions';
import { AuthLayout } from './AuthLayout';

interface ForgotPasswordFormValues {
  username: string;
}

export const ForgotPasswordPage: NextPageWithLayout = function ForgotPasswordPage() {
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator();
  const [successUsername, setSuccessUsername] = useState('');
  useAuthRedirect();

  const {
    control,
    submitForm,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: { username: '' },
    onSubmit: (values: ForgotPasswordFormValues) =>
      dispatch(forgotPassword(values.username))
        .unwrap()
        .then(() => {
          setSuccessUsername(values.username);
        })
        .catch((e) => {
          showError(e);
        }),
  });

  return (
    <>
      <SEO title="Forgot Password" description="" noIndex />
      {successUsername ? (
        <>
          <Heading as="h1" f="h2" mb={2.5}>
            Check your email
          </Heading>
          <Text mb={10}>
            We have sent an email to {successUsername}. Click the link in the email to reset your
            password. If you don&apos;t see the email, check your junk, social or other folders.
          </Text>
          <Button onClick={() => setSuccessUsername('')} variant="text">
            I didn&apos;t receive an email.
          </Button>
        </>
      ) : (
        <>
          <Heading as="h1" f="h2" mb={2.5}>
            Forgot Password
          </Heading>
          <Text mb={10}>Enter the email address associated with the account.</Text>
          <form onSubmit={submitForm}>
            <Field
              type="email"
              name="username"
              label="Email"
              placeholder="Your email address"
              validate={{ email: true }}
              fluid
              control={control}
            />
            <Button
              mt={10}
              type="submit"
              colorScheme="primary"
              disabled={isSubmitting || !isDirty}
              fluid
            >
              Send password reset
            </Button>
          </form>
        </>
      )}
    </>
  );
};

ForgotPasswordPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
