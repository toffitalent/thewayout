import { Box, Button, Field, Toast, useForm, WizardChoices } from '@disruptive-labs/ui';
import { ClientType } from '@two/shared';
import { selectAuthUser } from '@app/features/auth';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { getClientDataFromWizard, getClientInitialData, getDatesVeteranForm } from '@app/utils';
import { updateClient } from '../../actions';
import { steps } from '../../profileData';
import { StepsClient, WizardData } from '../../profileDataTypes';
import { TabSectionWrapper } from '../TabSectionWrapper';
import styles from './MilitaryHistoryTab.module.scss';

export const MilitaryHistoryTab = () => {
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator();

  const initialData = getClientInitialData(user?.client);

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

  const fields = steps
    .filter((step) =>
      [
        StepsClient.veteranService,
        StepsClient.veteranRank,
        StepsClient.veteranDates,
        StepsClient.veteranReservist,
        StepsClient.veteranCampaigns,
        StepsClient.veteranTypeDischarge,
        StepsClient.veteranDd214,
      ].includes(step.id),
    )
    .map((step) => step.fields || [])
    .flat()
    .map((el) => ({
      ...el,
      ...(el.name === 'veteranService' && { label: 'Branch of Service' }),
      ...(el.name === 'veteranReservist' && { label: 'Member of the Reserves or National Guard' }),
      ...(el.name === 'veteranCampaigns' && { label: 'Campaigns' }),
      ...(el.name === 'veteranDd214' && { label: 'Copy of DD-214' }),
    }));

  const client = user?.client as ClientType;

  const {
    control,
    submitForm,
    formState: { isValid, isDirty },
    getValues,
    setError,
    clearErrors,
    trigger,
  } = useForm({
    onSubmit: handleEdit,
    defaultValues: {
      veteranService: client.veteranService,
      veteranRank: client.veteranRank,
      ...getDatesVeteranForm(client),
      veteranReservist: client.veteranReservist ? 'yes' : 'no',
      veteranCampaigns: client.veteranCampaigns,
      veteranTypeDischarge: client.veteranTypeDischarge,
      veteranDd214: client.veteranDd214 ? 'yes' : 'no',
    },
    mode: 'onChange',
  });

  const validateEndDate = () => {
    const [startMonth, startYear, endMonth, endYear] = getValues([
      'veteranStartAtMonth',
      'veteranStartAtYear',
      'veteranEndAtMonth',
      'veteranEndAtYear',
    ]);

    if (endMonth && endYear) {
      const startDate = new Date(Number(startYear), Number(startMonth));
      const endDate = new Date(Number(endYear), Number(endMonth));

      return endDate >= startDate ? undefined : 'error';
    }

    return undefined;
  };

  return (
    <TabSectionWrapper title="Military History">
      <Box pt={2} className={styles.wrapper}>
        <form onSubmit={submitForm}>
          {fields.map((field) => {
            switch (field.type) {
              case 'choices':
                return <WizardChoices key={field.name} {...field} control={control} pt={4} />;
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
                    control={control}
                    validate={{
                      ...field.validate,
                      ...(field.name === 'veteranEndAtMonth' && {
                        validate: () => {
                          const error = validateEndDate();
                          if (error) {
                            setError('veteranEndAtMonth', {
                              message: 'End date must be after start date',
                              type: 'validate',
                            });
                          } else {
                            clearErrors('veteranEndAtMonth');
                          }
                          return error ? 'End date must be after start date' : undefined;
                        },
                      }),
                      ...(field.name === 'veteranEndAtYear' && {
                        validate: () => {
                          const error = validateEndDate();
                          if (error) {
                            setError('veteranEndAtYear', {
                              message: ' ',
                              type: 'validate',
                            });
                          } else {
                            clearErrors('veteranEndAtYear');
                          }
                          return error ? ' ' : undefined;
                        },
                      }),
                    }}
                    onChangeCapture={() => {
                      if (field.name === 'veteranEndAtMonth' && getValues('veteranEndAtYear')) {
                        trigger('veteranEndAtYear');
                      }
                      if (field.name === 'veteranEndAtYear' && getValues('veteranEndAtMonth')) {
                        trigger('veteranEndAtMonth');
                      }
                    }}
                  />
                );
            }
          })}
          <Button colorScheme="primary" type="submit" mt={8} disabled={!isValid || !isDirty}>
            Save
          </Button>
        </form>
      </Box>
    </TabSectionWrapper>
  );
};
