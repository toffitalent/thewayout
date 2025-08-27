import { CredentialsRequest } from '@disruptive-labs/client';
import { Box, Button, ButtonBase, Field, Heading, Text, useForm } from '@disruptive-labs/ui';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SEO } from '@app/components/SEO';
import { useAppDispatch, useAuthRedirect, useErrorIndicator } from '@app/hooks';
import { NextPageWithLayout } from '@app/types';
import { login } from './actions';
import { AuthLayout } from './AuthLayout';

const isRelativeUri = (uri?: any): uri is string =>
  typeof uri === 'string' &&
  !!uri.length &&
  new URL(document.baseURI).origin === new URL(uri, document.baseURI).origin;

export const LoginPage: NextPageWithLayout = function LoginPage() {
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator({ InvalidCredentials: 'Invalid username/password' });
  const router = useRouter();
  const redirect = useAuthRedirect();

  const {
    control,
    formState: { isSubmitting, isDirty },
    submitForm,
  } = useForm({
    defaultValues: { username: '', password: '' },
    onSubmit: (values: CredentialsRequest) => {
      dispatch(login(values))
        .unwrap()
        .then(() => {
          if (isRelativeUri(router.query.return_to)) {
            router.replace(router.query.return_to);
          } else {
            redirect();
          }
        })
        .catch((e) => {
          showError(e);
        });
    },
  });

  return (
    <>
      <SEO title="Log In" description="" noIndex />
      <Heading as="h1" f="h2" mb={2.5}>
        Log In
      </Heading>
      <Text mb={10}>Welcome back! Enter your email and password to login.</Text>
      <form onSubmit={submitForm}>
        <Field
          type="email"
          name="username"
          label="Email"
          aria-label="Email address"
          validate={{ email: true }}
          fluid
          control={control}
        />
        <Field
          type="password"
          name="password"
          label="Password"
          aria-label="Password"
          validate={{ required: true }}
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
          Log In
        </Button>
      </form>
      <Box mt={5}>
        {'New to The Way Out? '}
        <Link href="/signup/" passHref>
          <Text display="inline" fontWeight="700">
            Sign Up
          </Text>
        </Link>
      </Box>
      <Box mt={5}>
        <ButtonBase as={Link} href="/forgot-password/" colorScheme="primary" variant="text">
          Forgot password?
        </ButtonBase>
      </Box>
    </>
  );
};

LoginPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
