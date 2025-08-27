import { Button, ButtonBase, Flex, Heading, Text } from '@disruptive-labs/ui';
import ArrowNarrowRightIcon from '@disruptive-labs/ui/dist/icons/ArrowNarrowRight';
import Link from 'next/link';
import styles from './HowItWorks.module.scss';

export enum HowItWorksType {
  employer = 'employer',
  jobSeeker = 'jobSeeker',
  serviceProviders = 'serviceProviders',
}

interface HowItWorks {
  description?: string;
  info: { title: string; description: string }[];
  label: string;
  href?: string;
}

const howItWorks: { [key in HowItWorksType]: HowItWorks } = {
  [HowItWorksType.jobSeeker]: {
    description: 'Life can be harder upon your return. Our platform makes it easier.',
    info: [
      {
        title: 'Create Your Profile',
        description:
          'Our platform creates a blind, contextual profile that removes your name, address, employment gaps and other information that traditionally cause biases from employers.',
      },
      {
        title: 'Identify Additional Support Needs',
        description:
          "We'll match you with a Supportive Services Provider (SSP) in your area that can help with your personal and professional journey. You can manage your personalized journey in our dashboard.",
      },
      {
        title: 'Apply For Jobs',
        description:
          "Our platform is designed for job seekers who've recently reentered the workforce.",
      },
    ],
    label: 'Find jobs',
    href: '/signup/',
  },
  [HowItWorksType.employer]: {
    info: [
      {
        title: 'Create Your Profile',
        description:
          'Choose a subscription package and begin creating your employer profile by adding your company details.',
      },
      {
        title: 'Identify Ideal Candidate',
        description:
          'Identify your ideal candidate qualifications based on federal and state guidelines for each job you post.',
      },
      {
        title: 'Hire Qualified Candidates',
        description:
          "Search and review qualified cloaked candidates and set up interviews. Once an interview is scheduled, the applicant's full profile will be made available.",
      },
    ],
    label: 'List a Job',
    href: '/signup/',
  },
  [HowItWorksType.serviceProviders]: {
    info: [
      {
        title: 'Create Your Profile',
        description:
          "Add your organization's details; name, location, services provided, and contact info.",
      },
      {
        title: 'Receive Client Referrals',
        description:
          'Our algorithm matches you with clients seeking supportive services in your area.',
      },
      {
        title: 'Manage Client Journey',
        description:
          "Utilize our dashboard to help manage your client's personal and professional journey.",
      },
    ],
    label: 'Register Organization',
    href: 'mailto:support@twout.org',
  },
};

export const HowItWorks = ({ type }: { type: HowItWorksType }) => {
  const { href, description } = howItWorks[type];
  return (
    <>
      <Heading className={styles.title} mb={2}>
        How it works?
      </Heading>
      {description && (
        <Text fontSize="xl" fontWeight="700" color="grey.600">
          {howItWorks[type].description}
        </Text>
      )}
      <Flex>
        {howItWorks[type].info.map((el, index) => (
          <Flex borderBottom pv={10} direction="row" className={styles.infoItem} key={el.title}>
            <Text color="primary" fontSize="5xl" fontWeight="700" lineHeight="none">
              {index + 1}
            </Text>
            <Flex ml={8}>
              <Text fontWeight="700" fontSize="xl" mb={2}>
                {el.title}
              </Text>
              <Text color="grey.600">{el.description}</Text>
            </Flex>
          </Flex>
        ))}
      </Flex>
      {href ? (
        <ButtonBase
          as={Link}
          href={href}
          accessoryRight={<ArrowNarrowRightIcon />}
          colorScheme="primary"
        >
          {howItWorks[type].label}
        </ButtonBase>
      ) : (
        <Button accessoryRight={<ArrowNarrowRightIcon />} colorScheme="primary">
          {howItWorks[type].label}
        </Button>
      )}
    </>
  );
};
