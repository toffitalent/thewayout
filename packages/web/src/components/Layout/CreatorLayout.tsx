import { classNames, SkipNavContent, SkipNavLink } from '@disruptive-labs/ui';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { PropsWithChildren } from 'react';
import { UserType } from '@two/shared';
import logoImg from '@app/assets/images/logo.png';
import { selectAuthUser } from '@app/features/auth';
import { useAppSelector } from '@app/hooks';
import styles from './CreatorLayout.module.scss';

export function CreatorLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const user = useAppSelector(selectAuthUser);
  const isCreteProfilePage = router.asPath.includes('create-profile');

  let href: undefined | string;
  if (user && !isCreteProfilePage) {
    href = user.type === UserType.Client ? '/client' : '/employer';
  }

  return (
    <>
      <SkipNavLink>Skip to content</SkipNavLink>
      <div className={styles.header}>
        {isCreteProfilePage && (
          <div className={styles.logo}>
            <Image src={logoImg} alt="" width={0} height={0} />
          </div>
        )}
        {href && (
          <Link href={href} passHref className={styles.logo}>
            <Image src={logoImg} alt="" width={0} height={0} />
          </Link>
        )}
      </div>
      <SkipNavContent />
      <main className={classNames(styles.content)}>{children}</main>
    </>
  );
}
