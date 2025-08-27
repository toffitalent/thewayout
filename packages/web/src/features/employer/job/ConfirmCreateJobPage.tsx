import { Button, Flex, Text } from '@disruptive-labs/ui';
import ArrowNarrowRightIcon from '@disruptive-labs/ui/dist/icons/ArrowNarrowRight';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { SEO } from '@app/components/SEO';

export const ConfirmCreateJobPage = () => {
  const router = useRouter();

  const handleClick = useCallback(() => router.replace('/employer/'), [router]);

  return (
    <>
      <SEO title="Job Created" />
      <Flex maxWidth={96} ml="auto" mr="auto">
        <Text fontSize="2xl" fontWeight="700" mb={2}>
          Great! 🎉
        </Text>
        <Text>Your job offer is ready. Go to your dashboard and check the offer.</Text>
        <Button
          colorScheme="primary"
          mt={10}
          fluid
          onClick={handleClick}
          accessoryRight={<ArrowNarrowRightIcon />}
        >
          View Job Post
        </Button>
      </Flex>
    </>
  );
};
