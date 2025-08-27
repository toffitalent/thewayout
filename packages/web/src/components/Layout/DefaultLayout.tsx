import { SkipNavContent, SkipNavLink } from '@disruptive-labs/ui';
import React from 'react';
import { Header } from './Header';

export interface DefaultLayoutProps {
  header?: React.ComponentType;
  children?: React.ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  children,
  header: HeaderComponent = Header,
}) => (
  <>
    <SkipNavLink>Skip to content</SkipNavLink>
    <HeaderComponent />
    <SkipNavContent />
    <main>{children}</main>
  </>
);
