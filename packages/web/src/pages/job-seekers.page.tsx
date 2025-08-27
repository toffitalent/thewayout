import {
  ButtonBase,
  ButtonLink,
  classNames,
  Content,
  Flex,
  Heading,
  Text,
} from '@disruptive-labs/ui';
import ArrowNarrowRightIcon from '@disruptive-labs/ui/dist/icons/ArrowNarrowRight';
import Image from 'next/legacy/image';
import Link from 'next/link';
import hero from '@app/assets/images/job-seekers/hero.jpg';
import image1 from '@app/assets/images/job-seekers/image1.jpg';
import image2 from '@app/assets/images/job-seekers/image2.jpg';
import image3 from '@app/assets/images/job-seekers/image3.jpg';
import image4 from '@app/assets/images/job-seekers/image4.jpg';
import image5 from '@app/assets/images/job-seekers/image5.jpg';
import { Hero } from '@app/components/Hero';
import { HowItWorks, HowItWorksType } from '@app/components/HowItWorks';
import { MarketingLayout } from '@app/components/Layout';
import { SEO } from '@app/components/SEO';
import { useIsTablet } from '@app/hooks';
import { NextPageWithLayout } from '@app/types';
import styles from './job-seekers.module.scss';

const JobSeekersPage: NextPageWithLayout = () => {
  const isTablet = useIsTablet();

  return (
    <>
      <SEO
        title="Find More Than The Perfect Job"
        description="Criminal Record? No problem. While other job platforms only focus on bringing employers & employees together, we also connect you with a community of partners to support you in your life journey."
      />
      <Hero
        heading="Find More Than The Perfect Job"
        subheading="While other job platforms only focus on bringing employers & employees together, we also connect you with a community of partners to support you in your life journey."
        actions={[
          {
            href: '/signup/',
            label: 'Get Started',
            accessoryRight: <ArrowNarrowRightIcon />,
          },
        ]}
        image={hero}
      />

      <Content as="section" className={styles.section} mv={24}>
        <Flex container justify="center">
          <Flex item xs={12} md={8} textAlign="center">
            <Heading fontSize="4xl" fontWeight="700" mb={2}>
              Reentering the workforce? No problem.
            </Heading>
            <Text color="grey.600" fontSize="xl" fontWeight="700">
              Our contextualized software takes into consideration all of your personal, life, armed
              forces and professional experiences when matching you with employment opportunities.
            </Text>
          </Flex>
        </Flex>
      </Content>

      <Content as="section">
        <Flex container direction="row-reverse">
          <Flex xs={12} md={6} className={styles.sectionContent}>
            <Heading className={styles.sectionTitle2} mb={5}>
              Search Living Wage Jobs
            </Heading>
            <Text>
              All of our employers are committed to providing living wage jobs based on where their
              jobs are located.
            </Text>
            <ButtonBase
              as={Link}
              href="/signup/"
              accessoryRight={<ArrowNarrowRightIcon />}
              colorScheme="primary"
              mt={8}
            >
              Find jobs
            </ButtonBase>
          </Flex>
          <Flex xs={12} md={6} className={styles.imgWrapper}>
            <Image
              src={image1}
              layout={isTablet ? 'fill' : 'responsive'}
              objectFit="cover"
              alt=""
              width={0}
              height={0}
            />
          </Flex>
        </Flex>
      </Content>

      <Content as="section">
        <Flex container>
          <Flex xs={12} md={6} className={styles.sectionContent}>
            <Heading className={styles.sectionTitle2} mb={5}>
              Apply For Jobs Anonymously
            </Heading>
            <Text>
              Don&apos;t worry about your record getting in the way - we will only match you with
              jobs that are acceptable with your personal and professional background. Our one of a
              kind cloaking technology allows you to be 100% transparent without worrying about
              employer biases.
            </Text>
            <ButtonBase
              as={Link}
              href="/signup/"
              accessoryRight={<ArrowNarrowRightIcon />}
              colorScheme="primary"
              mt={8}
            >
              Get Started
            </ButtonBase>
          </Flex>
          <Flex xs={12} md={6} className={styles.imgWrapper}>
            <Image
              src={image2}
              layout={isTablet ? 'fill' : 'responsive'}
              objectFit="cover"
              alt=""
              width={0}
              height={0}
            />
          </Flex>
        </Flex>
      </Content>

      <Content as="section">
        <Flex container direction="row-reverse">
          <Flex xs={12} md={6} className={styles.sectionContent}>
            <Heading className={styles.sectionTitle2} mb={5}>
              Find Additional Support Services
            </Heading>
            <Text>
              We know that just having a job isn&apos;t always enough. Which is why we offer
              resources and support partners to help you become your best-self, personally and
              professionally.
            </Text>
            <ButtonBase
              as={Link}
              href="/signup/"
              accessoryRight={<ArrowNarrowRightIcon />}
              colorScheme="primary"
              mt={8}
            >
              Find jobs
            </ButtonBase>
          </Flex>
          <Flex xs={12} md={6} className={styles.imgWrapper}>
            <Image
              src={image3}
              layout={isTablet ? 'fill' : 'responsive'}
              objectFit="cover"
              alt=""
              width={0}
              height={0}
            />
          </Flex>
        </Flex>
      </Content>

      <Content as="section">
        <Flex container>
          <Flex xs={12} md={6} className={styles.sectionContentWider}>
            <HowItWorks type={HowItWorksType.jobSeeker} />
          </Flex>
          <Flex xs={12} md={6} className={styles.imgWrapper}>
            <Image
              src={image4}
              alt=""
              layout={isTablet ? 'fill' : 'responsive'}
              objectFit="cover"
              width={0}
              height={0}
            />
          </Flex>
        </Flex>
      </Content>

      <Content as="section">
        <Flex container direction="row-reverse">
          <Flex xs={12} md={6} className={styles.sectionContent}>
            <Heading className={styles.sectionTitle1} mb={5}>
              Follow Your Personalized Journey
            </Heading>
            <Text>
              Choose the additional support services you need, and we&apos;ll do our best to match
              you with a Supportive Services Provider (SSP) that can help provide you with resources
              and support.
            </Text>
            <ButtonBase
              as={Link}
              href="/signup/"
              accessoryRight={<ArrowNarrowRightIcon />}
              colorScheme="primary"
              mt={8}
            >
              Learn more
            </ButtonBase>
          </Flex>
          <Flex xs={12} md={6} className={styles.imgWrapper}>
            <Image
              src={image5}
              layout={isTablet ? 'fill' : 'responsive'}
              objectFit="cover"
              alt=""
              width={0}
              height={0}
            />
          </Flex>
        </Flex>
      </Content>

      <Content as="section" className={classNames(styles.greenBg, styles.section)} pv={36} ph={4}>
        <Text className={styles.sectionTitle1} fontWeight="700" mb={10} textAlign="center">
          Explore additional services
        </Text>
        <ButtonLink
          href="https://www.findhelp.org/"
          target="_blank"
          rel="noopener noreferrer"
          colorScheme="primary"
          accessoryRight={<ArrowNarrowRightIcon />}
        >
          Search For Additional Services
        </ButtonLink>
      </Content>
    </>
  );
};

JobSeekersPage.getLayout = (page) => (
  <MarketingLayout headerProps={{ transparent: true }} hero>
    {page}
  </MarketingLayout>
);

export default JobSeekersPage;
