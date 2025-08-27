import { Box, Spinner } from '@disruptive-labs/ui';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  ClientType,
  getCloakedData,
  getCloakedEmail,
  getFullyCloakedData,
  UserType,
} from '@two/shared';
import { ActionType, ClientProfile, ClientProfileSections } from '@app/components/ClientProfile';
import { SEO } from '@app/components/SEO';
import { selectAuthUser } from '@app/features/auth';
import { useAppSelector } from '@app/hooks';

export const ProfilePage = () => {
  const [isCloaked, setIsCloaked] = useState(false);
  const user = useAppSelector(selectAuthUser);
  const router = useRouter();

  if (!user?.client) {
    return (
      <Box pv={36} textAlign="center">
        <Spinner data-testid="loading-spinner" />
      </Box>
    );
  }
  const { client } = user;
  const cloakedData: ClientType & { email?: string } = {
    ...user?.client,
    firstName: getCloakedData(client.firstName),
    lastName: getCloakedData(client.lastName),
    ...(user.email && { email: getCloakedEmail(user.email) }),
    ...(client.phone && { phone: getFullyCloakedData() }),
    address: getFullyCloakedData(),
    city: getFullyCloakedData(),
    state: getFullyCloakedData(),
    postalCode: getFullyCloakedData(),
    relativeExperience: (client.relativeExperience || []).map((exp) => ({
      ...exp,
      company: getFullyCloakedData(),
    })),
  };

  const handleClick = (type: ActionType, section?: ClientProfileSections) => {
    if (type === ActionType.cloaked) {
      return setIsCloaked(!isCloaked);
    }
    const path =
      section === ClientProfileSections.personalInformation
        ? '/client/account-settings'
        : {
            pathname: `/client/edit-profile`,
            query: { section },
          };

    return router.push(path);
  };

  return (
    <>
      <SEO title="Profile" />
      <ClientProfile
        client={
          isCloaked
            ? cloakedData
            : { ...user.client, email: user.email as string, avatar: user.avatar }
        }
        type={UserType.Client}
        isCloaked={isCloaked}
        onClick={handleClick}
      />
    </>
  );
};
