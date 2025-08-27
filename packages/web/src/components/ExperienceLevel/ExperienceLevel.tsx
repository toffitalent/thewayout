import { Box, Flex, Text } from '@disruptive-labs/ui';
import { Experience } from '@two/shared';

const count = {
  [Experience.low]: 1,
  [Experience.entry]: 2,
  [Experience.mid]: 3,
  [Experience.high]: 4,
  [Experience.professional]: 5,
};

export const ExperienceLevel = ({ level }: { level: Experience }) => (
  <Flex direction="row" display="flex" alignItems="center">
    <Text fontWeight="700" fontSize="xs" mr={2}>
      {level.toUpperCase()}
    </Text>
    <Box height={4} width={4} rounded="3xl" bgcolor="primary" mr={1} />
    <Box
      height={4}
      width={4}
      rounded="3xl"
      bgcolor={count[level] >= 2 ? 'primary' : 'grey.200'}
      mr={1}
    />
    <Box
      height={4}
      width={4}
      rounded="3xl"
      bgcolor={count[level] >= 3 ? 'primary' : 'grey.200'}
      mr={1}
    />
    <Box
      height={4}
      width={4}
      rounded="3xl"
      bgcolor={count[level] >= 4 ? 'primary' : 'grey.200'}
      mr={1}
    />
    <Box
      height={4}
      width={4}
      rounded="3xl"
      bgcolor={count[level] === 5 ? 'primary' : 'grey.200'}
      mr={1}
    />
  </Flex>
);
