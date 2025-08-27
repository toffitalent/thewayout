import { Button, Flex, Text } from '@disruptive-labs/ui';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { SEO } from '@app/components/SEO';

export const ConfirmCreateProfilePage = () => {
  const router = useRouter();

  const handleClick = useCallback(() => router.replace('/employer/'), [router]);

  return (
    <>
      <SEO title="Profile Created" />
      <Flex maxWidth={96} ml="auto" mr="auto">
        <Text fontSize="2xl" fontWeight="700">
          Employer added!
        </Text>
        <Button colorScheme="primary" mt={10} fluid onClick={handleClick}>
          Done!
        </Button>
      </Flex>
    </>
  );
};
