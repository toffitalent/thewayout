import { Box, Button, Field, Flex, Heading, Text, useForm } from '@disruptive-labs/ui';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { CreateUserRequest } from '@two/shared';
import { UserType } from '@app/api';
import { SEO } from '@app/components/SEO';
import { useAppDispatch, useAuthRedirect, useErrorIndicator } from '@app/hooks';
import { NextPageWithLayout } from '@app/types';
import { signUp } from './actions';
import { AuthLayout } from './AuthLayout';

export const RspSignupPage: NextPageWithLayout = function RspSignupPage() {
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator({
    ResourceConflict: 'Email already in use',
    ResourceNotFound: 'Invitation not found',
  });
  const redirect = useAuthRedirect();
  const router = useRouter();
  const { firstName, lastName, email, phone, invitationId } = router.query as {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    invitationId: string;
  };

  const {
    control,
    submitForm,
    setValue,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
    onSubmit: (values: Omit<CreateUserRequest, 'type'>) =>
      dispatch(
        signUp({
          ...values,
          type: UserType.Rsp,
          phone,
          ...(invitationId && { invitationId }),
        }),
      )
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

  useEffect(() => {
    if (firstName) setValue('firstName', firstName);
    if (lastName) setValue('lastName', lastName);
    if (email) setValue('email', email);
  }, [email, setValue, firstName, lastName]);

  return (
    <>
      <SEO title="Sign Up" description="" noIndex />
      <Heading as="h1" f="h2" mb={2.5}>
        Sign Up
      </Heading>
      <Text mb={10}>
        Welcome to The Way Out. Sign up with an email and password to get started on your journey
        today.
      </Text>
      <form onSubmit={submitForm}>
        <Field
          type="email"
          name="email"
          label="Email"
          placeholder="Your email address"
          validate={{ email: true }}
          fluid
          control={control}
          disabled={!!email}
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
            disabled={!!firstName}
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
            disabled={!!lastName}
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
};

RspSignupPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
