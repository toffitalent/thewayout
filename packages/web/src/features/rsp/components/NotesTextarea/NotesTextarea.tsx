import { InputBase } from '@disruptive-labs/ui';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import styles from './NotesTextarea.module.scss';

interface NotesTextareaProps {
  initialNotes?: string;
  onSave: (value: string) => void;
}

export const NotesTextarea = ({ initialNotes, onSave }: NotesTextareaProps) => {
  const [text, setText] = useState<string>('');
  const textareaField = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const stopTypingTimeout = useRef<ReturnType<typeof setTimeout> | undefined>();

  useEffect(() => {
    fitTextareaHeight();
  }, [text]);

  const fitTextareaHeight = () => {
    if (textareaField.current) {
      textareaField.current.style.height = '';
      textareaField.current.style.height = `${textareaField.current.scrollHeight}px`;
    }
  };

  const handleKeyUp = () => {
    if (stopTypingTimeout.current) {
      clearTimeout(stopTypingTimeout.current);
    }
    stopTypingTimeout.current = setTimeout(() => {
      onSave(text);
    }, 10000);
  };

  return (
    <InputBase
      multiline
      rows={1}
      placeholder="Type notes here..."
      className={styles.notes}
      fluid
      onBlur={(e: ChangeEvent<HTMLInputElement>) => onSave(e.target.value)}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
      }}
      defaultValue={initialNotes}
      ref={textareaField}
      onKeyUp={handleKeyUp}
    />
  );
};
