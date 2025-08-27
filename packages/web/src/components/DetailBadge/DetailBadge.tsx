import { Box, Flex, Text } from '@disruptive-labs/ui';
import styles from './DetailBadge.module.scss';

interface DetailBadgeProps {
  icon: JSX.Element;
  label: string;
}

export const DetailBadge = ({ icon, label }: DetailBadgeProps) => (
  <Flex>
    <Box
      display="flex"
      flexDirection="row"
      color="primary"
      className={styles.detailBadge}
      ph={4}
      alignItems="center"
    >
      {icon}
      <Text ml={2}>{label}</Text>
    </Box>
  </Flex>
);
