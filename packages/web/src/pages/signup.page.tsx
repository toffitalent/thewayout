import { Box, Button, Flex, Text } from '@disruptive-labs/ui';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import logoImg from '@app/assets/images/logo.png';
import employers from '@app/assets/images/signup/employers.jpg';
import jobSeekers from '@app/assets/images/signup/jobSeekers.jpg';
import styles from './signup.module.scss';

interface SignupCardProps {
  title: string;
  description: string;
  handleClick: () => void;
  img: any;
}

const SignupCard = ({ title, description, handleClick, img }: SignupCardProps) => (
  <Flex
    alignItems="flex-start"
    display="flex"
    direction="column"
    textAlign="left"
    border
    rounded="xl"
  >
    <Image src={img} className={styles.img} alt="" priority width={0} height={0} />
    <Flex p={5}>
      <Text fontSize="xl" fontWeight="700" mb={3}>
        {title}
      </Text>
      <Text>{description}</Text>
      <Button onClick={handleClick} fluid colorScheme="primary" mt={5} rounded="xl">
        Sign Up
      </Button>
    </Flex>
  </Flex>
);

const SignupPage = function ClientSignupPage() {
  const router = useRouter();

  const navigateToLogin = () =>
    router.push({
      pathname: '/login',
      query: router.query.return_to
        ? {
            return_to: router.query.return_to,
          }
        : undefined,
    });

  return (
    <>
      <div className={styles.header}>
        <Link href="/" passHref className={styles.logo}>
          <Image src={logoImg} alt="" width={0} height={0} />
        </Link>
      </div>
      <main className={styles.content}>
        <Flex container justify="center" spacing={5}>
          <Flex item xs={12} md={6}>
            <SignupCard
              title="Job Seekers"
              description="Take the next step in your journey. We are at your side."
              handleClick={() => router.push('/client/signup')}
              img={jobSeekers}
            />
          </Flex>
          <Flex item xs={12} md={6}>
            <SignupCard
              title="Employers"
              description="Post jobs and find the perfect candidates for your company."
              handleClick={() => router.push('/employer/signup')}
              img={employers}
            />
          </Flex>
          <Box mt={5} fontWeight="700" onClick={navigateToLogin}>
            {'Already using The Way Out? '}
            <Text as="a">Log In</Text>
          </Box>
        </Flex>
      </main>
    </>
  );
};

export default SignupPage;
