import {
  Avatar,
  Box,
  Button,
  Controller,
  Field,
  Flex,
  mergeRefs,
  Text,
  Toast,
  useForm,
  WizardChoices,
} from '@disruptive-labs/ui';
import { ChangeEvent, ReactNode, useRef } from 'react';
import {
  JusticeStatus,
  justiceText,
  MediaType,
  offenseCategories,
  OffenseCategory,
  offenseText,
  RspType,
  states,
  Support,
  supportText,
  VeteranOrJustice,
} from '@two/shared';
import { API } from '@app/api';
import { AllowedOffenseForm } from '@app/components/CustomStepAllowedOffense';
import { PhoneNumberInput } from '@app/components/PhoneNumberInput';
import { clientProfile, ClientProfileEnums } from '@app/data/clientProfileText';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { formatPhoneNumber } from '@app/utils';
import { getWizardOffense } from '@app/utils/getWizardOffense';
import { updateRsp } from './actions';
import { ServiceAreaForm } from './CustomStepServicesArea';
import { selectRsp } from './reducer';

interface SectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const Section = ({ title, description, children }: SectionProps) => (
  <Flex mt={8} direction="row" borderBottom pb={5}>
    <Box width="1/3" pr={5}>
      <Text fontSize="xl" fontWeight="700">
        {title}
      </Text>
      {description && (
        <Text fontSize="sm" color="grey.600">
          {description}
        </Text>
      )}
    </Box>
    <Flex width="2/3">{children}</Flex>
  </Flex>
);

