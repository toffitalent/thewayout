import {
  Button,
  ButtonBase,
  ButtonLinkProps,
  ButtonProps,
  classNames,
  Flex,
  Text,
} from '@disruptive-labs/ui';
import type { StaticImageData } from 'next/image';
import Image from 'next/legacy/image';
import Link from 'next/link';
import React from 'react';
import googleImage from '@app/assets/images/google.png';
import styles from './Hero.module.scss';

export interface HeroAction extends Omit<ButtonLinkProps, 'children'> {
  href?: string;
  label: string;
}

export interface HeroProps {
  actions?: HeroAction[];
  className?: string;
  heading: string;
  image?: StaticImageData;
  subheading?: string;
  children?: React.ReactNode;
}

export const Hero: React.FC<HeroProps> = ({
  actions,
  children,
  className,
  heading,
  image,
  subheading,
}) => (
  <section className={classNames(styles.hero, className)}>
    {image && (
      <div className={styles.bg} aria-hidden="true">
        <Image src={image} alt="" layout="fill" objectFit="cover" priority />s
      </div>
    )}
    <div className={styles.container}>
      <Flex container justify="center" textAlign="center">
        <Flex item xs={12} md={8}>
          <Flex direction="row" alignItems="center" justify="center" mb={5}>
            <Text mr={1} fontWeight="700">
              Funded by
            </Text>
            <Image src={googleImage} alt="google" height={24} width={70} />
          </Flex>
          <h1>{heading}</h1>
          {subheading && <Text>{subheading}</Text>}
          {actions && (
            <div className={styles.actions}>
              {actions.map(({ href, label, ...buttonProps }) =>
                href ? (
                  <ButtonBase
                    as={Link}
                    href={href}
                    key={label}
                    colorScheme="primary"
                    {...buttonProps}
                  >
                    {label}
                  </ButtonBase>
                ) : (
                  <Button key={label} colorScheme="primary" {...(buttonProps as ButtonProps)}>
                    {label}
                  </Button>
                ),
              )}
            </div>
          )}
          {children}
        </Flex>
      </Flex>
    </div>
  </section>
);
