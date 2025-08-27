import { Box, Flex, Heading, Text, Toast } from '@disruptive-labs/ui';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { formatPhoneNumber } from '@app/utils';
import { retrieveRspAccount, updateCaseManager } from './actions';
import { CaseManagerForm, CaseManagerFormFields } from './CaseManagerForm';
import { selectAccount, selectRsp } from './reducer';

export const EditCaseManagerPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator();
  const rsp = useAppSelector(selectRsp);
  const caseManager = useAppSelector(selectAccount);
  const { id } = router.query;

  useEffect(() => {
    if (rsp) {
      dispatch(retrieveRspAccount({ rspId: rsp.id, userId: id as string }))
        .unwrap()
        .catch((e) => {
          if (e.code === 'ResourceNotFound') {
            router.replace('/ssp/case-managers');
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  if (!caseManager) {
    return null;
  }

  const { firstName, lastName, email, phone, userId, rspId } = caseManager;
  const defaultValues = {
    firstName,
    lastName,
    email,
    phone: formatPhoneNumber(phone),
  };

  const handleSubmit = (values: CaseManagerFormFields) => {
    const { phone, ...rest } = values;
    dispatch(
      updateCaseManager({
        rspId,
        userId,
        phone: phone.replace(/[^0-9]/g, ''),
        ...rest,
      }),
    )
      .unwrap()
      .then(() => {
        Toast.success('Case Manager updated!');
        router.push('/ssp/case-managers');
      })
      .catch((e) => showError(e));
  };

  return (
    <Flex width="full">
      <Heading mb={8}>Edit Case Manager</Heading>
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
            buttonLabel="Save"
          />
        </Box>
      </Flex>
    </Flex>
  );
};
