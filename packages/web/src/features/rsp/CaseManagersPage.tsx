import { Box, ButtonLink, Flex, Heading, Spinner, Text } from '@disruptive-labs/ui';
import { Tab, TabList, TabPanel, Tabs } from '@disruptive-labs/ui/dist/components/Tabs/Tabs';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RspRole } from '@two/shared';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { selectAuthUser } from '../auth';
import { listCaseManagers, listInvitations } from './actions';
import { CaseManagersListItem } from './CaseManagersListItem';
import { InvitationListItem } from './InvitationListItem';
import {
  selectAllCaseManagers,
  selectAllInvitations,
  selectTotalCaseManagers,
  selectTotalInvitations,
} from './reducer';

export const CaseManagersPage = () => {
  const user = useAppSelector(selectAuthUser);
  const caseManagers = useAppSelector(selectAllCaseManagers);
  const total = useAppSelector(selectTotalCaseManagers);
  const invitations = useAppSelector(selectAllInvitations);
  const invitationTotal = useAppSelector(selectTotalInvitations);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isFetching = useRef(false);
  const isFetchingInvitations = useRef(false);

  useEffect(() => {
    if (user?.rspAccount?.rsp && user.rspAccount.role === RspRole.owner) {
      isFetching.current = true;
      isFetchingInvitations.current = true;
      dispatch(listCaseManagers({ rspId: user.rspAccount.rspId as string }))
        .unwrap()
        .then(() => {
          isFetching.current = false;
        });
      dispatch(listInvitations({ rspId: user.rspAccount.rspId as string }))
        .unwrap()
        .then(() => {
          isFetchingInvitations.current = false;
        });
    }
  }, [dispatch, user, user?.id, user?.rspAccount?.rsp?.id]);

  if (!user?.rspAccount?.isProfileFilled) {
    return (
      <Box pv={20} textAlign="center">
        <Spinner color="primary" />
      </Box>
    );
  }

  if (user && user.rspAccount?.role !== RspRole.owner) {
    router.replace('/ssp/clients');
  }

  return (
    <Flex direction="column" width="full">
      <Flex direction="row" justify="space-between">
        <Heading>Case Managers</Heading>
        <ButtonLink href="/ssp/case-managers/add">Add Case Manager</ButtonLink>
      </Flex>

      <Tabs>
        <TabList mb={8}>
          <Tab id="active">Active</Tab>
          <Tab id="invited">Invited</Tab>
        </TabList>
        <TabPanel id="active">
          <Flex direction="row" width="full" fontWeight="700" pv={5} borderBottom>
            <Text width="1/4">Case Manager Name</Text>
            <Text width="1/4">Email</Text>
            <Text width="1/4">Phone</Text>
            <Text width="1/4">Case Load</Text>
            <Box width={12} />
          </Flex>
          <Flex>
            <InfiniteScroll
              dataLength={caseManagers.length}
              next={() => {
                if (user && user.rspAccount && user.rspAccount.role === RspRole.owner) {
                  isFetching.current = true;
                  if (user?.id) {
                    dispatch(listCaseManagers({ rspId: user.rspAccount.rspId as string }))
                      .unwrap()
                      .then(() => {
                        isFetching.current = false;
                      });
                  }
                }
              }}
              hasMore={total > caseManagers.length}
              loader={
                <Box key={0} display="flex" justifyContent="center" mt={14}>
                  <Spinner data-testid="loading-spinner" />
                </Box>
              }
            >
              {caseManagers.map((caseManager) => (
                <CaseManagersListItem {...caseManager} key={JSON.stringify(caseManager)} />
              ))}
            </InfiniteScroll>
          </Flex>
        </TabPanel>
        <TabPanel id="invited">
          <Flex direction="row" width="full" fontWeight="700" pv={5} borderBottom>
            <Text width="1/3">Case Manager Name</Text>
            <Text width="1/3">Email</Text>
            <Text width="1/3">Phone</Text>
            <Box width={12} />
          </Flex>
          <Flex>
            <InfiniteScroll
              dataLength={invitations.length}
              next={() => {
                if (user && user.rspAccount && user.rspAccount.role === RspRole.owner) {
                  isFetchingInvitations.current = true;
                  if (user?.id) {
                    dispatch(listInvitations({ rspId: user.rspAccount.rspId as string }))
                      .unwrap()
                      .then(() => {
                        isFetchingInvitations.current = false;
                      });
                  }
                }
              }}
              hasMore={invitationTotal > invitations.length}
              loader={
                <Box key={0} display="flex" justifyContent="center" mt={14}>
                  <Spinner data-testid="loading-spinner" />
                </Box>
              }
            >
              {invitations.map((invitation) => (
                <InvitationListItem {...invitation} key={JSON.stringify(invitation)} />
              ))}
            </InfiniteScroll>
          </Flex>
        </TabPanel>
      </Tabs>
    </Flex>
  );
};
