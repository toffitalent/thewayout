import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import React from 'react';
import { act, render } from '@test';
import { NotesTextarea } from '../NotesTextarea';

describe('NotesTextarea', () => {
  const handleSave = jest.fn();

  test('renders correctly', () => {
    const { container } = render(<NotesTextarea initialNotes="Test note" onSave={handleSave} />);
    expect(container).toMatchSnapshot();
  });

  test('renders correctly empty notes', () => {
    const { container } = render(<NotesTextarea onSave={handleSave} />);
    expect(container).toMatchSnapshot();
  });

  test('handles save text', async () => {
    const { getByPlaceholderText } = render(
      <NotesTextarea initialNotes="Test" onSave={handleSave} />,
    );
    await userEvent.type(getByPlaceholderText('Type notes here...'), ' note', {
      delay: 1,
    });
    await userEvent.click(document.body);
    expect(handleSave).toBeCalledWith('Test note');
  });

  test('handles save text after 10 seconds of stop typing', async () => {
    const user = userEvent.setup({ delay: null });
    jest.useFakeTimers();

    const { getByPlaceholderText } = render(
      <NotesTextarea initialNotes="Test" onSave={handleSave} />,
    );
    await user.type(getByPlaceholderText('Type notes here...'), ' note');
    act(() => {
      jest.runAllTimers();
    });
    expect(handleSave).toBeCalledWith('Test note');
    jest.useRealTimers();
  });
});
