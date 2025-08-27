import { Box, Flex, Text } from '@disruptive-labs/ui';
import { ReactNode } from 'react';
import styles from './TabSectionWrapper.module.scss';

interface TabSectionWrapperProps {
  title: string | ReactNode;
  description?: string | ReactNode;
  children?: JSX.Element;
}

export const TabSectionWrapper = ({ title, description, children }: TabSectionWrapperProps) => (
  <Flex container borderBottom mt={5} pb={5} className={styles.wrapper}>
    <Flex item xs={12} md={4}>
      <Box className={styles.titleSection}>
        <Text fontSize="xl" fontWeight="700">
          {title}
        </Text>
        {description && (
          <Text fontSize="sm" color="grey.600">
            {description}
          </Text>
        )}
      </Box>
    </Flex>
    <Flex item xs={12} md={8}>
      {children}
    </Flex>
  </Flex>
);
