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
import { ChangeEvent, useCallback, useRef } from 'react';
import { MediaType, UpdateUserRequest } from '@two/shared';
import { API } from '@app/api';
import { PhoneNumberInput } from '@app/components/PhoneNumberInput';
import { selectAuthUser, updateUser } from '@app/features/auth';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { formatPhoneNumber } from '@app/utils';

export const AccountSettingsTab = ({ isPhone }: { isPhone: boolean }) => {
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator();
  const ref = useRef<HTMLInputElement | null>(null);

  const {
    control,
    submitForm,
    setValue,
    reset,
    getValues,
    formState: { isValid, isDirty },
  } = useForm({
    onSubmit: async (values) => {
      handleEditUser(values);
      reset(getValues());
    },
    defaultValues: {
      avatar: user?.avatar || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: formatPhoneNumber(user?.phone || ''),
      email: user?.email || '',
      file: null as File | null,
    },
  });
  const {
    control: controlPassword,
    submitForm: submitFormPassword,
    reset: resetPassword,
    getValues: getValuesPassword,
    formState: { isValid: isValidPassword, isDirty: isDirtyPassword },
  } = useForm({
    onSubmit: async (values) => {
      handleEditUser(values);
      resetPassword(getValuesPassword());
    },
    defaultValues: {
      password: '',
      newPassword: '',
      confirm: '',
    },
  });

  const handleEditUser = useCallback(
    async (data: UpdateUserRequest & { file?: File | null; confirm?: string }) => {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { avatar, phone, file, confirm, ...patch } = data;
        if (file) {
          const { key } = await API.uploads.create(MediaType.Avatar, file);
          (patch as UpdateUserRequest).avatar = key;
        }

        dispatch(
          updateUser({
            ...patch,
            ...(phone && { phone: phone.replace(/[^0-9]/g, '') }),
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
      <Flex mt={8} direction="row" borderBottom pb={5} container>
        <Flex item xs={12} md={4} pr={5} mb={8}>
          <Text fontSize="xl" fontWeight="700">
            Personal Information
          </Text>
          <Text fontSize="sm" color="grey.600">
            Use a permanent address where you can receive mail.
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
              width={isPhone ? '1/2' : 'full'}
              display="inline-block"
              pr={1}
            />
            {isPhone && (
              <PhoneNumberInput
                name="phone"
                control={control}
                label="Phone"
                fluid
                width="1/2"
                display="inline-block"
                pl={1}
                setPhoneValue={(value: string) => {
                  setValue('phone', value, {
                    shouldDirty: true,
                  });
                }}
              />
            )}
            <Button colorScheme="primary" type="submit" mt={8} disabled={!isValid || !isDirty}>
              Save
            </Button>
          </form>
        </Flex>
      </Flex>
      <Flex mt={8} direction="row" container>
        <Flex item xs={12} md={4} pr={5} mb={8}>
          <Text fontSize="xl" fontWeight="700">
            Security
          </Text>
          <Text fontSize="sm" color="grey.600">
            Enter your account password.
          </Text>
        </Flex>
        <Flex item xs={12} md={4}>
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
                  value !== getValuesPassword('newPassword')
                    ? 'Passwords do not match.'
                    : undefined,
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
        </Flex>
      </Flex>
    </>
  );
};
