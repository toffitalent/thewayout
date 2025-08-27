import { Button, Field, Flex, useForm, WizardChoices } from '@disruptive-labs/ui';
import TrashIcon from '@disruptive-labs/ui/dist/icons/Trash';
import { useEffect, useRef, useState } from 'react';
import { clientProfile, ClientProfileEnums } from '@app/data/clientProfileText';
import { getConditionalPropsParams } from '@app/utils';
import { steps } from '../../profileData';
import {
  ArrayStepItems,
  AvailableKeys,
  CustomWizardField,
  StepsClient,
  WizardData,
} from '../../profileDataTypes';
import { TabSectionWrapper } from '../TabSectionWrapper';
import styles from './ArraySection.module.scss';

export type Item = { [key in AvailableKeys]: string };

interface ArraySectionProps {
  titleField: AvailableKeys;
  titleNewItem: string;
  items: ArrayStepItems;
  stepId: StepsClient;
  onEdit: (data: Partial<WizardData>) => void;
  getDescription?: (item: Item) => string;
}

interface FormItemProps {
  item: Item & { id: number };
  fields: CustomWizardField[];
  onSubmit: (item: Item & { id: number }) => void;
  onRemove?: (index: number) => void;
}

const halfWidthFields: AvailableKeys[] = [
  'title',
  'company',
  'degree',
  'areaOfStudy',
  'licenseName',
  'issuingOrganization',
  'language',
  'level',
];

export const FormItem = ({ item, onSubmit, onRemove, fields }: FormItemProps) => {
  const {
    submitForm,
    watch,
    getValues,
    trigger,
    setValue,
    control,
    formState: { isSubmitting, isValid, isDirty, touchedFields },
  } = useForm({
    mode: 'onChange',
    defaultValues: item,
    onSubmit,
  });

  useEffect(
    () =>
      fieldsToWatch.forEach((field) => {
        if (getValues(field)) {
          setValue(field, getValues(field), { shouldTouch: true });
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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

  const modifiedFields = fields.map((el) => {
    const index = halfWidthFields.indexOf(el.name as AvailableKeys);
    const isEven = index % 2 === 0;

    return {
      ...el,
      ...(index >= 0 && { width: '1/2', display: 'inline-block' }),
      ...(index >= 0 && isEven && { pr: 1 }),
      ...(index >= 0 && !isEven && { pl: 1 }),
    } as CustomWizardField;
  });

  return (
    <form onSubmit={submitForm}>
      <Flex width="full" className={styles.wizardWrapper}>
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
        {modifiedFields?.map(({ conditionalProps, conditionalPropsParams, ...field }) => {
          switch (field.type) {
            case 'choices':
              return <WizardChoices key={field.name} {...field} fontSize="lg" control={control} />;
            case 'checkbox':
            case 'radio':
            case 'toggle':
              return <Field key={field.name} {...field} control={control} />;
            default:
              return (
                <Field
                  key={field.name}
                  {...field}
                  fluid
                  {...(conditionalProps && conditionalProps(getValues() as any))}
                  control={control}
                />
              );
          }
        })}
        <Flex direction="row" mt={5}>
          <Button
            colorScheme="primary"
            type="submit"
            disabled={isSubmitting || !isValid || !isDirty}
          >
            Save
          </Button>
          {onRemove && (
            <Flex ml={8} display="flex" alignItems="center">
              <TrashIcon height={6} width={6} color="primary" onClick={() => onRemove(item.id)} />
            </Flex>
          )}
        </Flex>
      </Flex>
    </form>
  );
};

const getStepArrayFields = (stepId: StepsClient) =>
  steps.find((el) => el.id === stepId)!.fields || [];

export const ArraySection = ({
  titleField,
  titleNewItem,
  items,
  stepId,
  onEdit,
  getDescription,
}: ArraySectionProps) => {
  const edit = useRef(false);
  const [newItems, setNewItems] = useState(items.map((item, index) => ({ id: index, ...item })));
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fields = getStepArrayFields(stepId);

  useEffect(() => {
    if (edit.current) {
      onEdit({ [stepId]: newItems });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newItems]);

  const handleEdit = (item: Item & { id: number }) => {
    const newArr = [...newItems];
    newArr.splice(item.id, 1, item);
    setNewItems(newArr);
    edit.current = true;
  };

  const handleRemove = (index: number) => {
    const newArr = [...newItems];
    newArr.splice(index, 1);
    setNewItems(newArr);
    edit.current = true;
  };

  const handleAdd = (item: Item) => {
    const newArr = [...newItems];
    newArr.push({ id: newArr.length, ...item });
    setNewItems(newArr);
    edit.current = true;
  };

  const emptyItem = fields.reduce((acc: any, curr) => {
    acc[curr.name] = '';
    return acc;
  }, {});

  return (
    <Flex>
      <TabSectionWrapper title={titleNewItem}>
        <>
          {!isAddOpen && (
            <Button variant="outline" onClick={() => setIsAddOpen(true)}>
              Add New
            </Button>
          )}
          {isAddOpen && <FormItem item={emptyItem} fields={fields} onSubmit={handleAdd} />}
        </>
      </TabSectionWrapper>
      {(newItems as (Item & { id: number })[]).map((item: Item & { id: number }) => (
        <TabSectionWrapper
          title={
            stepId === StepsClient.languages
              ? clientProfile[item[titleField] as ClientProfileEnums]
              : item[titleField]
          }
          description={getDescription ? getDescription(item) : undefined}
          key={item.id}
        >
          <FormItem item={item} onSubmit={handleEdit} onRemove={handleRemove} fields={fields} />
        </TabSectionWrapper>
      ))}
    </Flex>
  );
};
