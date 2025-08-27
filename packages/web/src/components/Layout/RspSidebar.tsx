import { Avatar, Menu, MenuGroup, MenuItem, MenuList, MenuTrigger } from '@disruptive-labs/ui';
import ChartPieIcon from '@disruptive-labs/ui/dist/icons/ChartPie';
import DotsVerticalIcon from '@disruptive-labs/ui/dist/icons/DotsVertical';
import FolderIcon from '@disruptive-labs/ui/dist/icons/Folder';
import UsersIcon from '@disruptive-labs/ui/dist/icons/Users';
import { Sidebar, SidebarItem, SidebarSection } from '@disruptive-labs/ui/dist/layouts';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RspRole } from '@two/shared';
import logoImg from '@app/assets/images/logo.png';
import { logout, selectAuthUser } from '@app/features/auth';
import { selectRsp } from '@app/features/rsp';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import styles from './RspSidebar.module.scss';

export const RspSidebar = () => {
  const router = useRouter();
  const user = useAppSelector(selectAuthUser);
  const rsp = useAppSelector(selectRsp);
  const dispatch = useAppDispatch();

  if (!user || !rsp) {
    return null;
  }

  const isOwner = user.rspAccount?.role === RspRole.owner;

  return (
    <Sidebar className={styles.sidebarDesktop}>
      <SidebarSection>
        <Link href="/" passHref className={styles.logo}>
          <Image src={logoImg} alt="" width={0} height={0} />
        </Link>
      </SidebarSection>
      <SidebarSection>
        <SidebarItem
          accessoryLeft={<Avatar src={rsp.avatar} name={rsp.name} className={styles.avatar} />}
        >
          {rsp.name || ''}
        </SidebarItem>
      </SidebarSection>

      <SidebarSection fontSize="lg">
        {isOwner ? (
          <SidebarItem
            active={router.asPath === '/ssp/case-managers/'}
            accessoryLeft={<UsersIcon />}
            wrapper="a"
            wrapperProps={{ href: '/ssp/case-managers' }}
          >
            Case Managers
          </SidebarItem>
        ) : (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <></>
        )}
        <SidebarItem
          active={router.asPath === '/ssp/clients/'}
          accessoryLeft={<FolderIcon />}
          wrapper="a"
          wrapperProps={{ href: '/ssp/clients' }}
        >
          Clients
        </SidebarItem>
        {isOwner ? (
          <SidebarItem
            active={router.asPath === '/ssp/reports/'}
            accessoryLeft={<ChartPieIcon />}
            wrapper="a"
            wrapperProps={{ href: '/ssp/reports' }}
          >
            Reports
          </SidebarItem>
        ) : (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <></>
        )}
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
                  <MenuItem minWidth={40} onClick={() => router.push('/ssp/account-settings')}>
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
