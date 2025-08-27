import { Box, Button, Flex, Text, useWizardContext } from '@disruptive-labs/ui';
import CalendarEventIcon from '@disruptive-labs/ui/dist/icons/CalendarEvent';
import CheckIcon from '@disruptive-labs/ui/dist/icons/Check';
import ClockIcon from '@disruptive-labs/ui/dist/icons/Clock';
import CurrencyDollarIcon from '@disruptive-labs/ui/dist/icons/CurrencyDollar';
import InfoCircleIcon from '@disruptive-labs/ui/dist/icons/InfoCircle';
import MapPinIcon from '@disruptive-labs/ui/dist/icons/MapPin';
import PencilIcon from '@disruptive-labs/ui/dist/icons/Pencil';
import StarIcon from '@disruptive-labs/ui/dist/icons/Star';
import UsersIcon from '@disruptive-labs/ui/dist/icons/Users';
import { ReactNode } from 'react';
import { TypeOfWork } from '@two/shared';
import { DetailBadge } from '@app/components/DetailBadge';
import { ExperienceLevel } from '@app/components/ExperienceLevel';
import { job } from '@app/data/jobText';
import { months } from '@app/data/months';
import { formatSalaryRange } from '@app/utils';
import { Steps, stepsConfig } from './createJobData';
import { WizardData } from './createJobDataTypes';
import styles from './Wizard.module.scss';

interface ConfirmationItemProps {
  title?: string | ReactNode;
  content: ReactNode;
  onClick: () => void;
}

function ConfirmationItem({ title, content, onClick }: ConfirmationItemProps) {
  return (
    <Flex justify="space-between" pv={5} className={styles.confirmItem}>
      <Flex textAlign="left">
        {title && (
          <Box fontSize="xl" fontWeight="700" pb={4}>
            {title}
          </Box>
        )}
        {content}
      </Flex>
      <Flex justify="flex-end" className={styles.confirmItemEdit}>
        <Button color="primary" variant="text" onClick={onClick} accessoryLeft={<PencilIcon />}>
          Edit
        </Button>
      </Flex>
    </Flex>
  );
}

export function ConfirmationStep({ onSubmit }: { onSubmit: (data: WizardData) => void }) {
  const { goTo, data, setData } = useWizardContext<WizardData>();

  const details = [
    ...(data.city ? [{ icon: <MapPinIcon />, label: data.city }] : []),
    { icon: <UsersIcon />, label: data.department },
    { icon: <CalendarEventIcon />, label: `From ${months[data.startAtMonth]} ${data.startAtYear}` },
    {
      icon: <CurrencyDollarIcon />,
      label: formatSalaryRange(data.min, data.max, data.salary),
    },
    { icon: <InfoCircleIcon />, label: job[data.typeOfWork] },
    { icon: <ClockIcon />, label: job[data.workingTime] },
    { icon: <StarIcon />, label: `Experience: ${data.experience.toUpperCase()}` },
  ];

  if (data.typeOfWork !== TypeOfWork.onsite && data.address) {
    setData({
      ...data,
      address: undefined,
      city: undefined,
      state: undefined,
      postalCode: undefined,
    });
  }

  return (
    <>
      <Button
        maxWidth={96}
        ml="auto"
        mr="auto"
        colorScheme="primary"
        mt={2}
        fluid
        onClick={() => onSubmit(data)}
      >
        Save
      </Button>
      <Flex border rounded="xl" mt={10} className={styles.confirmWrapper}>
        <Box>
          <ConfirmationItem
            title={data.title}
            content={<Text fontWeight="700">{data.description}</Text>}
            onClick={() => goTo(stepsConfig[Steps.details].id)}
          />
          <ConfirmationItem
            content={
              <Flex direction="row" wrap="wrap" container spacing={4}>
                {details.map((el) => (
                  <Flex item key={el.label}>
                    <DetailBadge {...el} />
                  </Flex>
                ))}
              </Flex>
            }
            onClick={() => goTo(stepsConfig[Steps.details].id)}
          />
          <ConfirmationItem
            title={stepsConfig[Steps.responsibilities].title}
            content={
              <Flex container direction="column" spacing={4}>
                {data.responsibilities.map((el) => (
                  <Flex direction="row" item key={el}>
                    <CheckIcon color="primary" height={6} width={6} mr={4} />
                    <Text>{el}</Text>
                  </Flex>
                ))}
              </Flex>
            }
            onClick={() => goTo(stepsConfig[Steps.responsibilities].id)}
          />
          <ConfirmationItem
            title={
              <Box className={styles.skillsTitle}>
                <Text mr={4} className={styles.skillsTitleText}>
                  {stepsConfig[Steps.skills].title}
                </Text>
                <ExperienceLevel level={data.experience} />
              </Box>
            }
            content={<Text>{data.skillsDescription}</Text>}
            onClick={() => goTo(stepsConfig[Steps.skills].id)}
          />
          <ConfirmationItem
            title={stepsConfig[Steps.pay].title}
            content={
              <>
                <Flex direction="row">
                  <CurrencyDollarIcon color="primary" height={6} width={6} mr={4} />
                  <Text fontWeight="700">{data.salaryDescription}</Text>
                </Flex>
                <Flex container direction="column" spacing={4} mt={1}>
                  {(data.bonuses || []).map((el) => (
                    <Flex direction="row" item key={el}>
                      <CheckIcon color="primary" height={6} width={6} mr={4} />
                      <Text>{el}</Text>
                    </Flex>
                  ))}
                </Flex>
              </>
            }
            onClick={() => goTo(stepsConfig[Steps.pay].id)}
          />
        </Box>
      </Flex>
    </>
  );
}
