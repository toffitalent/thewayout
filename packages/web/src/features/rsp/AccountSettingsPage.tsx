import { Flex, Heading, Text } from '@disruptive-labs/ui';
import { Tab, TabList, TabPanel, Tabs } from '@disruptive-labs/ui/dist/components/Tabs/Tabs';
import { RspRole } from '@two/shared';
import { AccountSettingsTab } from '@app/components/AccountSettingsTab';
import { useAppSelector } from '@app/hooks';
import { selectAuthUser } from '../auth';
import styles from './AccountSettingsPage.module.scss';
import { OrganizationSettingsTab } from './OrganizationSettingsTab';

export const AccountSettingsPage = () => {
  const user = useAppSelector(selectAuthUser);

  if (!user?.rspAccount) {
    return null;
  }

  const isOwner = user.rspAccount.role === RspRole.owner;

  return (
    <Flex width="full" className={styles.formWrapper}>
      <Heading size="3xl">Account Settings</Heading>
      <Text mt={2} color="grey.600">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Text>
      <Tabs>
        <TabList mt={5}>
          <Tab id="account">Account</Tab>
          {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
          {isOwner ? <Tab id="organization">Organization</Tab> : <></>}
        </TabList>
        <TabPanel id="account">
          <AccountSettingsTab isPhone />
        </TabPanel>
        <TabPanel id="organization">
          <OrganizationSettingsTab />
        </TabPanel>
      </Tabs>
    </Flex>
  );
};
