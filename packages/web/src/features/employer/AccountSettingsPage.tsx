import { Flex, Heading, Text } from '@disruptive-labs/ui';
import { Tab, TabList, TabPanel, Tabs } from '@disruptive-labs/ui/dist/components/Tabs/Tabs';
import { AccountSettingsTab } from '@app/components/AccountSettingsTab';
import { SEO } from '@app/components/SEO';
import { useAppSelector } from '@app/hooks';
import { selectAuthUser } from '../auth';
import { OrganizationSettingsTab } from './OrganizationSettingsTab';

export const AccountSettingsPage = () => {
  const user = useAppSelector(selectAuthUser);

  if (!user?.employer) {
    return null;
  }

  return (
    <>
      <SEO title="Account Settings" />
      <Flex width="full">
        <Heading size="3xl">Account Settings</Heading>
        <Text mt={2} mb={5} color="grey.600">
          Manage your personal and organizational account settings here.
        </Text>
        <Tabs>
          <TabList>
            <Tab id="account">Account</Tab>
            <Tab id="organization">Organization</Tab>
          </TabList>
          <TabPanel id="account">
            <AccountSettingsTab isPhone={false} />
          </TabPanel>
          <TabPanel id="organization">
            <OrganizationSettingsTab />
          </TabPanel>
        </Tabs>
      </Flex>
    </>
  );
};
