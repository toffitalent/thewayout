import { Badge, Box, Button, Flex, Text } from '@disruptive-labs/ui';
import ArrowNarrowRightIcon from '@disruptive-labs/ui/dist/icons/ArrowNarrowRight';
import CheckIcon from '@disruptive-labs/ui/dist/icons/Check';
import { ReactNode } from 'react';
import { Job } from '@two/shared';
import { ExperienceLevel } from '@app/components/ExperienceLevel';
import { job as jobText } from '@app/data/jobText';
import { formatSalaryRange, noOffensesBadge } from '@app/utils';
import styles from './JobPreview.module.scss';

interface JobInfoItemProps {
  title?: string | ReactNode;
  content: ReactNode;
}

interface JobPreviewProps {
  job: Job;
  isApplied: boolean;
  isDisabled?: boolean;
  helperText?: string;
  handleApply: () => void;
}

function JobInfoItem({ title, content }: JobInfoItemProps) {
  return (
    <Flex justify="space-between" textAlign="left" mt={10}>
      {title && (
        <Box fontSize="xl" fontWeight="700" pb={4}>
          {title}
        </Box>
      )}
      {content}
    </Flex>
  );
}

export const JobPreview = ({
  job,
  isApplied,
  isDisabled,
  helperText,
  handleApply,
}: JobPreviewProps) => (
  <Flex>
    <Box pb={5} borderBottom>
      <Text fontWeight="700" fontSize="3xl">
        {job.title}
      </Text>
      <Flex display="flex" fontSize="sm" color="grey.600" flexWrap="wrap">
        <Text>{`${jobText[job.typeOfWork]} (${jobText[job.workingTime]})`}</Text>
        <Text>
          &nbsp;&#x2022;&nbsp;
          {formatSalaryRange(
            job.salaryOptions.min,
            job.salaryOptions.max,
            job.salaryOptions.salary,
          )}
        </Text>
        <Text>
          &nbsp;&#x2022;&nbsp;
          {`${job.applicationsCount || 0} Applicant${job.applicationsCount === 1 ? '' : 's'}`}
        </Text>
      </Flex>
      <Flex container spacing={2} pv={6}>
        {job.location?.city && (
          <Flex item>
            <Badge colorScheme="blue">{job.location.city}</Badge>
          </Flex>
        )}
        {noOffensesBadge(job.offensesTypes).map((el) => (
          <Flex item key={el}>
            <Badge colorScheme="blue">{el}</Badge>
          </Flex>
        ))}
      </Flex>

      <Button
        colorScheme="primary"
        accessoryRight={isApplied ? <CheckIcon /> : <ArrowNarrowRightIcon />}
        className={styles.buttonApply}
        onClick={handleApply}
        disabled={isDisabled}
      >
        {isApplied ? 'Applied' : 'Apply now'}
      </Button>
      {helperText && (
        <Text fontSize="sm" color="grey.600" mt={2}>
          {helperText}
        </Text>
      )}
      <Text mt={5}>{job.description}</Text>
    </Box>

    <JobInfoItem
      title="Responsibilities & Expectations"
      content={
        <Flex container direction="column" spacing={4}>
          {job.responsibilities.map((el) => (
            <Flex direction="row" item key={el}>
              <CheckIcon color="grey.600" height={6} width={6} mr={4} />
              <Text>{el}</Text>
            </Flex>
          ))}
        </Flex>
      }
    />

    <JobInfoItem
      title={
        <Box className={styles.skillsTitle}>
          <Text mr={4} className={styles.skillsTitleText}>
            Skills & Experience
          </Text>
          <ExperienceLevel level={job.experience} />
        </Box>
      }
      content={<Text>{job.skillsDescription}</Text>}
    />

    <JobInfoItem
      title="Pay & Benefits"
      content={
        <Flex container direction="column" spacing={4} mt={1}>
          {[job.salaryOptions.description, ...job.salaryOptions.bonuses].map((el) => (
            <Flex direction="row" item key={el}>
              <CheckIcon color="grey" height={6} width={6} mr={4} />
              <Text>{el}</Text>
            </Flex>
          ))}
        </Flex>
      }
    />

    <Button
      colorScheme="primary"
      accessoryRight={isApplied ? <CheckIcon /> : <ArrowNarrowRightIcon />}
      mt={5}
      className={styles.buttonApply}
      onClick={handleApply}
      disabled={isDisabled}
    >
      {isApplied ? 'Applied' : 'Apply now'}
    </Button>
    {helperText && (
      <Text fontSize="sm" color="grey.600" mt={2}>
        {helperText}
      </Text>
    )}
  </Flex>
);
