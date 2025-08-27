import { Box, Flex, Heading, Text, Toast } from '@disruptive-labs/ui';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { selectAuthUser } from '../auth';
import { inviteCaseManager } from './actions';
import { CaseManagerForm, CaseManagerFormFields } from './CaseManagerForm';

export const AddCaseManagerPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator({
    ResourceConflict: 'An invitation has already been sent to that email',
  });
  const user = useAppSelector(selectAuthUser);

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };

  const handleSubmit = (values: CaseManagerFormFields) => {
    if (user?.rspAccount) {
      const { phone, ...rest } = values;
      dispatch(
        inviteCaseManager({
          ...rest,
          phone: phone.replace(/[^0-9]/g, ''),
          rspId: user.rspAccount.rspId,
        }),
      )
        .unwrap()
        .then(() => {
          Toast.success('Invitation sent!');
          router.push('/ssp/case-managers/');
        })
        .catch((e) => {
          showError(e);
        });
    }
  };

  return (
    <Flex width="full">
      <Heading mb={8}>Add Case Manager</Heading>
      <Flex direction="row">
        <Box width="1/3">
          <Text fontSize="xl" fontWeight="700">
            Personal Information
          </Text>
          <Text color="grey.600">Use a permanent address where you can receive mail.</Text>
        </Box>
        <Box width="2/3" ml={8}>
          <CaseManagerForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            buttonLabel="Invite Case Manager"
            isFieldsRequired
          />
        </Box>
      </Flex>
    </Flex>
  );
};
