import {
  Avatar,
  Button,
  Controller,
  Field,
  Flex,
  mergeRefs,
  Text,
  Toast,
  useForm,
} from '@disruptive-labs/ui';
import { ChangeEvent, useRef } from 'react';
import {
  EmployerType,
  Industry,
  MediaType,
  NumberOfEmployers,
  states,
  YearsInBusiness,
} from '@two/shared';
import { API } from '@app/api';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { selectAuthUser } from '../auth';
import { updateEmployer } from './actions';

export const OrganizationSettingsTab = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const showError = useErrorIndicator();
  const ref = useRef<HTMLInputElement | null>(null);
  const employer = user?.employer;

  const {
    submitForm,
    reset,
    getValues,
    setValue,
    control,
    formState: { isDirty, isValid },
  } = useForm({
    defaultValues: {
      name: employer?.name || '',
      industry: employer?.industry || '',
      description: employer?.description || '',
      yearsInBusiness: employer?.yearsInBusiness || '',
      numberOfEmployees: employer?.numberOfEmployees || '',
      address: employer?.address || '',
      city: employer?.city || '',
      state: employer?.state || '',
      postalCode: employer?.postalCode || '',
      avatar: employer?.avatar || '',
      file: null as File | null,
    } as Partial<EmployerType> & { file?: File | null },
    onSubmit: async (values) => {
      if (user && user.employer) {
        const { id, ...rest } = user.employer;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { avatar, file, ...patch } = values;

        if (file) {
          const { key } = await API.uploads.create(MediaType.Avatar, file);
          (patch as Partial<EmployerType>).avatar = key;
        }

        dispatch(updateEmployer({ id, ...rest, ...patch }))
          .unwrap()
          .catch((e) => {
            showError(e);
          })
          .then(() => {
            Toast.success('Profile updated!');
          });

        reset(getValues());
      }
    },
  });

  if (!employer) {
    return null;
  }

  const handleImgChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setValue('avatar', URL.createObjectURL(event.target.files[0]), { shouldDirty: true });
      setValue('file', event.target.files[0]);
    }
  };

  return (
    <Flex mt={8} direction="row" pb={5} container>
      <Flex item xs={12} md={4} pr={5} mb={8}>
        <Text fontSize="xl" fontWeight="700">
          Organization Information
        </Text>
      </Flex>
      <Flex item xs={12} md={8}>
        <form onSubmit={submitForm}>
          <Controller
            name="avatar"
            control={control}
            render={({ field: { ref: controllerRef } }) => (
              <Flex direction="row" mb={10}>
                <Avatar
                  size="2xl"
                  name={`${user?.employer?.name}`}
                  src={getValues('avatar') || user.employer?.avatar}
                />
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
            width="1/2"
            fluid
            display="inline-block"
            pr={1}
          />
          <Field
            name="industry"
            type="select"
            options={Object.values(Industry).map((el) => ({ label: el, value: el }))}
            label="Industry"
            validate={{ required: true }}
            control={control}
            width="1/2"
            display="inline-block"
            pl={1}
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
            name="yearsInBusiness"
            type="select"
            options={Object.values(YearsInBusiness).map((el) => ({
              label: `${el} years`,
              value: el,
            }))}
            label="Years in Business"
            validate={{ required: true }}
            control={control}
            width="1/2"
            display="inline-block"
            pr={1}
          />
          <Field
            name="numberOfEmployees"
            type="select"
            options={Object.values(NumberOfEmployers).map((el) => ({ label: el, value: el }))}
            label="Number of Employees"
            validate={{ required: true }}
            control={control}
            width="1/2"
            display="inline-block"
            pl={1}
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
      </Flex>
    </Flex>
  );
};
