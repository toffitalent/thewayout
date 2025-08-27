import {
  Avatar,
  Flex,
  Menu,
  MenuGroup,
  MenuItem,
  MenuList,
  MenuTrigger,
} from '@disruptive-labs/ui';
import BriefcaseIcon from '@disruptive-labs/ui/dist/icons/Briefcase';
import DotsVerticalIcon from '@disruptive-labs/ui/dist/icons/DotsVertical';
import { Sidebar, SidebarItem, SidebarSection } from '@disruptive-labs/ui/dist/layouts';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import logoImg from '@app/assets/images/logo.png';
import { logout, selectAuthUser } from '@app/features/auth';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import styles from './RspSidebar.module.scss';

export const EmployerSidebar = () => {
  const router = useRouter();
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();

  if (!user || !user.employer) {
    return null;
  }
  const { employer } = user;

  return (
    <Sidebar
      className={styles.sidebar}
      logo={
        <Flex alignItems="center" display="flex">
          <Link href="/" passHref className={styles.logo}>
            <Image src={logoImg} alt="" width={0} height={0} />
          </Link>
        </Flex>
      }
    >
      <SidebarSection>
        <SidebarItem
          accessoryLeft={
            <Avatar name={employer.name} className={styles.avatar} src={employer.avatar} />
          }
        >
          {employer.name}
        </SidebarItem>
      </SidebarSection>

      <SidebarSection fontSize="lg">
        <SidebarItem
          active={router.asPath === '/employer/'}
          accessoryLeft={<BriefcaseIcon />}
          wrapper="a"
          wrapperProps={{ href: '/employer' }}
        >
          Job Postings
        </SidebarItem>
      </SidebarSection>

      <SidebarSection separated>
        <SidebarItem
          accessoryLeft={
            <Avatar size="sm" name={`${user.firstName} ${user.lastName}`} src={user.avatar} />
          }
          accessoryRight={
            <Menu>
              <MenuTrigger>
                <DotsVerticalIcon height={6} width={6} cursor="pointer" />
              </MenuTrigger>
              <MenuList>
                <MenuGroup>
                  <MenuItem minWidth={40} onClick={() => router.push('/employer/account-settings')}>
                    Account settings
                  </MenuItem>
                  <MenuItem minWidth={40} onClick={() => dispatch(logout())}>
                    Logout
                  </MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          }
        >{`${user.firstName} ${user.lastName}`}</SidebarItem>
      </SidebarSection>
    </Sidebar>
  );
};
