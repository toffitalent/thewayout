import { classNames, Flex, Text } from '@disruptive-labs/ui';
import { SidebarLayout as UiSidebarLayout } from '@disruptive-labs/ui/dist/layouts';
import Image from 'next/legacy/image';
import { UserType } from '@two/shared';
import logoImg from '@app/assets/images/logo.png';
import { ClientSidebar } from './ClientSidebar';
import { EmployerSidebar } from './EmployerSidebar';
import { RspSidebar } from './RspSidebar';
import styles from './SidebarLayout.module.scss';

export interface SidebarLayoutProps {
  children?: React.ReactNode;
  type: UserType;
}

const getSidebar = (type: UserType) => {
  switch (type) {
    case UserType.Employer:
      return <EmployerSidebar />;
    case UserType.Rsp:
      return <RspSidebar />;
    default:
      return <ClientSidebar />;
  }
};

export const SidebarLayout = ({ children, type }: SidebarLayoutProps) => {
  const isRsp = type === UserType.Rsp;

  return (
    <>
      {isRsp && (
        <Flex mt={40} className={styles.mobileLayout}>
          <div className={styles.logo}>
            <Image src={logoImg} alt="" width={0} height={0} />
          </div>
          <Text fontSize="3xl" fontWeight="700" textAlign="center" mt={10}>
            Mobile Coming Soon
          </Text>
          <Text textAlign="center" color="grey.600" mt={1}>
            This page is currently accessible exclusively from desktop. Please revisit from a
            computer for the full experience.
          </Text>
        </Flex>
      )}
      <UiSidebarLayout
        className={classNames(styles.layout, isRsp && styles.layoutDesktop)}
        sidebar={getSidebar(type)}
      >
        <Flex bgcolor="light" className={styles.wrapper}>
          {children}
        </Flex>
      </UiSidebarLayout>
    </>
  );
};
