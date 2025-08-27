import {
  Avatar,
  Box,
  Button,
  ButtonLink,
  classNames,
  Flex,
  Menu,
  MenuGroup,
  MenuItem,
  MenuList,
  MenuTrigger,
} from '@disruptive-labs/ui';
import SvgChevronDown from '@disruptive-labs/ui/dist/icons/ChevronDown';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { UserType } from '@two/shared';
import { logout } from '@app/features/auth/actions';
import { selectAuthUser } from '@app/features/auth/reducer';
import { useAppAuth, useAppDispatch, useAppSelector } from '@app/hooks';
import styles from './Header.module.scss';

export interface HeaderProps {
  transparent?: boolean;
  links?: HeaderLink[];
  className?: string;
  isMarketingPage?: boolean;
  logoLink?: string;
}

export interface HeaderLink {
  href: string;
  label: string;
  /**
   * auth
   * Determine when link is showed
   * true => only when user is logged in
   * false => only when user is logged out
   * undefined => always (logged in / logged out)
   */
  auth?: boolean;
  type: 'button' | 'link';
}

const renderLinks = (links: HeaderLink[], path: string) =>
  links.map(({ href, label, type }) => {
    switch (type) {
      case 'button':
        return (
          <li key={label} role="menuitem">
            <ButtonLink
              href={href}
              colorScheme="primary"
              variant="outline"
              className={styles.linkButton}
            >
              {label}
            </ButtonLink>
          </li>
        );

      default:
        return (
          <li key={label} role="menuitem">
            <Link
              href={href}
              passHref
              className={classNames(styles.link, path === href && styles.linkActive)}
            >
              {label}
            </Link>
          </li>
        );
    }
  });

const userLinks: { [key in UserType.Client | UserType.Employer]: HeaderLink[] } = {
  [UserType.Employer]: [
    { type: 'link', href: '/employer/', label: 'Dashboard', auth: true },
    { type: 'link', href: '/employer/edit-profile/', label: 'My Profile', auth: true },
  ],
  [UserType.Client]: [
    { type: 'link', href: '/client/', label: 'Dashboard', auth: true },
    { type: 'link', href: '/client/profile/', label: 'My Profile', auth: true },
    { type: 'link', href: '/client/jobs/', label: 'Jobs', auth: true },
  ],
};

export const Header: React.FC<HeaderProps> = ({
  transparent = false,
  links,
  className,
  isMarketingPage,
  logoLink,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const user = useAppSelector(selectAuthUser);
  const auth = useAppAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    isOpen
      ? document.body.classList.add(styles.lockScroll)
      : document.body.classList.remove(styles.lockScroll);
  }, [isOpen]);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  let linksToPresent = links || [];
  if (user && !links) {
    linksToPresent = userLinks[user.type as UserType.Client | UserType.Employer].filter(
      (link) => link.auth !== false,
    );
  }

  let href = logoLink || '/';
  if (user && !logoLink) {
    href = user.type === UserType.Client ? '/client' : '/employer';
  }

  const handleMenuClick = (positionName: string) => {
    switch (positionName) {
      case 'logout': {
        dispatch(logout());
        break;
      }
      case 'accountSettings': {
        if (user) {
          router.push(`/${user.type}/account-settings`);
        }
        break;
      }

      default:
        break;
    }
  };

  return (
    <header
      className={classNames(styles.header, className, {
        [styles.transparent]: transparent,
        [styles.menuOpen]: isOpen,
      })}
    >
      <nav className={styles.nav}>
        <Link href={href} passHref className={styles.logo} aria-label="Home" />
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          aria-controls="nav_links"
        >
          <div className={styles.hamburger}>
            <div className={styles.hamburgerInner} />
          </div>
        </button>
        <div className={styles.wrapper}>
          <ul className={styles.links} id="nav_links" role="menu">
            <Flex className={styles.renderedLinks}>
              {renderLinks(linksToPresent, router.asPath)}
            </Flex>
            {user && !isMarketingPage && (
              <>
                <li key="accountSettings" role="menuitem" className={styles.loggedUserMainMenuItem}>
                  <Button
                    className={styles.linkButton}
                    size="lg"
                    type="button"
                    variant="text"
                    onClick={() => handleMenuClick('accountSettings')}
                  >
                    Account settings
                  </Button>
                </li>
                <li key="logout" role="menuitem" className={styles.loggedUserMainMenuItem}>
                  <Button
                    className={styles.linkButton}
                    size="lg"
                    type="button"
                    variant="text"
                    onClick={() => handleMenuClick('logout')}
                  >
                    Log Out
                  </Button>
                </li>
              </>
            )}
            {!auth.isAuthenticated && !auth.isLoading && (
              <>
                <li key="login" role="menuitem">
                  <Link href="/login" passHref className={styles.link}>
                    Log In
                  </Link>
                </li>
                <li key="signup" role="menuitem">
                  <ButtonLink href="/signup" colorScheme="primary" className={styles.linkButton}>
                    Sign Up
                  </ButtonLink>
                </li>
              </>
            )}
          </ul>
        </div>
        {auth.isAuthenticated && !auth.isLoading && (
          <Box className={styles.loggedUserMenu} ml={10}>
            <Menu gutter={8}>
              <MenuTrigger>
                <Button
                  type="button"
                  variant="text"
                  accessoryRight={<SvgChevronDown className={styles.menuTriggerAccessory} />}
                >
                  <Avatar
                    name={`${user?.firstName} ${user?.lastName}`}
                    color="light"
                    bgcolor="dark"
                  />
                </Button>
              </MenuTrigger>
              <MenuList>
                <MenuGroup>
                  {user && (
                    <MenuItem minWidth={40} onClick={() => handleMenuClick('accountSettings')}>
                      Account settings
                    </MenuItem>
                  )}
                  <MenuItem minWidth={40} onClick={() => handleMenuClick('logout')}>
                    Log Out
                  </MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          </Box>
        )}
      </nav>
    </header>
  );
};
