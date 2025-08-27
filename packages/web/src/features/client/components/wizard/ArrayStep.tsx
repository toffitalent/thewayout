import {
  Button,
  Field,
  Flex,
  Text,
  useForm,
  useWizardContext,
  WizardChoices,
} from '@disruptive-labs/ui';
import PencilIcon from '@disruptive-labs/ui/dist/icons/Pencil';
import XIcon from '@disruptive-labs/ui/dist/icons/X';
import { useEffect, useState } from 'react';
import { RelativeExperience } from '@two/shared';
import { clientProfile } from '@app/data/clientProfileText';
import { getConditionalPropsParams } from '@app/utils';
import {
  ArrayStepItem,
  ArrayStepItems,
  ArrayStepWizardData,
  AvailableKeys,
  CustomWizardField,
  CustomWizardStep,
  StepsClient,
} from '../../profileDataTypes';
import styles from './ArrayStep.module.scss';

interface ArrayStepListItemProps {
  title: string;
  text1: string;
  text2?: string;
  id: number;
  isRemovable?: boolean;
  onEdit: (id: number) => void;
  onRemove: (id: number) => void;
}
const ArrayStepListItem = ({
  title,
  text1,
  text2,
  id,
  onEdit,
  onRemove,
  isRemovable,
}: ArrayStepListItemProps) => (
  <Flex direction="row" justify="space-between" mt={5}>
    <Flex textAlign="left">
      <Text fontSize="xl" fontWeight="700">
        {title}
      </Text>
      <Text>{text1}</Text>
      {text2 && <Text color="grey.500">{text2}</Text>}
    </Flex>
    <Flex>
      <PencilIcon height={6} width={6} color="primary" onClick={() => onEdit(id)} />
      <XIcon
        height={6}
        width={6}
        ml={3}
        color={isRemovable ? 'primary' : 'grey'}
        onClick={() => (isRemovable ? onRemove(id) : undefined)}
        cursor={isRemovable ? 'pointer' : 'disabled'}
      />
    </Flex>
  </Flex>
);

export interface ArrayStepProps extends CustomWizardStep {
  minimalItems: number;
  showListInEditMode?: boolean;
  initialData: any;
  headerTitle?: string;
  headerDescription?: string;
  getListItemExtraContent?: (item: any) => string;
  titleFieldName: AvailableKeys;
  text1FieldName: AvailableKeys;
}

