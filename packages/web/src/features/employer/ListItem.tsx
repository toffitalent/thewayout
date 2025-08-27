import { Badge, Box, Flex, Text } from '@disruptive-labs/ui';
import BriefcaseIcon from '@disruptive-labs/ui/dist/icons/Briefcase';
import PencilIcon from '@disruptive-labs/ui/dist/icons/Pencil';
import { useRouter } from 'next/router';
import {
  JobListItem,
  JobStatus,
  offenseCategories,
  OffenseCategoryType,
  VeteranOrJustice,
} from '@two/shared';
import { job } from '@app/data/jobText';
import { formatSalaryRange } from '@app/utils';

export const ListItem = ({
  title,
  description,
  workingTime,
  salaryOptions,
  location,
  applicationsCount,
  pendingApplicationsCount,
  id,
  status,
  typeOfWork,
  offensesTypes,
  veteranOrJustice,
  onClick,
}: JobListItem & { onClick: (id: string) => void }) => {
  const router = useRouter();

  const noOffensesBadge = Object.values(OffenseCategoryType)
    .filter((el) => !offensesTypes.includes(el))
    .map((offense) => `NO ${offenseCategories[offense].name.toUpperCase()} OFFENSES`);

  return (
    <Flex borderBottom pv={5} direction="row">
      <Flex
        rounded
        bgcolor="orange.200"
        display="flex"
        p={3}
        mr={5}
        style={{ height: 'fit-content' }}
      >
        <BriefcaseIcon color="orange.800" width={6} height={6} />
      </Flex>
      <Flex>
        <Flex display="flex" alignItems="center">
          <Box onClick={() => onClick(id)} style={{ cursor: 'pointer' }}>
            <Text fontSize="xl" fontWeight="700">
              {title}
            </Text>
          </Box>
          <PencilIcon
            height={6}
            width={6}
            color="primary"
            ml={1}
            cursor="pointer"
            onClick={() => router.push(`/employer/edit-job/${id}`)}
          />
        </Flex>
        <Flex display="flex" fontSize="sm" color="grey.600" flexWrap="wrap">
          <Text>{`${job[typeOfWork]} (${job[workingTime]})`}&nbsp;&#x2022;&nbsp;</Text>
          <Text>
            {formatSalaryRange(salaryOptions.min, salaryOptions.max, salaryOptions.salary)}
            &nbsp;&#x2022;&nbsp;
          </Text>
          <Text>{`${applicationsCount || 0} Applicant${applicationsCount === 1 ? '' : 's'}`}</Text>
        </Flex>
        <Text mv={4}>{description}</Text>
        <Flex container spacing={2}>
          <Flex item>
            <Badge colorScheme={status === JobStatus.active ? 'green' : 'orange'}>{status}</Badge>
          </Flex>
          {!!pendingApplicationsCount && (
            <Flex item>
              <Badge colorScheme="blue">{`${pendingApplicationsCount} CANDIDATE${
                pendingApplicationsCount === 1 ? '' : 'S'
              } WAITING`}</Badge>
            </Flex>
          )}
          {veteranOrJustice.includes(VeteranOrJustice.justiceImpacted) &&
            noOffensesBadge.map((el) => (
              <Flex item key={el}>
                <Badge>{el}</Badge>
              </Flex>
            ))}
          {location?.city && (
            <Flex item>
              <Badge>{location.city}</Badge>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
