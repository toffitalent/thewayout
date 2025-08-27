import { Box, ButtonBase, classNames, Content, Flex, Heading, Text } from '@disruptive-labs/ui';
import ArrowNarrowRightIcon from '@disruptive-labs/ui/dist/icons/ArrowNarrowRight';
import SmartHomeIcon from '@disruptive-labs/ui/dist/icons/SmartHome';
import ThumbUpIcon from '@disruptive-labs/ui/dist/icons/ThumbUp';
import UserPlusIcon from '@disruptive-labs/ui/dist/icons/UserPlus';
import Image from 'next/legacy/image';
import Link from 'next/link';
import employer1 from '@app/assets/images/main/employer1.jpg';
import employer2 from '@app/assets/images/main/employer2.jpg';
import employer3 from '@app/assets/images/main/employer3.jpg';
import employer4 from '@app/assets/images/main/employer4.jpg';
import employer5 from '@app/assets/images/main/employer5.jpg';
import employer6 from '@app/assets/images/main/employer6.jpg';
import employer7 from '@app/assets/images/main/employer7.jpg';
import hero from '@app/assets/images/main/hero.jpg';
import image1 from '@app/assets/images/main/image1.jpg';
import image2 from '@app/assets/images/main/image2.jpg';
import image3 from '@app/assets/images/main/image3.jpg';
import image4 from '@app/assets/images/main/image4.jpg';
import testimonial1 from '@app/assets/images/main/testimonial1.jpg';
import testimonial2 from '@app/assets/images/main/testimonial2.jpg';
import testimonial3 from '@app/assets/images/main/testimonial3.jpg';
import { Hero } from '@app/components/Hero';
import { HowItWorks, HowItWorksType } from '@app/components/HowItWorks';
import { MarketingLayout } from '@app/components/Layout';
import { SEO } from '@app/components/SEO';
import { Testimonial } from '@app/components/Testimonial';
import { useIsTablet } from '@app/hooks';
import { NextPageWithLayout } from '@app/types';
import styles from './index.module.scss';

const info = [
  {
    text: 'Free for all Job Seekers',
    icon: <UserPlusIcon className={styles.infoIcon} />,
    key: 'info-1',
  },
  {
    text: 'All employers are 100% committed to fair chance hiring.',
    icon: <ThumbUpIcon className={styles.infoIcon} />,
    key: 'info-2',
  },
  {
    text: (
      <>
        Access to a network of&nbsp;
        <Link href="/service-providers">Supportive Services Providers</Link>
      </>
    ),
    icon: <SmartHomeIcon className={styles.infoIcon} />,
    key: 'info-3',
  },
];

