import {
  Avatar,
  classNames,
  Flex,
  Menu,
  MenuGroup,
  MenuItem,
  MenuList,
  MenuTrigger,
} from '@disruptive-labs/ui';
import BriefcaseIcon from '@disruptive-labs/ui/dist/icons/Briefcase';
import ChecklistIcon from '@disruptive-labs/ui/dist/icons/Checklist';
import DotsVerticalIcon from '@disruptive-labs/ui/dist/icons/DotsVertical';
import SmartHomeIcon from '@disruptive-labs/ui/dist/icons/SmartHome';
import { Sidebar, SidebarItem, SidebarSection } from '@disruptive-labs/ui/dist/layouts';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import logoImg from '@app/assets/images/logo.png';
import { logout, selectAuthUser } from '@app/features/auth';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import styles from './ClientSidebar.module.scss';

export const ClientSidebar = () => {
  const router = useRouter();
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();

  if (!user || !user.client) {
    return null;
  }

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
      <SidebarSection fontSize="lg">
        <SidebarItem
          active={router.asPath === '/client/'}
          accessoryLeft={<SmartHomeIcon />}
          wrapper="a"
          wrapperProps={{ href: '/client/' }}
        >
          Dashboard
        </SidebarItem>

        <SidebarItem accessoryLeft={<ChecklistIcon />} hidden>
          Tasks
        </SidebarItem>

        <SidebarItem
          active={router.asPath === '/client/jobs/'}
          accessoryLeft={<BriefcaseIcon />}
          wrapper="a"
          wrapperProps={{ href: '/client/jobs/' }}
        >
          Jobs
        </SidebarItem>
      </SidebarSection>

      <SidebarSection
        separated
        className={classNames(
          styles.accountItem,
          router.asPath === '/client/profile/' && styles.active,
        )}
      >
        <SidebarItem
          accessoryLeft={
            <Avatar size="sm" name={`${user.firstName} ${user.lastName}`} src={user.avatar} />
          }
          wrapper="a"
          wrapperProps={{ href: '/client/profile/' }}
        >
          {`${user.firstName} ${user.lastName}`}
        </SidebarItem>
        <Menu>
          <MenuTrigger>
            <DotsVerticalIcon height={6} width={6} cursor="pointer" mh={2} />
          </MenuTrigger>
          <MenuList>
            <MenuGroup>
              <MenuItem minWidth={40} onClick={() => router.push('/client/edit-profile')}>
                Account settings
              </MenuItem>
              <MenuItem minWidth={40} onClick={() => dispatch(logout())}>
                Logout
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </SidebarSection>
    </Sidebar>
  );
};
