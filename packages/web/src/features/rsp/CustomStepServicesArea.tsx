import {
  Button,
  Combobox,
  ComboboxInput,
  ComboboxLabel,
  ComboboxMenu,
  Flex,
  Tag,
  TagButton,
  TagLabel,
  Text,
  useWizardContext,
  WizardStep,
} from '@disruptive-labs/ui';
import XIcon from '@disruptive-labs/ui/dist/icons/X';
import { ChangeEvent, ReactNode, useRef, useState } from 'react';
import { counties } from '@two/shared';
import styles from './CustomStepServicesArea.module.scss';
import type { WizardRspData } from './rspData';

interface ServiceAreaFormProps {
  data: string[];
  label: ReactNode;
  name: string;
  buttonLabel?: string;
  isCreator?: boolean;
  onSubmit: ({ areas }: { areas: string[] }) => void;
}

export const ServiceAreaForm = ({
  data,
  label,
  name,
  buttonLabel,
  isCreator = false,
  onSubmit,
}: ServiceAreaFormProps) => {
  const [areas, setAreas] = useState<string[]>(data);
  const [area, setArea] = useState<string>('');
  const ref = useRef<HTMLInputElement | null>(null);

  const handleRemove = (area: string) => {
    if (areas && areas.length) {
      const i = areas.indexOf(area);
      const newAreas = [...areas];
      newAreas.splice(i, 1);

      setAreas(newAreas);
    }
  };

  const isValid = () => {
    if (isCreator && !(areas || []).length) {
      return false;
    }

    if (!isCreator) {
      if (!areas.length) {
        return false;
      }
      return !(
        data.length === areas.length &&
        [...data].sort().every((el, index) => el === [...areas].sort()[index])
      );
    }

    return true;
  };

  return (
    <>
      <Combobox
        options={counties}
        onSelectedItemChange={({ selectedItem }) => {
          if (selectedItem && !(areas || []).includes(selectedItem)) {
            setAreas([...(areas || []), ...(selectedItem ? [selectedItem] : [])]);
            setArea('');
          }
          ref.current?.blur();
        }}
        selectedItem={area}
      >
        <Flex width={96} className="combobox">
          <ComboboxLabel>{label}</ComboboxLabel>
          <ComboboxInput
            name={name}
            value={area}
            width={96}
            onChange={({ target }: ChangeEvent<HTMLInputElement>) => setArea(target.value)}
            ref={ref}
          />
        </Flex>
        <ComboboxMenu className="combobox" />
      </Combobox>
      {areas && !!areas.length && (
        <Flex>
          <Text mt={10} mb={4} fontWeight="700" fontSize="xl">
            Selected Service Areas
          </Text>
          <Flex direction="row" wrap="wrap" container spacing={4}>
            {areas.map((area) => (
              <Flex item key={area}>
                <Tag size="sm" colorScheme="grey">
                  <TagLabel>{area}</TagLabel>
                  <TagButton>
                    <XIcon onClick={() => handleRemove(area)} />
                  </TagButton>
                </Tag>
              </Flex>
            ))}
          </Flex>
        </Flex>
      )}
      <Button
        colorScheme="primary"
        fluid
        width={96}
        mt={8}
        onClick={() => onSubmit({ areas })}
        disabled={!isValid()}
      >
        {buttonLabel}
      </Button>
    </>
  );
};

export const CustomStepServicesArea = (props: Partial<WizardStep>) => {
  const { next, data } = useWizardContext<WizardRspData>();

  const handleSubmit = async ({ areas }: { areas: string[] }) => {
    await next({
      ...data,
      servicesArea: areas,
    });
  };

  const { fields, nextButtonLabel } = props;
  if (!fields) {
    return null;
  }
  const [servicesArea] = fields;

  return (
    <Flex className={styles.formWrapper}>
      <ServiceAreaForm
        data={data.servicesArea}
        label={servicesArea.label}
        name={servicesArea.name}
        buttonLabel={nextButtonLabel}
        isCreator
        onSubmit={handleSubmit}
      />
    </Flex>
  );
};
