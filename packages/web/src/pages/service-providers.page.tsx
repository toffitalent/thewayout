import { Box, ButtonLink, classNames, Content, Flex, Heading, Text } from '@disruptive-labs/ui';
import ArrowNarrowRightIcon from '@disruptive-labs/ui/dist/icons/ArrowNarrowRight';
import Image from 'next/legacy/image';
import hero from '@app/assets/images/service-providers/hero.jpg';
import image1 from '@app/assets/images/service-providers/image1.jpg';
import image2 from '@app/assets/images/service-providers/image2.jpg';
import image3 from '@app/assets/images/service-providers/image3.jpg';
import image4 from '@app/assets/images/service-providers/image4.jpg';
import image5 from '@app/assets/images/service-providers/image5.jpg';
import scheme1 from '@app/assets/images/service-providers/scheme1.png';
import scheme2 from '@app/assets/images/service-providers/scheme2.png';
import serviceProvider1 from '@app/assets/images/service-providers/serviceProvider1.jpg';
import serviceProvider2 from '@app/assets/images/service-providers/serviceProvider2.jpg';
import serviceProvider3 from '@app/assets/images/service-providers/serviceProvider3.jpg';
import serviceProvider4 from '@app/assets/images/service-providers/serviceProvider4.jpg';
import serviceProvider5 from '@app/assets/images/service-providers/serviceProvider5.jpg';
import serviceProvider6 from '@app/assets/images/service-providers/serviceProvider6.jpg';
import serviceProvider7 from '@app/assets/images/service-providers/serviceProvider7.jpg';
import { Hero } from '@app/components/Hero';
import { HowItWorks, HowItWorksType } from '@app/components/HowItWorks';
import { MarketingLayout } from '@app/components/Layout';
import { SEO } from '@app/components/SEO';
import { useIsTablet } from '@app/hooks';
import { NextPageWithLayout } from '@app/types';
import styles from './service-providers.module.scss';

