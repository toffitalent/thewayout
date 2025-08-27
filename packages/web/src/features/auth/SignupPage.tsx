import { Box, Button, Field, Flex, Heading, Text, useForm } from '@disruptive-labs/ui';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CreateUserRequest } from '@two/shared';
import { UserType } from '@app/api';
import { SEO } from '@app/components/SEO';
import { useAppDispatch, useAuthRedirect, useErrorIndicator } from '@app/hooks';
import { NextPageWithLayout } from '@app/types';
import { signUp } from './actions';
import { AuthLayout } from './AuthLayout';

export interface SignupPageProps {
  text?: string;
  type: UserType;
}

function SignupPage({
  text = 'Welcome to The Way Out. Sign up with an email and password to get started on your journey today.',
  type,
}: SignupPageProps) {
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator({ ResourceConflict: 'Email already in use' });
  const redirect = useAuthRedirect();
  const router = useRouter();

  const {
    control,
    submitForm,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
    onSubmit: (values: Omit<CreateUserRequest, 'type'>) =>
      dispatch(signUp({ ...values, type }))
        .unwrap()
        .then(() => redirect())
        .catch((e) => {
          showError(e);
        }),
  });

  const navigateToLogin = () =>
    router.replace({
      pathname: '/login/',
      query: router.query.return_to
        ? {
            return_to: router.query.return_to,
          }
        : undefined,
    });

  return (
    <>
      <SEO title="Sign Up" description="" noIndex />
      <Heading as="h1" f="h2" mb={2.5}>
        Sign Up
      </Heading>
      <Text mb={10}>{text}</Text>
      <form onSubmit={submitForm}>
        <Field
          type="email"
          name="email"
          label="Email"
          placeholder="Your email address"
          validate={{ email: true }}
          fluid
          control={control}
        />
        <Field
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          validate={{ minLength: 8 }}
          fluid
          control={control}
        />
        <Flex direction="row" mv={4}>
          <Field
            type="text"
            name="firstName"
            label="First Name"
            placeholder="Your first name"
            validate={{ required: true }}
            autoCapitalize="words"
            width="1/2"
            mr={4}
            control={control}
          />
          <Field
            type="text"
            name="lastName"
            label="Last Name"
            placeholder="Your last name"
            validate={{ required: true }}
            autoCapitalize="words"
            width="1/2"
            mt={0}
            control={control}
          />
        </Flex>
        <Field
          type="checkbox"
          name="terms"
          label={
            <>
              {'By signing up, I agree to the '}
              <Link href="/terms/" target="_blank" rel="noopener noreferrer">
                <Text display="inline" fontWeight="700">
                  Terms of Service
                </Text>
              </Link>
              {' and '}
              <Link href="/privacy/" target="_blank" rel="noopener noreferrer">
                <Text display="inline" fontWeight="700">
                  Privacy Policy
                </Text>
              </Link>
              .
            </>
          }
          validate={{ required: true }}
          control={control}
        />
        <Button
          mt={10}
          type="submit"
          colorScheme="primary"
          disabled={isSubmitting || !isDirty}
          fluid
        >
          Sign Up
        </Button>
      </form>
      <Box mt={5} onClick={navigateToLogin}>
        {'Already using The Way Out? '}
        <Text as="a" fontWeight="700">
          Log In
        </Text>
      </Box>
    </>
  );
}

export const ClientSignupPage: NextPageWithLayout = function ClientSignupPage() {
  return <SignupPage type={UserType.Client} />;
};

ClientSignupPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export const EmployerSignupPage: NextPageWithLayout = function EmployerSignupPage() {
  return (
    <SignupPage
      text="Welcome to The Way Out. Sign up with an email and password and start finding qualified candidates for your jobs today."
      type={UserType.Employer}
    />
  );
};

EmployerSignupPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
