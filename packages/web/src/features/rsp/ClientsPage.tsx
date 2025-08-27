import { Box, Flex, Heading, Spinner, Text } from '@disruptive-labs/ui';
import { useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { selectAuthUser } from '../auth';
import { listClients } from './actions';
import { ClientsListItem } from './ClientsListItem';
import { selectAllClients, selectTotalClients } from './reducer';

export const ClientsPage = () => {
  const user = useAppSelector(selectAuthUser);
  const clients = useAppSelector(selectAllClients);
  const total = useAppSelector(selectTotalClients);
  const isFetching = useRef(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user?.rspAccount?.rsp) {
      isFetching.current = true;
      dispatch(listClients({ rspId: user.rspAccount.rspId as string }))
        .unwrap()
        .then(() => {
          isFetching.current = false;
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

  return (
    <Flex direction="column" width="full">
      <Heading mb={8}>Clients</Heading>
      <Flex direction="row" width="full" fontWeight="700" pv={5} borderBottom>
        <Text width="1/5">Client Name</Text>
        <Text width="1/5">Email</Text>
        <Text width="1/5">Phone</Text>
        <Text width="1/5">Case Manager</Text>
        <Text width="1/5">Status</Text>
        <Box width={12} />
      </Flex>
      <Flex>
        <InfiniteScroll
          dataLength={clients.length}
          next={() => {
            if (user && user.rspAccount) {
              isFetching.current = true;
              if (user?.id) {
                dispatch(listClients({ rspId: user.rspAccount.rspId as string }))
                  .unwrap()
                  .then(() => {
                    isFetching.current = false;
                  });
              }
            }
          }}
          hasMore={total > clients.length}
          loader={
            <Box key={0} display="flex" justifyContent="center" mt={14}>
              <Spinner data-testid="loading-spinner" />
            </Box>
          }
        >
          {clients.map((client) => (
            <ClientsListItem key={client.id} {...client} />
          ))}
        </InfiniteScroll>
      </Flex>
    </Flex>
  );
};
