import { Box, Button, Flex, Text, useWizardContext } from '@disruptive-labs/ui';
import PencilIcon from '@disruptive-labs/ui/dist/icons/Pencil';
import { ReactNode } from 'react';
import { EmployerCreateRequest as WizardData } from '@two/shared';
import styles from './CreatorProfile.module.scss';
import { Steps, stepsConfig } from './profileData';

interface ConfirmationItemProps {
  title: string;
  content: string | ReactNode;
  onClick: () => void;
}

function ConfirmationItem({ title, content, onClick }: ConfirmationItemProps) {
  return (
    <Flex
      direction="row"
      justify="space-between"
      borderBottom={1}
      pv={4}
      className={styles.confirmItem}
    >
      <Flex textAlign="left">
        <Text fontSize="sm" color="grey.500" pb={1}>
          {title}
        </Text>
        <Box fontWeight="700">{content}</Box>
      </Flex>
      <Flex justify="flex-start">
        <Button color="primary" variant="text" onClick={onClick} accessoryLeft={<PencilIcon />}>
          Edit
        </Button>
      </Flex>
    </Flex>
  );
}

export function ConfirmationStep({ onSubmit }: { onSubmit: (data: WizardData) => void }) {
  const { goTo, data } = useWizardContext<WizardData>();

  return (
    <Flex maxWidth={96} ml="auto" mr="auto">
      <Box>
        <ConfirmationItem
          title={stepsConfig[Steps.name].title}
          content={<Text>{data[Steps.name]}</Text>}
          onClick={() => goTo(stepsConfig[Steps.name].id)}
        />
        <ConfirmationItem
          title={stepsConfig[Steps.industry].title}
          content={<Text>{data[Steps.industry]}</Text>}
          onClick={() => goTo(stepsConfig[Steps.industry].id)}
        />
        <ConfirmationItem
          title={stepsConfig[Steps.description].title}
          content={<Text>{data[Steps.description]}</Text>}
          onClick={() => goTo(stepsConfig[Steps.description].id)}
        />
        <ConfirmationItem
          title="Years in Business"
          content={<Text>{data.yearsInBusiness}</Text>}
          onClick={() => goTo(stepsConfig[Steps.details].id)}
        />
        <ConfirmationItem
          title="Number of Employees"
          content={<Text>{data.numberOfEmployees}</Text>}
          onClick={() => goTo(stepsConfig[Steps.details].id)}
        />
        <ConfirmationItem
          title={stepsConfig[Steps.location].title}
          content={
            <>
              <Text>{data.address}</Text>
              <Text>
                {data.city}, {data.state} {data.postalCode}
              </Text>
            </>
          }
          onClick={() => goTo(stepsConfig[Steps.location].id)}
        />
      </Box>
      <Button colorScheme="primary" mt={12} fluid onClick={() => onSubmit(data as WizardData)}>
        Confirm
      </Button>
    </Flex>
  );
}
