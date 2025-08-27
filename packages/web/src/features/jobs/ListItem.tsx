import { Box, Flex, Text } from '@disruptive-labs/ui';
import ClockIcon from '@disruptive-labs/ui/dist/icons/Clock';
import CurrencyDollarIcon from '@disruptive-labs/ui/dist/icons/CurrencyDollar';
import TagIcon from '@disruptive-labs/ui/dist/icons/Tag';
import { JobListItem } from '@two/shared';
import { job } from '@app/data/jobText';
import { formatSalaryRange, getDaysInPast } from '@app/utils';
import styles from './ListItem.module.scss';

export const ListItem = ({
  id,
  title,
  department,
  workingTime,
  salaryOptions,
  createdAt,
  onClick,
}: JobListItem & { onClick: (id: string) => void }) => {
  const details = [
    { icon: <ClockIcon color="grey.300" />, label: job[workingTime] },
    {
      icon: <CurrencyDollarIcon color="grey.300" />,
      label: formatSalaryRange(salaryOptions.min, salaryOptions.max, salaryOptions.salary),
    },
  ];

  return (
    <Flex p={5} className={styles.listItem} onClick={() => onClick(id)}>
      <Flex direction="row" mb={4}>
        <Box
          height={14}
          width={14}
          rounded="xl"
          bgcolor="grey.100"
          justifyContent="center"
          display="flex"
          alignItems="center"
          mr={4}
        >
          <TagIcon height={6} width={6} />
        </Box>
        <Box>
          <Text fontSize="xl" fontWeight="700">
            {title}
          </Text>
          <Text>{department}</Text>
          <Text color="grey.400">{`Posted ${getDaysInPast(createdAt)}`}</Text>
        </Box>
      </Flex>

      <Flex container>
        <Flex item direction="row" wrap="wrap" container spacing={4} xs={12} md={8}>
          {details.map((el) => (
            <Flex item key={el.label}>
              <Flex pv={2} ph={4} key={el.label} rounded="3xl" border borderColor="grey.300">
                <Box display="flex" flexDirection="row" alignItems="center">
                  {el.icon}
                  <Text ml={2}>{el.label}</Text>
                </Box>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
