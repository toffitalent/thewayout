import { Badge, Box, Flex, Text } from '@disruptive-labs/ui';
import BriefcaseIcon from '@disruptive-labs/ui/dist/icons/Briefcase';
import { JobListItem } from '@two/shared';
import { job } from '@app/data/jobText';
import { formatSalaryRange, noOffensesBadge } from '@app/utils';
import styles from './ListItem.module.scss';

export const ListItem = ({
  id,
  title,
  typeOfWork,
  workingTime,
  description,
  salaryOptions,
  location,
  offensesTypes,
  applicationsCount,
  onClick,
}: JobListItem & { onClick: (id: string) => void }) => (
  <Flex pt={5} borderBottom onClick={() => onClick(id)} className={styles.listItem}>
    <Flex direction="row" mb={5}>
      <Box bgcolor="orange.200" className={styles.icon} mr={5} rounded>
        <BriefcaseIcon height={6} width={6} color="orange.800" />
      </Box>
      <Box>
        <Text fontSize="xl" fontWeight="700">
          {title}
        </Text>
        <Flex display="flex" fontSize="sm" color="grey.600" flexWrap="wrap">
          <Text>{`${job[typeOfWork]} (${job[workingTime]})`}</Text>
          <Text>
            &nbsp;&#x2022;&nbsp;
            {formatSalaryRange(salaryOptions.min, salaryOptions.max, salaryOptions.salary)}
          </Text>
          <Text>
            &nbsp;&#x2022;&nbsp;
            {`${applicationsCount || 0} Applicant${applicationsCount === 1 ? '' : 's'}`}
          </Text>
        </Flex>

        <Text color="grey.600" pv={4}>
          {description}
        </Text>

        <Flex container spacing={2}>
          {location?.city && (
            <Flex item>
              <Badge colorScheme="blue">{location.city}</Badge>
            </Flex>
          )}
          {noOffensesBadge(offensesTypes).map((el) => (
            <Flex item key={el}>
              <Badge colorScheme="blue">{el}</Badge>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Flex>
  </Flex>
);
