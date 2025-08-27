import { Box, Flex, Heading, Spinner, Text } from '@disruptive-labs/ui';
import { Tab, TabList, TabPanel, Tabs } from '@disruptive-labs/ui/dist/components/Tabs/Tabs';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RspRole, StatCategory, statisticField, VeteranOrJustice } from '@two/shared';
import { clientProfile, ClientProfileEnums } from '@app/data/clientProfileText';
import { months } from '@app/data/months';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { selectAuthUser } from '../auth';
import { getStatistics, listClients, listStatisticsClients } from './actions';
import { ClientsListItem } from './ClientsListItem';
import {
  selectAllClients,
  selectAllStatisticsClients,
  selectStatistics,
  selectTotalClients,
  selectTotalStatisticsClients,
} from './reducer';

const ReportTab = ({ category }: { category: StatCategory }) => {
  const dispatch = useAppDispatch();
  const allClients = useAppSelector(selectAllClients);
  const totalAllClients = useAppSelector(selectTotalClients);
  const filteredClients = useAppSelector(selectAllStatisticsClients);
  const totalFilteredClients = useAppSelector(selectTotalStatisticsClients);
  const user = useAppSelector(selectAuthUser);
  const statistics = useAppSelector(selectStatistics);
  const [selected, setSelected] = useState<string>();
  const isFetching = useRef(false);
  const clients = selected ? filteredClients : allClients;
  const total = selected ? totalFilteredClients : totalAllClients;

  useEffect(() => {
    if (user?.rspAccount?.rsp && user.rspAccount.role === RspRole.owner) {
      dispatch(getStatistics({ rspId: user.rspAccount.rspId as string, category }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  useEffect(() => {
    if (user?.rspAccount?.rsp && user.rspAccount.role === RspRole.owner && selected) {
      isFetching.current = true;
      dispatch(
        listStatisticsClients({
          rspId: user.rspAccount.rspId as string,
          [statisticField[category]]: selected,
          forceReload: true,
        }),
      )
        .unwrap()
        .then(() => {
          isFetching.current = false;
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  if (!statistics) {
    return (
      <Box pv={20} textAlign="center">
        <Spinner color="primary" />
      </Box>
    );
  }

  const getLabel = (stat: ClientProfileEnums) => {
    switch (category) {
      case StatCategory.releasedAt:
        return `${months[stat.split('-')[1]?.replace(/^0+/, '')]} ${stat.split('-')[0]}`;

      case StatCategory.postalCode:
        return stat;

      case StatCategory.veteran:
      case StatCategory.status:
        return stat.charAt(0).toUpperCase() + stat.slice(1);

      default:
        return clientProfile[stat];
    }
  };

  const getWidth = () => {
    const optionsLength = Object.values(statistics.result).filter((v) => v).length;
    switch (optionsLength) {
      case 1:
        return 'full';
      case 2:
        return '1/2';
      case 3:
        return '1/3';
      default:
        return '1/4';
    }
  };

  return (
    <>
      <Flex direction="row" overflow="auto" style={{ minHeight: '9.8rem' }}>
        {Object.entries(statistics.result)
          .filter(([, count]) => count)
          .map(([stat, count]) => (
            <Flex
              key={stat}
              minWidth={getWidth()}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelected(stat)}
              ph={5}
              pv={4}
              borderRight
              bgcolor={stat === selected ? 'grey.100' : undefined}
            >
              <Flex direction="row" justify="space-between" color="grey.500" fontSize="sm">
                <Text whiteSpace="nowrap" overflow="hidden" style={{ textOverflow: 'ellipsis' }}>
                  {getLabel(stat as ClientProfileEnums)}
                </Text>
                <Text>{statistics.total ? Math.round((count / statistics.total) * 100) : 0}%</Text>
              </Flex>
              <Text fontSize="4xl" fontWeight="700" lineHeight="none" height={10} mt={1}>
                {count}
              </Text>
            </Flex>
          ))}
      </Flex>
      <Flex direction="row" width="full" fontWeight="700" mt={8} pv={5} borderBottom>
        <Text width="1/5">Client Name</Text>
        <Text width="1/5">Email</Text>
        <Text width="1/5">Phone</Text>
        <Text width="1/5">Case Manager</Text>
        <Text width="1/5">Status</Text>
        <Box width={12} />
      </Flex>
      <InfiniteScroll
        dataLength={clients.length}
        next={() => {
          if (user?.rspAccount?.rsp && user.rspAccount.role === RspRole.owner) {
            isFetching.current = true;
            if (user?.id) {
              if (selected) {
                dispatch(
                  listStatisticsClients({
                    rspId: user.rspAccount.rspId as string,
                    [statisticField[category]]: selected,
                  }),
                )
                  .unwrap()
                  .then(() => {
                    isFetching.current = false;
                  });
              } else {
                dispatch(listClients({ rspId: user.rspAccount.rspId as string }))
                  .unwrap()
                  .then(() => {
                    isFetching.current = false;
                  });
              }
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
    </>
  );
};

export const ReportsPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const isJusticeImpactedAllowed = user?.rspAccount?.rsp.veteranOrJustice.includes(
    VeteranOrJustice.justiceImpacted,
  );
  useEffect(() => {
    if (user?.rspAccount?.rsp) {
      dispatch(listClients({ rspId: user.rspAccount.rspId as string }));
    }
  }, [dispatch, user, user?.id, user?.rspAccount?.rsp?.id]);

  return (
    <Flex direction="column" width="full">
      <Heading height={12}>Reports</Heading>

      <Tabs>
        <TabList mb={8}>
          <Tab id="services">Services</Tab>
          <Tab id="gender">Gender</Tab>
          <Tab id="age">Age</Tab>
          <Tab id="ethnicity">Ethnicity</Tab>
          <Tab id="veteran">Veteran</Tab>
          <Tab id="offense" display={isJusticeImpactedAllowed ? undefined : 'none'}>
            Offense
          </Tab>
          <Tab id="stateFederal" display={isJusticeImpactedAllowed ? undefined : 'none'}>
            State / Federal
          </Tab>
          <Tab id="release" display={isJusticeImpactedAllowed ? undefined : 'none'}>
            Release
          </Tab>
          <Tab id="zipCode">Zip Code</Tab>
          <Tab id="status">Status</Tab>
        </TabList>

        <TabPanel id="services">
          <ReportTab category={StatCategory.services} />
        </TabPanel>
        <TabPanel id="gender">
          <ReportTab category={StatCategory.gender} />
        </TabPanel>
        <TabPanel id="age">
          <ReportTab category={StatCategory.age} />
        </TabPanel>
        <TabPanel id="ethnicity">
          <ReportTab category={StatCategory.ethnicity} />
        </TabPanel>
        <TabPanel id="veteran">
          <ReportTab category={StatCategory.veteran} />
        </TabPanel>
        <TabPanel id="offense" display={isJusticeImpactedAllowed ? undefined : 'none'}>
          <ReportTab category={StatCategory.offense} />
        </TabPanel>
        <TabPanel id="stateFederal" display={isJusticeImpactedAllowed ? undefined : 'none'}>
          <ReportTab category={StatCategory.stateOrFederal} />
        </TabPanel>
        <TabPanel id="release" display={isJusticeImpactedAllowed ? undefined : 'none'}>
          <ReportTab category={StatCategory.releasedAt} />
        </TabPanel>
        <TabPanel id="zipCode">
          <ReportTab category={StatCategory.postalCode} />
        </TabPanel>
        <TabPanel id="status">
          <ReportTab category={StatCategory.status} />
        </TabPanel>
      </Tabs>
    </Flex>
  );
};