const HomePage: NextPageWithLayout = () => {
  const isTablet = useIsTablet();

  return (
    <>
      <SEO
        title="Fair Chance Employment Platform"
        description="Criminal Record? No problem. The Way Out was founded by two justice impacted individuals that believe in the power of utilizing difficult past experiences to create an even better future. That's why they decided to create the most felon-friendly second chance employment platform in America."
      />
      <Hero
        heading="Fair Chance Employment Platform"
        subheading="Solving America's workforce shortage through fair chance employment."
        actions={[
          {
            href: '/job-seekers/',
            label: 'For Job Seekers',
            accessoryRight: <ArrowNarrowRightIcon />,
          },
          {
            href: '/employers/',
            label: 'For Employers',
            variant: 'outline',
            colorScheme: 'white',
            accessoryRight: <ArrowNarrowRightIcon />,
          },
        ]}
        image={hero}
      />

      <Flex className={classNames(styles.section, styles.sectionHidden)} mv={24} ph={5}>
        <Heading className={styles.sectionTitle} mb={12}>
          Our Employers
        </Heading>
        <Box>
          <Flex container justify="center">
            {[employer1, employer2, employer3, employer4, employer5, employer6, employer7].map(
              (employerImage, index) => (
                <Flex
                  item
                  xs={3}
                  mt={3}
                  lg
                  display="flex"
                  justifyContent="center"
                  height={10}
                  className={styles.employerImg}
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                >
                  <Image alt="" src={employerImage} objectFit="contain" width={0} height={0} />
                </Flex>
              ),
            )}
          </Flex>
        </Box>
      </Flex>

      <Content as="section">
        <Flex container direction="row-reverse">
          <Flex xs={12} md={6} className={classNames(styles.greyBg, styles.sectionDescription)}>
            <Heading className={styles.sectionTitle} mb={5}>
              Reentering the workforce? No problem.
            </Heading>
            <Text>
              The Way Out was founded by two justice impacted individuals (one a Navy Veteran) that
              believe in the power of utilizing difficult past experiences to create an even better
              future. That&apos;s why they decided to create the most felon-friendly second chance
              employment platform in America.
            </Text>
            <Flex>
              {info.map((el) => (
                <Flex
                  borderBottom
                  pv={10}
                  direction="row"
                  alignItems="center"
                  className={styles.infoItem}
                  key={el.key}
                >
                  {el.icon}
                  <Text fontWeight="700" ml={5}>
                    {el.text}
                  </Text>
                </Flex>
              ))}
            </Flex>
            <Flex direction="row">
              <ButtonBase
                as={Link}
                href="/job-seekers/"
                accessoryRight={<ArrowNarrowRightIcon />}
                colorScheme="primary"
              >
                For Job Seekers
              </ButtonBase>
              <ButtonBase
                as={Link}
                href="/employers/"
                accessoryRight={<ArrowNarrowRightIcon />}
                colorScheme="primary"
                variant="outline"
                ml={2}
              >
                For Employers
              </ButtonBase>
            </Flex>
          </Flex>
          <Flex xs={12} md={6} className={styles.imgWrapper}>
            <Image
              src={image1}
              layout={isTablet ? 'fill' : 'responsive'}
              width={0}
              height={0}
              objectFit="cover"
              alt=""
              priority
            />
          </Flex>
        </Flex>
      </Content>

      <Content as="section">
        <Flex container>
          <Flex xs={12} md={6} className={styles.sectionDescription} bgcolor="grey.900">
            <Heading className={styles.sectionTitle} mb={5} color="light">
              There&apos;s Power in Your Story
            </Heading>
            <Text color="light">
              Our contextualized software takes into consideration all of your personal, life, armed
              forces and professional experiences when matching you with employment opportunities.
            </Text>
            <ButtonBase
              as={Link}
              href="/jobs/"
              accessoryRight={<ArrowNarrowRightIcon />}
              colorScheme="primary"
              mt={8}
            >
              Find a Job
            </ButtonBase>
          </Flex>
          <Flex xs={12} md={6} className={styles.imgWrapper}>
            <Image
              src={image2}
              alt=""
              layout={isTablet ? 'fill' : 'responsive'}
              objectFit="cover"
              height={0}
              width={0}
            />
          </Flex>
        </Flex>
      </Content>

      <Content as="section">
        <Flex container flexDirection="row-reverse">
          <Flex xs={12} md={6} className={styles.sectionDescription}>
            <HowItWorks type={HowItWorksType.jobSeeker} />
          </Flex>
          <Flex xs={12} md={6} className={styles.imgWrapper}>
            <Image
              src={image3}
              alt=""
              layout={isTablet ? 'fill' : 'responsive'}
              objectFit="cover"
              height={0}
              width={0}
            />
          </Flex>
        </Flex>
      </Content>

      <Content as="section">
        <Flex container direction="row-reverse">
          <Flex xs={12} md={6} className={styles.sectionDescription} bgcolor="grey.900">
            <Heading className={styles.sectionTitle} mb={5} color="light">
              For Employers
            </Heading>
            <Text color="light">
              While other fair chance employment platforms only focus on bringing employers and
              employees together, The Way Out additionally focuses on development and retention by
              offering ongoing training and support opportunities.
            </Text>
            <ButtonBase
              as={Link}
              href="/employers/"
              accessoryRight={<ArrowNarrowRightIcon />}
              colorScheme="primary"
              mt={8}
            >
              Learn more
            </ButtonBase>
          </Flex>
          <Flex xs={12} md={6} className={styles.imgWrapper}>
            <Image
              src={image4}
              alt=""
              layout={isTablet ? 'fill' : 'responsive'}
              objectFit="cover"
              height={0}
              width={0}
            />
          </Flex>
        </Flex>
      </Content>

      <Content as="section" className={styles.section} mv={24} textAlign="center">
        <Flex maxWidth={isTablet ? '1/2' : undefined} ph={4}>
          <Text fontSize="lg" color="primary" fontWeight="700" mb={5}>
            For Service Providers
          </Text>
          <Text fontSize="3xl" fontWeight="700">
            Our platform simplifies your process, allowing your organization to provide even better
            services at scale while improving employment outcomes for your clients.
          </Text>
          <Flex direction="row" justify="center" mt={10}>
            <ButtonBase
              as={Link}
              href="/signup/"
              accessoryRight={<ArrowNarrowRightIcon />}
              colorScheme="primary"
            >
              Become A Partner
            </ButtonBase>
            <ButtonBase
              as={Link}
              href="/service-providers/"
              accessoryRight={<ArrowNarrowRightIcon />}
              colorScheme="primary"
              variant="outline"
              ml={2}
            >
              Learn more
            </ButtonBase>
          </Flex>
        </Flex>
      </Content>

      <Content
        as="section"
        bgcolor="grey.900"
        className={styles.section}
        pv={24}
        ph={8}
        textAlign="center"
      >
        <Text fontSize="lg" color="primary" mb={2}>
          True Stories
        </Text>
        <Heading color="light" className={styles.sectionTitle}>
          What others say about The Way Out
        </Heading>
        <Flex container mt={24} spacing={isTablet ? 4 : 12}>
          <Flex item xs={12} md={4}>
            <Testimonial
              author="Daniel - Job Seeker"
              title="I found my dream job!"
              body="After creating an account with The Way Out and answering a few questions, like what are things I'm interested in, my personal strengths, my skill sets, credentials and certifications, I received notice of my dream job."
              image={testimonial1}
            />
          </Flex>
          <Flex item xs={12} md={4}>
            <Testimonial
              author="Anthony - Employer"
              title="Great hiring experience!"
              body="The Way Out recommended an applicant with no information that we could use to identify them. We decided to interview this person, interviewed them, and they've occupied that role now for almost a year very successfully."
              image={testimonial2}
            />
          </Flex>
          <Flex item xs={12} md={4}>
            <Testimonial
              author="Caroline - Service Provider"
              title="We love The Way Out!"
              body="We love sending our clients to The Way Out! Not only are our clients able to find great jobs, but we're also able to keep our clients on track in meeting their personal and professional life through the app."
              image={testimonial3}
            />
          </Flex>
        </Flex>
      </Content>

      <Content
        as="section"
        className={classNames(styles.greenBg, styles.section, styles.sectionHidden)}
        pv={36}
        ph={4}
      >
        <Text className={styles.sectionTitle} fontWeight="700" mb={10} textAlign="center">
          See the impact we&apos;ve made in the fight against recidivism.
        </Text>
        <ButtonBase
          as={Link}
          href="/"
          accessoryRight={<ArrowNarrowRightIcon />}
          colorScheme="primary"
        >
          View Impact Report
        </ButtonBase>
      </Content>
    </>
  );
};

HomePage.getLayout = (page) => (
  <MarketingLayout headerProps={{ transparent: true }} hero dashboardRedirection>
    {page}
  </MarketingLayout>
);

export default HomePage;
