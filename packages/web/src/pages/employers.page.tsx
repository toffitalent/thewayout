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
import hero from '@app/assets/images/employers/hero.jpg';
import image1 from '@app/assets/images/employers/image1.jpg';
import image2 from '@app/assets/images/employers/image2.jpg';
import image3 from '@app/assets/images/employers/image3.jpg';
import image4 from '@app/assets/images/employers/image4.jpg';
import image5 from '@app/assets/images/employers/image5.jpg';
import inCheckLogo from '@app/assets/images/employers/in-check.png';
import scheme from '@app/assets/images/employers/scheme.png';
import { Hero } from '@app/components/Hero';
import { HowItWorks, HowItWorksType } from '@app/components/HowItWorks';
import { MarketingLayout } from '@app/components/Layout';
import { SEO } from '@app/components/SEO';
import { useIsTablet } from '@app/hooks';
import { NextPageWithLayout } from '@app/types';
import styles from './employers.module.scss';

const EmployersPage: NextPageWithLayout = () => {
  const isTablet = useIsTablet();

  return (
    <>
      <SEO
        title="Employers"
        description="Our pipeline is full of qualified, talented, and eager-to-work individuals waiting to fill your open positions."
      />
      <Hero
        heading="Seeking Qualified Job Applicants?"
        subheading="Our pipeline is full of qualified, talented, and eager-to-work individuals waiting to fill your open positions."
        actions={[
          {
            href: '/signup/',
            label: 'Create Job Offer',
            accessoryRight: <ArrowNarrowRightIcon />,
          },
        ]}
        image={hero}
      />

      <Content as="section" mt={isTablet ? 24 : undefined}>
        <Flex container direction="row-reverse">
          <Flex xs={12} md={6} pv={24} className={styles.sectionContent}>
            <Heading className={styles.sectionTitle1} mb={10}>
              Average Savings with The Way Out
            </Heading>
            <Image src={scheme} alt="" objectFit="contain" width={0} height={0} />
            <Text mt={12}>Based on $31,200 Annual Salary</Text>
          </Flex>
          <Flex xs={12} md={6} className={styles.imgWrapper}>
            <Image
              src={image1}
              alt=""
              layout={isTablet ? 'fill' : 'responsive'}
              objectFit="cover"
              width={0}
              height={0}
            />
          </Flex>
        </Flex>
      </Content>

      <Content as="section" className={classNames(styles.greenBg, styles.section)} pv={36} ph={4}>
        <Text fontSize="4xl" fontWeight="700" textAlign="center" width={isTablet ? '1/2' : 'full'}>
          Job search struggles affect nearly 200,000 Veterans every year.
        </Text>
        <Text color="grey.600" mt={2}>
          HR Daily Advisor 11.11.2022
        </Text>
        <Text
          fontSize="4xl"
          fontWeight="700"
          textAlign="center"
          mt={10}
          width={isTablet ? '1/2' : 'full'}
        >
          Every year more than 650,000 formerly incarcerated individuals enter the job market.
        </Text>
        <Text color="grey.600" mt={2}>
          Forbes 4.29.2022
        </Text>
      </Content>

      <Content as="section">
        <Flex container direction="row-reverse">
          <Flex xs={12} md={6} className={styles.sectionContent}>
            <Heading className={styles.sectionTitle1} mb={5}>
              Increase Employee Retention
            </Heading>
            <Text>
              When employers, service providers, and job seekers utilize our platform, the job
              retention rate is nearly 90%.
            </Text>
            <ButtonBase
              as={Link}
              href="/signup/"
              accessoryRight={<ArrowNarrowRightIcon />}
              colorScheme="primary"
              mt={8}
            >
              Create Profile
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
        <Flex container>
          <Flex xs={12} md={6} className={styles.sectionContent}>
            <Heading className={styles.sectionTitle1} mb={5}>
              Reduce Recruitment Costs
            </Heading>
            <Text>
              Find resources to help your organization with tax credits, training reimbursements,
              and other financial incentives to save on labor costs.
            </Text>
            <ButtonBase
              as={Link}
              href="https://doodle.com/bp/elirivera/eli-riverathe-way-out"
              target="_blank"
              rel="noopener noreferrer"
              accessoryRight={<ArrowNarrowRightIcon />}
              colorScheme="primary"
              mt={8}
            >
              Schedule A Demo
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
        <Flex container direction="row-reverse">
          <Flex xs={12} md={6} className={styles.sectionContent}>
            <Heading className={styles.sectionTitle1} mb={5}>
              Create An Inclusive Culture
            </Heading>
            <Text>
              Diversify your talent pool and cultivate a culture of inclusion, collaboration, and
              innovation. Our cloaking mechanism ensures there will be no implicit biases in the
              recruiting process. Help build communities and keep families together.
            </Text>
            <ButtonBase
              as={Link}
              href="/signup/"
              accessoryRight={<ArrowNarrowRightIcon />}
              colorScheme="primary"
              mt={8}
            >
              List Jobs
            </ButtonBase>
          </Flex>
          <Flex xs={12} md={6} className={styles.imgWrapper}>
            <Image
              src={image4}
              layout={isTablet ? 'fill' : 'responsive'}
              objectFit="cover"
              alt=""
              width={0}
              height={0}
            />
          </Flex>
        </Flex>
      </Content>

      <Content
        as="section"
        className={styles.section}
        pt={36}
        pb={isTablet ? 36 : undefined}
        ph={4}
      >
        <Flex display="flex" alignItems="center" direction="column" xs={12} md={8}>
          <Text fontSize="4xl" fontWeight="700" textAlign="center">
            While other fair chance employment platforms only focus on bringing employers and
            employees together, The Way Out additionally focuses on development and retention by
            offering ongoing training and support opportunities.
          </Text>
          <ButtonBase
            as={Link}
            href="/signup/"
            accessoryRight={<ArrowNarrowRightIcon />}
            colorScheme="primary"
            variant="text"
            mt={2}
            fontSize="lg"
          >
            List a Job
          </ButtonBase>
        </Flex>
      </Content>

      <Content as="section">
        <Flex container>
          <Flex xs={12} md={6} className={styles.sectionContentWider}>
            <HowItWorks type={HowItWorksType.employer} />
          </Flex>
          <Flex xs={12} md={6} className={styles.imgWrapper}>
            <Image
              src={image5}
              alt=""
              layout={isTablet ? 'fill' : 'responsive'}
              objectFit="cover"
              width={0}
              height={0}
            />
          </Flex>
        </Flex>
      </Content>

      <Content as="section" className={classNames(styles.greenBg, styles.section)} pv={36} ph={4}>
        <Flex display="flex" alignItems="center" direction="column" xs={12} md={8}>
          <a href="https://www.inchecksolutions.com" target="_blank" rel="noopener noreferrer">
            <Image alt="" src={inCheckLogo} objectFit="contain" width={200} height={0} />
          </a>
          <Text className={styles.sectionTitle1} fontWeight="700" mb={5} textAlign="center">
            InCheck is our Fair Chance screening partner.
          </Text>
          <Text fontSize="xl" fontWeight="700" mb={8} textAlign="center" color="grey.600">
            Have you evaluated your screening program to ensure candidates are being fairly assessed
            for a role they are qualified to hold? InCheck can help. By practicing fair chance
            hiring, you can build a pool of qualified and diverse talent.
          </Text>
          <ButtonLink
            accessoryRight={<ArrowNarrowRightIcon />}
            colorScheme="primary"
            href="https://www.inchecksolutions.com/thewayout/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
          </ButtonLink>
        </Flex>
      </Content>
    </>
  );
};

EmployersPage.getLayout = (page) => (
  <MarketingLayout headerProps={{ transparent: true }} hero>
    {page}
  </MarketingLayout>
);

export default EmployersPage;
