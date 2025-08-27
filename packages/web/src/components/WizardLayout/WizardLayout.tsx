import {
  classNames,
  Content,
  Text,
  TextProps,
  useWizardContext,
  WizardBackButton,
  WizardLayoutProps,
  WizardProgress,
} from '@disruptive-labs/ui';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './WizardLayout.module.scss';

function WizardText<C extends React.ElementType<any> = 'p'>({
  children,
  className,
  ...props
}: TextProps<C>) {
  return typeof children === 'string' ? (
    <Text {...(props as TextProps<C>)} className={className}>
      {children}
    </Text>
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{children}</>
  );
}

export function WizardLayout<WizardData extends object = object>({
  children,
  className,
  container = true,
  title,
  description,
}: WizardLayoutProps<WizardData>) {
  const wizard = useWizardContext();
  const router = useRouter();
  const [currentState, setCurrentState] = useState({ url: '', as: '' });

  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    setCurrentState(history.state);
  }, []);

  useEffect(() => {
    router.beforePopState((newState) => {
      if (newState.as !== router.asPath) {
        if (!wizard.isFirst) {
          wizard.previous();
          // eslint-disable-next-line no-restricted-globals
          history.pushState(newState, '', newState.url);
          router.push(currentState.url, currentState.as);
          return false;
        }
      }
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentState, wizard.currentStepIndex]);

  return (
    <Content as="section" container={container} className={classNames(styles.layout, className)}>
      <header className={styles.header}>
        <WizardBackButton isFirst={wizard.isFirst} />
        <WizardProgress />
        {title && (
          <WizardText as="h2" className={styles.title}>
            {title}
          </WizardText>
        )}
        {description && <WizardText className={styles.description}>{description}</WizardText>}
      </header>
      {children}
    </Content>
  );
}