export const OrganizationSettingsTab = () => {
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator({ ResourceConflict: 'Organization name already exist' });
  const rsp = useAppSelector(selectRsp);
  const ref = useRef<HTMLInputElement | null>(null);
  const isJusticeImpacted = rsp?.veteranOrJustice.includes(VeteranOrJustice.justiceImpacted);

  const {
    getValues,
    reset,
    submitForm,
    setValue,
    control,
    formState: { isDirty, isValid },
  } = useForm({
    mode: 'onChange',
    onSubmit: async (values) => {
      handleEditRsp(values);
      reset(getValues());
    },
    defaultValues: {
      avatar: rsp?.avatar || '',
      name: rsp?.name || '',
      description: rsp?.description || '',
      email: rsp?.email || '',
      phone: formatPhoneNumber(rsp?.phone || ''),
      address: rsp?.address || '',
      city: rsp?.city || '',
      state: rsp?.state || '',
      postalCode: rsp?.postalCode || '',
      file: null as File | null,
    } as Partial<RspType> & { file?: File | null },
  });

  const {
    getValues: getValuesServices,
    reset: resetServices,
    submitForm: submitFormServices,
    control: controlServices,
    formState: { isDirty: isDirtyServices, isValid: isValidServices },
  } = useForm({
    mode: 'onChange',
    onSubmit: async (values) => {
      handleEditRsp(values);
      resetServices(getValuesServices());
    },
    defaultValues: {
      support: rsp?.support,
    } as Partial<RspType>,
  });

  const {
    getValues: getValuesJusticeStatus,
    reset: resetJusticeStatus,
    submitForm: submitFormJusticeStatus,
    setValue: setValueJusticeStatus,
    control: controlJusticeStatus,
    formState: { isDirty: isDirtyJusticeStatus, isValid: isValidJusticeStatus },
  } = useForm({
    mode: 'onChange',
    onSubmit: async (values) => {
      handleEditRsp(values);
      resetJusticeStatus(getValuesJusticeStatus());
    },
    defaultValues: {
      justiceStatus: rsp?.justiceStatus || [],
    } as Partial<RspType>,
  });

  const {
    getValues: getValuesVeteranJustice,
    reset: resetVeteranJustice,
    submitForm: submitFormVeteranJustice,
    control: controlVeteranJustice,
    formState: { isDirty: isDirtyVeteranJustice, isValid: isValidVeteranJustice },
  } = useForm({
    mode: 'onChange',
    onSubmit: async (values) => {
      handleEditRsp(values);
      resetVeteranJustice(getValuesVeteranJustice());
    },
    defaultValues: {
      veteranOrJustice: rsp?.veteranOrJustice,
    } as Partial<RspType>,
  });

  const handleEditRsp = async (data: Partial<RspType> & { file?: File | null }) => {
    if (rsp) {
      const { file, ...patch } = data;
      if (file) {
        const { key } = await API.uploads.create(MediaType.Avatar, file);
        patch.avatar = key;
      }
      let clearJusticeImpactedData;
      if (
        data.veteranOrJustice !== undefined &&
        !data.veteranOrJustice.includes(VeteranOrJustice.justiceImpacted)
      ) {
        clearJusticeImpactedData = {
          justiceStatus: [],
          offenses: [],
        };
        setValueJusticeStatus('justiceStatus', []);
      }

      dispatch(
        updateRsp({
          id: rsp.id,
          ...patch,
          ...(data.phone && { phone: data.phone.replace(/[^0-9]/g, '') }),
          ...(clearJusticeImpactedData && clearJusticeImpactedData),
        }),
      )
        .unwrap()
        .catch((e) => {
          showError(e);
        })
        .then(() => {
          Toast.success('Organization updated!!');
        });
    }
  };

  const handleImgChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setValue('avatar', URL.createObjectURL(event.target.files[0]), { shouldDirty: true });
      setValue('file', event.target.files[0]);
    }
  };

  if (!rsp) {
    return null;
  }

  return (
    <>
      <Section title="Organization Information">
        <form onSubmit={submitForm}>
          <Controller
            name="avatar"
            control={control}
            render={({ field: { ref: controllerRef } }) => (
              <Flex direction="row" mb={10}>
                <Avatar size="2xl" name={rsp.name} src={getValues('avatar') || rsp.avatar} />
                <Flex mt={5} ml={5}>
                  <Button variant="outline" mb={2} onClick={() => ref.current?.click()}>
                    Edit Picture
                  </Button>
                  <input
                    type="file"
                    accept="image/jpg, image/png, image/gif"
                    hidden
                    ref={mergeRefs(ref, controllerRef)}
                    onChange={handleImgChange}
                  />
                  <Text fontSize="sm" color="grey.600">
                    JPG, GIF or PNG. 1MB max.
                  </Text>
                </Flex>
              </Flex>
            )}
          />
          <Field
            name="name"
            type="text"
            label="Organization Name"
            validate={{ required: true }}
            control={control}
            fluid
          />
          <Field
            name="description"
            type="text"
            label="Organization Description"
            validate={{ required: true }}
            control={control}
            fluid
            multiline
            helperText="Max 1,000 characters."
          />
          <Field
            name="email"
            type="text"
            label="Organization Email"
            control={control}
            fluid
            className="fieldHalfWidth"
            width="1/2"
            display="inline-block"
            pr={1}
            placeholder="Organization Email"
          />
          <PhoneNumberInput
            name="phone"
            label="Organization Phone"
            placeholder="Organization Phone"
            control={control}
            fluid
            maxLength={14}
            className="fieldHalfWidth"
            width="1/2"
            display="inline-block"
            pl={1}
            setPhoneValue={(value: string) => {
              setValue('phone', value, {
                shouldDirty: true,
                shouldValidate: value.length === 14,
              });
            }}
          />
          <Field
            name="address"
            type="text"
            label="Business Address"
            validate={{ required: true }}
            control={control}
            fluid
            className="fieldHalfWidth"
            width="1/2"
            display="inline-block"
            pr={1}
          />
          <Field
            name="city"
            type="text"
            label="Town / City"
            validate={{ required: true }}
            control={control}
            fluid
            className="fieldHalfWidth"
            width="1/2"
            display="inline-block"
            pl={1}
          />
          <Field
            name="state"
            type="select"
            options={Object.entries(states).map(([key, value]) => ({ value: key, label: value }))}
            label="State"
            validate={{ required: true }}
            control={control}
            fluid
            className="fieldHalfWidth"
            width="1/2"
            display="inline-block"
            pr={1}
          />
          <Field
            name="postalCode"
            type="text"
            label="Postcode / Zipcode"
            validate={{ required: true }}
            control={control}
            fluid
            className="fieldHalfWidth"
            width="1/2"
            display="inline-block"
            pl={1}
          />
          <Button colorScheme="primary" type="submit" mt={8} disabled={!isValid || !isDirty}>
            Save
          </Button>
        </form>
      </Section>

      <Section title="Service Area">
        <Flex className="serviceAreaForm">
          <ServiceAreaForm
            data={rsp.servicesArea}
            label="Search Area"
            name="servicesArea"
            buttonLabel="Save"
            onSubmit={({ areas }) => handleEditRsp({ servicesArea: areas })}
          />
        </Flex>
      </Section>

      <Section
        title="Allowed Applicants"
        description={`We will only recommend ${rsp.name} to candidates that meet the selected attribute(s).`}
      >
        <form onSubmit={submitFormVeteranJustice}>
          <WizardChoices
            name="veteranOrJustice"
            multiple
            inline
            control={controlVeteranJustice}
            options={Object.entries(VeteranOrJustice).map(([key, value]) => ({
              label: clientProfile[key as ClientProfileEnums],
              value,
            }))}
            validate={(value) => (value.length ? undefined : 'At least one required')}
          />
          <Button
            colorScheme="primary"
            type="submit"
            mt={8}
            disabled={!isValidVeteranJustice || !isDirtyVeteranJustice}
          >
            Save
          </Button>
        </form>
      </Section>

      <Section
        title="Support Services"
        description="Please select all the support services that you provide."
      >
        <form onSubmit={submitFormServices}>
          <WizardChoices
            name="support"
            multiple
            inline
            control={controlServices}
            options={Object.entries(Support).map(([key, value]) => ({
              label: supportText[key as Support],
              value,
            }))}
            validate={(support) => (support.length ? undefined : 'At least one required')}
          />
          <Button
            colorScheme="primary"
            type="submit"
            mt={8}
            disabled={!isValidServices || !isDirtyServices}
          >
            Save
          </Button>
        </form>
      </Section>

      {isJusticeImpacted && (
        <Section title="Accepted Justice Status" description="Please select all accepted statuses.">
          <form onSubmit={submitFormJusticeStatus}>
            <WizardChoices
              name="justiceStatus"
              multiple
              inline
              control={controlJusticeStatus}
              options={Object.entries(JusticeStatus).map(([key, value]) => ({
                label: justiceText[key as JusticeStatus],
                value,
              }))}
              validate={(justiceStatus) =>
                justiceStatus.length ? undefined : 'At least one required'
              }
            />
            <Button
              colorScheme="primary"
              type="submit"
              mt={8}
              disabled={!isValidJusticeStatus || !isDirtyJusticeStatus}
            >
              Save
            </Button>
          </form>
        </Section>
      )}

      {isJusticeImpacted && (
        <Section
          title="Allowed Offenses"
          description={`We will only recommend ${rsp.name} to candidates that meet your allowable offenses (per State and Federal statutes).`}
        >
          <div className="offensesSection">
            <AllowedOffenseForm
              fields={Object.entries(offenseCategories).map(([key, values]) => ({
                name: `offense${key[0].toUpperCase() + key.slice(1)}`,
                label: values.name,
                type: 'choices',
                options: values.categories.map((el) => ({ label: offenseText[el], value: el })),
                inline: true,
                multiple: true,
                className: 'offenseCategoryStep',
                validate: (offense: OffenseCategory[]) =>
                  offense.length ? undefined : 'At least one required',
              }))}
              defaultValues={getWizardOffense(rsp?.offenses || [])}
              onSubmit={({
                offenseDrugs,
                offensePropertyDamage,
                offenseSexual,
                offenseTheft,
                offenseViolent,
                offenseWhiteCollar,
                offenseMotorVehicle,
              }) =>
                handleEditRsp({
                  offenses: [
                    ...offenseDrugs,
                    ...offensePropertyDamage,
                    ...offenseSexual,
                    ...offenseTheft,
                    ...offenseViolent,
                    ...offenseWhiteCollar,
                    ...offenseMotorVehicle,
                  ],
                })
              }
              isRequired
              shouldReset
              buttonLabel="Save"
            />
          </div>
        </Section>
      )}
    </>
  );
};
