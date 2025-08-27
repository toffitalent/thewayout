import { classNames, SkipNavContent, SkipNavLink } from '@disruptive-labs/ui';
import Image from 'next/legacy/image';
import Link from 'next/link';
import React from 'react';
import logoImg from '@app/assets/images/logo.png';
import styles from './AuthLayout.module.scss';

export interface AuthLayoutProps {
  children?: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <SkipNavLink>Skip to content</SkipNavLink>
      <div className={styles.header}>
        <Link href="/" passHref className={styles.logo}>
          <Image src={logoImg} alt="" width={0} height={0} />
        </Link>
      </div>
      <SkipNavContent />
      <main className={classNames(styles.content)}>{children}</main>
    </>
  );
}
