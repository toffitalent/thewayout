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
import { useRouter } from 'next/router';
import { ChangeEvent, useCallback, useRef } from 'react';
import { MediaType, State, states, UpdateUserRequest } from '@two/shared';
import { API } from '@app/api';
import { PhoneNumberInput } from '@app/components/PhoneNumberInput';
import { selectAuthUser, updateUser } from '@app/features/auth';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { formatPhoneNumber } from '@app/utils';
import { updateClient } from '../../actions';
import { TabSectionWrapper } from '../TabSectionWrapper';

interface EditPersonalInformation {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: State | string;
  postalCode: string;
  avatar: string;
}

export const AccountSettingsTab = () => {
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator();
  const router = useRouter();
  const ref = useRef<HTMLInputElement | null>(null);

  const {
    control,
    submitForm,
    setValue,
    getValues,
    formState: { isValid, isDirty },
  } = useForm({
    onSubmit: async (values) => {
      handleEditClient(values);
      router.replace('/client/profile');
    },
    defaultValues: {
      avatar: user?.avatar || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: formatPhoneNumber(user?.client?.phone || ''),
      email: user?.email || '',
      file: null as File | null,
      address: user?.client?.address || '',
      city: user?.client?.city || '',
      state: user?.client?.state || '',
      postalCode: user?.client?.postalCode || '',
    },
  });
  const {
    control: controlPassword,
    submitForm: submitFormPassword,
    getValues: getValuesPassword,
    formState: { isValid: isValidPassword, isDirty: isDirtyPassword },
  } = useForm({
    onSubmit: async (values) => {
      handleEditUser(values);
      router.replace('/client/profile');
    },
    defaultValues: {
      password: '',
      newPassword: '',
      confirm: '',
    },
  });

  const handleEditUser = useCallback(
    async (data: UpdateUserRequest & { confirm?: string }) => {
      if (user && user.client) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirm, ...patch } = data;

        dispatch(updateUser(patch))
          .unwrap()
          .catch((e) => {
            showError(e);
          })
          .then(() => {
            Toast.success('Account Settings updated!!');
          });
      }
    },
    [dispatch, showError, user],
  );

  const handleEditClient = useCallback(
    async (data: EditPersonalInformation & { file?: File | null }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { avatar, file, ...patch } = data;
      if (file) {
        const { key } = await API.uploads.create(MediaType.Avatar, file);
        (patch as EditPersonalInformation).avatar = key;
      }

      if (user && user.client) {
        dispatch(
          updateClient({
            ...user.client,
            ...patch,
            ...(data.phone && { phone: data.phone.replace(/[^0-9]/g, '') }),
          }),
        )
          .unwrap()
          .catch((e) => {
            showError(e);
          })
          .then(() => {
            Toast.success('Account Settings updated!!');
          });
      }
    },
    [dispatch, showError, user],
  );

  const handleImgChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setValue('avatar', URL.createObjectURL(event.target.files[0]), { shouldDirty: true });
      setValue('file', event.target.files[0]);
    }
  };

  return (
    <>
      <TabSectionWrapper
        title="Personal Information"
        description="Use a permanent address where you can receive mail."
      >
        <form onSubmit={submitForm}>
          <Controller
            name="avatar"
            control={control}
            render={({ field: { ref: controllerRef } }) => (
              <Flex direction="row" mb={10}>
                <Avatar
                  size="2xl"
                  name={`${user?.firstName} ${user?.lastName}`}
                  src={getValues('avatar') || user?.avatar}
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
            name="firstName"
            type="text"
            label="First Name"
            fluid
            control={control}
            validate={{ required: true }}
            width="1/2"
            display="inline-block"
            pr={1}
          />
          <Field
            name="lastName"
            type="text"
            label="Last Name"
            fluid
            control={control}
            validate={{ required: true }}
            width="1/2"
            display="inline-block"
            pl={1}
          />
          <Field
            name="email"
            type="text"
            label="Email"
            fluid
            control={control}
            validate={{ required: true, email: true }}
            width="1/2"
            display="inline-block"
            pr={1}
          />
          <PhoneNumberInput
            name="phone"
            control={control}
            label="Phone"
            fluid
            width="1/2"
            display="inline-block"
            placeholder="Add your phone number"
            pl={1}
            setPhoneValue={(value: string) => {
              setValue('phone', value, {
                shouldDirty: true,
              });
            }}
          />

          <Field
            name="address"
            type="text"
            label="Address"
            fluid
            control={control}
            validate={{ required: true }}
            width="1/2"
            display="inline-block"
            pr={1}
          />
          <Field
            name="city"
            type="text"
            label="Town / City"
            fluid
            control={control}
            validate={{ required: true }}
            width="1/2"
            display="inline-block"
            pl={1}
          />
          <Field
            name="state"
            type="select"
            options={Object.entries(states).map(([key, value]) => ({ value: key, label: value }))}
            label="State"
            fluid
            control={control}
            validate={{ required: true }}
            width="1/2"
            display="inline-block"
            pr={1}
          />
          <Field
            name="postalCode"
            type="text"
            label="Postcode / Zipcode"
            fluid
            control={control}
            validate={{ required: true }}
            width="1/2"
            display="inline-block"
            pl={1}
          />
          <Button colorScheme="primary" type="submit" mt={8} disabled={!isValid || !isDirty}>
            Save
          </Button>
        </form>
      </TabSectionWrapper>

      <TabSectionWrapper title="Security" description="Enter your account password.">
        <form onSubmit={submitFormPassword}>
          <Field
            name="password"
            type="password"
            label="Current Password"
            validate={{ required: true }}
            fluid
            control={controlPassword}
          />
          <Field
            name="newPassword"
            type="password"
            label="New Password"
            validate={{ minLength: 8 }}
            fluid
            control={controlPassword}
            width="1/2"
            display="inline-block"
            pr={1}
          />
          <Field
            name="confirm"
            type="password"
            label="Confirm Password"
            validate={{
              minLength: 8,
              validate: (value) =>
                value !== getValuesPassword('newPassword') ? 'Passwords do not match.' : undefined,
            }}
            fluid
            control={controlPassword}
            width="1/2"
            display="inline-block"
            pl={1}
          />
          <Button
            colorScheme="primary"
            type="submit"
            mt={8}
            disabled={!isValidPassword || !isDirtyPassword}
          >
            Save
          </Button>
        </form>
      </TabSectionWrapper>
    </>
  );
};
