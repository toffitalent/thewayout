import {
  Button,
  Field,
  Flex,
  Toast,
  useForm,
  WizardChoices,
  WizardChoicesProps,
} from '@disruptive-labs/ui';
import { Fragment } from 'react';
import {
  counties,
  facilities,
  JusticeStatus,
  ReleasedAt,
  StateFederal,
  TimeServed,
} from '@two/shared';
import { selectAuthUser } from '@app/features/auth';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { getClientDataFromWizard, getClientInitialData } from '@app/utils';
import { updateClient } from '../../actions';
import { getOptionsFromEnum, steps, validateReleasedDate } from '../../profileData';
import { StepsClient, WizardData } from '../../profileDataTypes';
import { TabSectionWrapper } from '../TabSectionWrapper';
import styles from './OffenseHistoryTab.module.scss';

export const OffenseHistoryTab = () => {
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator();

  const initialData = getClientInitialData(user?.client);

  const offenseCategoryFields = steps.find((el) => el.id === StepsClient.offenseCategory)
    ?.fields as (WizardChoicesProps & {
    type: 'choices';
  })[];
  const extraOffenseFields = steps
    .filter((el) => el.id === StepsClient.sexualOffenderRegistry || el.id === StepsClient.sbn)
    .map(
      (step) =>
        ({
          ...step.fields?.map((field) => ({ ...field, label: step.title }))[0],
        }) as WizardChoicesProps & {
          type: 'choices';
        },
    );

  const handleEdit = (data: Partial<WizardData>) => {
    if (user?.client) {
      const clientData = getClientDataFromWizard({ ...initialData, ...data });
      dispatch(
        updateClient({
          id: user?.client?.id,
          ...clientData,
        }),
      )
        .unwrap()
        .catch((e) => {
          showError(e);
        })
        .then(() => {
          Toast.success('Profile updated!');
        });
    }
  };

  const {
    control,
    watch,
    submitForm,
    formState: { isValid, isDirty },
  } = useForm({
    onSubmit: handleEdit,
    defaultValues: {
      justiceStatus: initialData.justiceStatus,
      timeServed: initialData.timeServed,
      releasedAt: initialData.releasedAt,
      stateOrFederal: initialData.stateOrFederal,
      expectedReleasedAt: initialData.expectedReleasedAt,
      facility: initialData.facility,
      releasedCounty: initialData.releasedCounty,
    },
    mode: 'onChange',
  });

  const {
    control: controlOffense,
    submitForm: submitFormOffense,
    watch: watchOffense,
    formState: { isValid: isValidOffense, isDirty: isDirtyOffense },
  } = useForm({
    onSubmit: handleEdit,
    defaultValues: {
      offenseDrugs: initialData.offenseDrugs,
      offensePropertyDamage: initialData.offensePropertyDamage,
      offenseSexual: initialData.offenseSexual,
      offenseTheft: initialData.offenseTheft,
      offenseViolent: initialData.offenseViolent,
      offenseWhiteCollar: initialData.offenseWhiteCollar,
      offenseMotorVehicle: initialData.offenseMotorVehicle,
    },
  });

  return (
    <>
      <TabSectionWrapper
        title="Justice Status"
        description="Update details about your justice status."
      >
        <form onSubmit={submitForm}>
          <Field
            name="justiceStatus"
            label="Current Justice Status"
            type="select"
            options={getOptionsFromEnum(JusticeStatus)}
            validate={{ required: true }}
            control={control}
            width={watch('justiceStatus') !== JusticeStatus.noOffense ? '1/2' : 'full'}
            display="inline-block"
            pr={1}
          />
          {watch('justiceStatus') !== JusticeStatus.noOffense && (
            <>
              <Field
                name="timeServed"
                label="Time Served"
                type="select"
                options={getOptionsFromEnum(TimeServed)}
                validate={{ required: true }}
                control={control}
                width="1/2"
                display="inline-block"
                pl={1}
              />

              <Field
                name="releasedAt"
                label="Completed Sentence"
                type="select"
                options={getOptionsFromEnum(ReleasedAt)}
                validate={{ required: true }}
                control={control}
                width="1/2"
                display="inline-block"
                pr={1}
              />
              <Field
                name="stateOrFederal"
                label="State or Federal"
                type="select"
                options={getOptionsFromEnum(StateFederal)}
                validate={{ required: true }}
                control={control}
                width="1/2"
                display="inline-block"
                pl={1}
              />
            </>
          )}
          {watch('justiceStatus') === JusticeStatus.currentlyIncarcerated && (
            <>
              <Field
                name="expectedReleasedAt"
                label="Expected Release Date"
                type="date"
                control={control}
                fluid
                validate={{ required: true, validate: validateReleasedDate }}
              />

              <Field
                name="facility"
                label="Correctional Facility"
                type="select"
                options={facilities.sort().map((el) => ({ label: el, value: el }))}
                control={control}
                width="1/2"
                display="inline-block"
                pr={1}
                validate={{ required: true }}
                placeholder="Select Correctional Facility"
              />
              <Field
                name="releasedCounty"
                label="Release County"
                type="select"
                options={counties.map((el) => ({ label: el, value: el }))}
                control={control}
                width="1/2"
                display="inline-block"
                pl={1}
                validate={{ required: true }}
                placeholder="Select Release County"
              />
            </>
          )}

          <Button colorScheme="primary" type="submit" mt={8} disabled={!isValid || !isDirty}>
            Save
          </Button>
        </form>
      </TabSectionWrapper>

      {watch('justiceStatus') !== JusticeStatus.noOffense && (
        <TabSectionWrapper
          title="Nature of Offense"
          description="Update details about the nature of your offense."
        >
          <form onSubmit={submitFormOffense}>
            <Flex className={styles.wrapper}>
              {offenseCategoryFields?.map((field) => (
                <Fragment key={field.name}>
                  <WizardChoices {...field} control={controlOffense} pt={1} mt={5} />
                  {field.label === 'Sexual' &&
                    !!watchOffense('offenseSexual')?.length &&
                    extraOffenseFields.map((extraField) => (
                      <WizardChoices
                        key={extraField.name}
                        {...extraField}
                        control={controlOffense}
                        pt={1}
                        mt={5}
                      />
                    ))}
                </Fragment>
              ))}
            </Flex>
            <Button
              colorScheme="primary"
              type="submit"
              mt={8}
              disabled={!isValidOffense || !isDirtyOffense}
            >
              Save
            </Button>
          </form>
        </TabSectionWrapper>
      )}
    </>
  );
};
