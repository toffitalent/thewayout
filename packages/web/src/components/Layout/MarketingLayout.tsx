import { classNames, SkipNavContent, SkipNavLink } from '@disruptive-labs/ui';
import React from 'react';
import { useDashboardRedirection } from '@app/hooks';
import { Footer } from './Footer';
import { Header, HeaderLink, HeaderProps } from './Header';
import styles from './MarketingLayout.module.scss';

export interface MarketingLayoutProps {
  header?: React.ComponentType;
  children?: React.ReactNode;
  headerProps?: HeaderProps;
  hero?: boolean;
  dashboardRedirection?: boolean;
}

const links: HeaderLink[] = [
  { type: 'link', href: '/job-seekers/', label: 'Job Seekers' },
  { type: 'link', href: '/employers/', label: 'Employers' },
  { type: 'link', href: '/service-providers/', label: 'Service Providers' },
  { type: 'link', href: 'mailto:support@twout.org', label: 'Contact Us' },
];

export const MarketingLayout: React.FC<MarketingLayoutProps> = ({
  children,
  header: HeaderComponent = Header,
  headerProps,
  hero,
  dashboardRedirection,
}) => {
  const isLoading = useDashboardRedirection();

  return (
    <>
      <SkipNavLink>Skip to content</SkipNavLink>
      <HeaderComponent {...headerProps} links={links} isMarketingPage logoLink="/" />
      <SkipNavContent />
      <main
        className={classNames(
          hero && styles.hero,
          dashboardRedirection && isLoading && styles.isLoading,
        )}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};