const ServiceProvidersPage: NextPageWithLayout = () => {
  const isTablet = useIsTablet();
  return (
    <>
      <SEO
        title="Service Providers"
        description="Our algorithm matches job seekers with local service providers that can help with their support and professional needs, keeping families together."
      />
      <Hero
        heading="Maximize Your Community Impact"
        subheading="Our algorithm matches job seekers with local service providers that can help with their support and professional needs, keeping families together."
        image={hero}
        actions={[
          {
            href: 'mailto:support@twout.org',
            label: 'Add Your Organization',
            accessoryRight: <ArrowNarrowRightIcon />,
          },
        ]}
      />

      <Flex className={classNames(styles.section, styles.sectionServiceProviders)} ph={5}>
        <Heading className={styles.sectionTitle1} mb={12}>
          Our Service Providers
        </Heading>
        <Box>
          <Flex container justify="center">
            {[
              serviceProvider1,
              serviceProvider2,
              serviceProvider3,
              serviceProvider4,
              serviceProvider5,
              serviceProvider6,
              serviceProvider7,
            ].map((serviceProvider, index) => (
              <Flex
                item
                xs={3}
                mt={3}
                lg
                display="flex"
                justifyContent="center"
                height={10}
                className={styles.serviceProviderImg}
                // eslint-disable-next-line react/no-array-index-key
                key={index}
              >
                <Image
                  alt=""
                  src={serviceProvider}
                  objectFit="contain"
                  key={serviceProvider.src}
                  width={0}
                  height={0}
                />
              </Flex>
            ))}
          </Flex>
        </Box>
      </Flex>

      <Content as="section" mt={isTablet ? 24 : undefined}>
        <Flex container direction="row-reverse">
          <Flex xs={12} md={6} pv={24} className={styles.sectionContent}>
            <Heading className={styles.sectionTitle2} mb={10}>
              Why partner with us?
            </Heading>
            <Flex direction="row">
              <Flex display="flex" direction="column" width="1/2">
                <Image src={scheme1} alt="" objectFit="contain" width={160} height={160} />
                <Text mt={6} pr={isTablet ? 10 : 2}>
                  Retention rate. When employers, clients, and SSPs are engaged and actively using
                  the platform.
                </Text>
              </Flex>
              <Flex display="flex" direction="column" width="1/2">
                <Image src={scheme2} alt="" objectFit="contain" width={160} height={160} />
                <Text mt={6}>
                  Supportive Services. The average returning citizen requires minimum of 2
                  additional supportive services along with employment.
                </Text>
              </Flex>
            </Flex>
            <Text mt={12} fontWeight="700">
              As a member of our support network, you are integral to the success of our job
              seekers. Our holistic approach to supporting our clients through their personal and
              professional journey begins with you.
            </Text>
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

      <Content
        as="section"
        className={styles.section}
        pt={36}
        pb={isTablet ? 36 : undefined}
        ph={4}
      >
        <Text fontSize="4xl" fontWeight="700" textAlign="center">
          Why Partner With Us?
        </Text>
        <Text fontSize="xl" fontWeight="700" color="grey.600" mt={2}>
          Our software helps you improve case management outcomes and increase funding
          opportunities.
        </Text>
      </Content>

      <Content as="section">
        <Flex container direction="row-reverse">
          <Flex xs={12} md={6} className={styles.sectionContent}>
            <Heading className={styles.sectionTitle3} mb={5}>
              Modernize Your Case Management
            </Heading>
            <Text>
              Our dashboard allows you to scale your impact by focusing on clients that need your
              support the most. Manage case notes and communicate with your clients all in one
              place. No more notebooks and manilla folders!
            </Text>
            <ButtonLink
              href="mailto:support@twout.org"
              accessoryRight={<ArrowNarrowRightIcon />}
              colorScheme="primary"
              mt={8}
            >
              Add Organization
            </ButtonLink>
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
            <Heading className={styles.sectionTitle3} mb={5}>
              Receive New Client Referrals
            </Heading>
            <Text>
              Based on services provided and location, our algorithm matches you with new clients in
              your area. Or, you can onboard existing clients.
            </Text>
            <ButtonLink
              href="mailto:support@twout.org"
              accessoryRight={<ArrowNarrowRightIcon />}
              colorScheme="primary"
              mt={8}
            >
              Get Started
            </ButtonLink>
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
            <Heading className={styles.sectionTitle3} mb={5}>
              Track Your Impact
            </Heading>
            <Text>
              Get access to real time analytics, create impact reports to share with funders, and
              track your client and organization&apos;s engagement metrics
            </Text>
            <ButtonLink
              href="mailto:support@twout.org"
              accessoryRight={<ArrowNarrowRightIcon />}
              colorScheme="primary"
              mt={8}
            >
              Add Organization
            </ButtonLink>
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
        <Flex alignItems="center" display="flex" direction="column" xs={12} md={6}>
          <Text fontSize="xl" fontWeight="700" color="primary" mb={2}>
            Our Belief
          </Text>
          <Text fontSize="3xl" fontWeight="700" textAlign="center">
            &quot;It takes a village to raise a child, but it takes a community to support and
            uplift someone through the challenges and obstacles of life.&quot;
          </Text>
        </Flex>
      </Content>

      <Content as="section">
        <Flex container direction="row-reverse">
          <Flex xs={12} md={6} className={styles.sectionContentWider}>
            <HowItWorks type={HowItWorksType.serviceProviders} />
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
        <Text className={styles.sectionTitle2} fontWeight="700" mb={10} textAlign="center">
          Explore our service provider resources.
        </Text>
        <ButtonLink
          href="https://www.findhelp.org/"
          target="_blank"
          rel="noopener noreferrer"
          accessoryRight={<ArrowNarrowRightIcon />}
          colorScheme="primary"
        >
          Search For Additional Services
        </ButtonLink>
      </Content>
    </>
  );
};

ServiceProvidersPage.getLayout = (page) => (
  <MarketingLayout headerProps={{ transparent: true }} hero>
    {page}
  </MarketingLayout>
);

export default ServiceProvidersPage;