export const ArrayStep = ({
  minimalItems,
  showListInEditMode = true,
  initialData,
  headerTitle,
  headerDescription,
  getListItemExtraContent,
  titleFieldName,
  text1FieldName,
  ...currentStep
}: ArrayStepProps) => {
  const { data, setData, next } = useWizardContext<ArrayStepWizardData>();
  const { id, fields } = currentStep;
  const items: ArrayStepItems = data[id as keyof ArrayStepWizardData] || [];

  const [mode, setMode] = useState<'edit' | 'list'>(items.length ? 'list' : 'edit');
  const [editData, setEditData] = useState<{ id: number; data: ArrayStepItem } | undefined>();

  const valuesToSetData = (id: StepsClient, items: ArrayStepItems) => {
    if (id === StepsClient.relativeExperience) {
      return (items as (RelativeExperience & { stillWork: boolean })[]).map((experience) => ({
        ...experience,
        endAtMonth: experience.stillWork ? undefined : experience.endAtMonth,
        endAtYear: experience.stillWork ? undefined : experience.endAtYear,
      }));
    }
    return items;
  };

  const {
    submitForm,
    watch,
    getValues,
    reset,
    trigger,
    control,
    formState: { isSubmitting, isDirty, isValid, touchedFields },
  } = useForm({
    mode: 'onChange',
    defaultValues: editData ? editData.data : initialData,
    onSubmit: async (item: ArrayStepItem) => {
      const itemsToSave = [...items];
      if (editData) {
        itemsToSave[editData.id] = item;
        setData({ [id]: valuesToSetData(id, itemsToSave) } as ArrayStepWizardData);
      } else {
        setData({ [id]: valuesToSetData(id, [...itemsToSave, item]) } as ArrayStepWizardData);
      }
      setEditData(undefined);
      reset();
      setMode('list');
    },
  });

  const handleEdit = (index: number) => {
    setMode('edit');
    setEditData({ id: index, data: items[index] });
    reset(items[index]);
  };

  const handleRemove = (index: number) => {
    if (editData) {
      setEditData(undefined);
      setMode('list');
    }
    setData({
      [id]: items.filter((_: ArrayStepItem, i: number) => i !== index),
    } as ArrayStepWizardData);
  };

  let fieldsToWatchValues;
  const fieldsToWatch = getConditionalPropsParams(fields || []);
  if (fieldsToWatch.length) {
    fieldsToWatchValues = watch(fieldsToWatch);
  }

  useEffect(() => {
    const allFieldsSelected = !fieldsToWatch
      .filter((el) => el !== ('stillWork' as AvailableKeys))
      .find((fieldName) => !Object.keys(touchedFields).includes(fieldName));
    if (allFieldsSelected) {
      trigger(fieldsToWatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldsToWatchValues]);

  return (
    <Flex maxWidth={96} ml="auto" mr="auto">
      {headerTitle && headerDescription && (
        <>
          <Text fontSize="2xl" fontWeight="700" className={styles.arrayStepHeaderTitle}>
            {headerTitle}
          </Text>
          <Text className={styles.arrayStepHeaderDescription}>{headerDescription}</Text>
        </>
      )}
      {(showListInEditMode || mode === 'list') &&
        items.map((item, index) => (
          <ArrayStepListItem
            onEdit={handleEdit}
            onRemove={handleRemove}
            title={
              clientProfile[item[titleFieldName as keyof ArrayStepItem]] ||
              item[titleFieldName as keyof ArrayStepItem]
            }
            text1={
              clientProfile[item[text1FieldName as keyof ArrayStepItem]] ||
              item[text1FieldName as keyof ArrayStepItem]
            }
            text2={getListItemExtraContent && getListItemExtraContent(item)}
            id={index}
            isRemovable={items.length > minimalItems}
            key={JSON.stringify(item)}
          />
        ))}

      {mode === 'list' && (
        <Flex direction="row" justifyContent="center" mt={8}>
          <Button colorScheme="primary" variant="outline" ph={5} onClick={() => setMode('edit')}>
            Add new
          </Button>
          <Button colorScheme="primary" flex={1} ml={5} onClick={next}>
            Save & Next
          </Button>
        </Flex>
      )}

      {mode === 'edit' && (
        <form onSubmit={submitForm}>
          {(fields as CustomWizardField[])?.map((el) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { conditionalProps, conditionalPropsParams, ...field } = el;
            switch (field.type) {
              case 'choices':
                return <WizardChoices key={field.name} {...field} control={control} />;
              case 'checkbox':
              case 'radio':
              case 'toggle':
                return <Field key={field.name} {...field} control={control} />;
              default:
                return (
                  <Field
                    key={field.name}
                    fluid
                    {...field}
                    {...(conditionalProps && conditionalProps(getValues()))}
                    control={control}
                  />
                );
            }
          })}

          <Flex direction="row" justifyContent="center" mt={8}>
            <Button
              colorScheme="primary"
              variant="text"
              ph={5}
              onClick={() => {
                items.length ? setMode('list') : next();
              }}
            >
              Skip
            </Button>
            <Button
              colorScheme="primary"
              flex={1}
              type="submit"
              disabled={isSubmitting || !isValid || (!editData && !isDirty)}
              loading={isSubmitting}
            >
              Save & Next
            </Button>
          </Flex>
        </form>
      )}
    </Flex>
  );
};
