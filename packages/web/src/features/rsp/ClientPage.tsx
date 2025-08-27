import { Box, Button, Flex, Select, Spinner, Toast } from '@disruptive-labs/ui';
import CheckIcon from '@disruptive-labs/ui/dist/icons/Check';
import XIcon from '@disruptive-labs/ui/dist/icons/X';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import { RspClientStatus, RspRole, UserType } from '@two/shared';
import { ClientProfile, SectionWrapper } from '@app/components/ClientProfile';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { selectAuthUser } from '../auth';
import {
  acceptClient,
  addClientNotes,
  assignCaseManager,
  declineClient,
  listCaseManagersNames,
  retrieveClient,
} from './actions';
import { NotesTextarea } from './components/NotesTextarea';
import { selectAllCaseManagersNames, selectClient, selectRsp } from './reducer';

export const ClientPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator();
  const [isOpenNotes, setIsOpenNotes] = useState(true);

  const authUser = useAppSelector(selectAuthUser);
  const rsp = useAppSelector(selectRsp);
  const rspClient = useAppSelector(selectClient);
  const caseManagers = useAppSelector(selectAllCaseManagersNames);
  const { id } = router.query;

  const isOwner = authUser?.rspAccount?.role === RspRole.owner;

  useEffect(() => {
    if (rsp) {
      dispatch(retrieveClient({ rspId: rsp.id, clientId: id as string }))
        .unwrap()
        .catch((e) => {
          if (e.code === 'ResourceNotFound') {
            router.replace('/rsp/clients');
          }
        });
      dispatch(listCaseManagersNames(rsp.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  const client = rspClient?.user.client;
  if (!client) {
    return (
      <Box pv={36} textAlign="center">
        <Spinner data-testid="loading-spinner" />
      </Box>
    );
  }

  const handleAccept = () => {
    if (rsp) {
      dispatch(acceptClient({ rspId: rsp.id, clientId: id as string }))
        .unwrap()
        .catch((e) => showError(e))
        .then(() => {
          Toast.success('Client accepted.');
        });
    }
  };

  const handleDecline = () => {
    if (rsp) {
      dispatch(declineClient({ rspId: rsp.id, clientId: id as string }))
        .unwrap()
        .catch((e) => showError(e))
        .then(() => {
          Toast.success('Client declined.');
        });
    }
  };

  const handleAssignCaseManager = (caseManagerId: string) => {
    if (rsp && caseManagerId) {
      dispatch(assignCaseManager({ rspId: rsp.id, clientId: id as string, caseManagerId }))
        .unwrap()
        .catch((e) => showError(e))
        .then(() => {
          Toast.success('Case manager assigned.');
        });
    }
  };

  const handleSaveNote = (notes: string) => {
    if (rsp) {
      dispatch(addClientNotes({ rspId: rsp.id, clientId: id as string, notes }))
        .unwrap()
        .catch((e) => showError(e));
    }
  };

  return (
    <ClientProfile
      client={{ ...client, email: rspClient.user.email as string, avatar: rspClient.user.avatar }}
      type={UserType.Rsp}
    >
      <>
        {rspClient.status === RspClientStatus.active && isOwner && (
          <Select
            label="Case Manager"
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              handleAssignCaseManager(e.target.value)
            }
            defaultValue={rspClient.caseManagerId}
            fluid
          >
            <option label="Select" />
            {caseManagers.map((el) => (
              <option key={el.id} value={el.id}>{`${el.firstName} ${el.lastName}`}</option>
            ))}
          </Select>
        )}
        {rspClient.status === RspClientStatus.pending && isOwner && (
          <Flex direction="row">
            <Button accessoryRight={<CheckIcon />} onClick={handleAccept} fluid mr={3}>
              Accept
            </Button>
            <Button
              colorScheme="black"
              variant="outline"
              accessoryRight={<XIcon />}
              onClick={handleDecline}
              fluid
            >
              Reject
            </Button>
          </Flex>
        )}
        <SectionWrapper title="Client Notes" isOpen={isOpenNotes} setIsOpen={setIsOpenNotes}>
          <NotesTextarea initialNotes={rspClient.notes} onSave={handleSaveNote} />
        </SectionWrapper>
      </>
    </ClientProfile>
  );
};
