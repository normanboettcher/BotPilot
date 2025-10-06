import { describe, expect, it, type MockedFunction, vi } from 'vitest';
import type { ButtonOption } from '../../../../domain/ButtonOption.ts';
import ButtonOptionList from '../ButtonOptionList.tsx';
import { render, waitFor, screen } from '@testing-library/react';
import React from 'react';
import useHandleSend from '../../../ChatInput/useHandleSend.ts';
import { userEvent } from '@testing-library/user-event';

vi.mock('../../../ChatInput/useHandleSend.ts');

const useHandleSendMock = useHandleSend as MockedFunction<typeof useHandleSend>;
const handleSendButtonAnswerMock = vi.fn();
useHandleSendMock.mockReturnValue({
  handleSendButtonAnswer: handleSendButtonAnswerMock,
  handleSend: vi.fn(),
});

describe('ButtonOptionList', () => {
  it('renders correctly two buttons', () => {
    // given
    const button1: ButtonOption = {
      title: 'button 1',
      payload: 'payload 1',
    };
    const button2: ButtonOption = {
      title: 'button 2',
      payload: 'payload 2',
    };

    // when
    const { getByText } = render(<ButtonOptionList buttons={[button1, button2]} />);
    // then
    expect(getByText('button 1')).toBeInTheDocument();
    expect(getByText('button 2')).toBeInTheDocument();
  });

  it.each([
    ['button 1', 'button 2'],
    ['button 2', 'button 1'],
  ])(
    'should render only button: [%s] if that button was clicked and not button [%s]',
    async (buttonName, notVisibleName) => {
      // given
      const button1: ButtonOption = {
        title: 'button 1',
        payload: 'payload 1',
      };
      const button2: ButtonOption = {
        title: 'button 2',
        payload: 'payload 2',
      };

      const user = userEvent.setup();
      // when
      const { queryByText } = render(<ButtonOptionList buttons={[button1, button2]} />);
      const button = queryByText(buttonName);
      expect(button).not.toBeNull();
      await user.click(button!);
      // then
      await waitFor(() => {
        expect(queryByText(buttonName)).toBeInTheDocument();
        expect(queryByText(notVisibleName)).not.toBeInTheDocument();
      });
    }
  );
  it.each([['button 1'], ['button 2']])(
    'should render [%s] outlined first and contained after click',
    async (buttonName) => {
      // given
      const button1: ButtonOption = {
        title: 'button 1',
        payload: 'payload 1',
      };
      const button2: ButtonOption = {
        title: 'button 2',
        payload: 'payload 2',
      };
      const user = userEvent.setup();

      // when
      const { queryByText } = render(<ButtonOptionList buttons={[button1, button2]} />);
      const button = queryByText(buttonName);
      expect(button).not.toBeNull();
      // then
      await waitFor(() => {
        expect(button).toHaveClass('MuiButton-outlined');
      });
      // then click => should be contained
      await user.click(button!);
      const updatedButton = queryByText(buttonName)!;
      await waitFor(() => {
        expect(updatedButton).toHaveClass('MuiButton-contained');
      });
    }
  );
  it('should call handleSendButtonAnswer only once when clicked', async () => {
    // given
    const button1: ButtonOption = {
      title: 'button 1',
      payload: 'payload 1',
    };

    // when
    const user = userEvent.setup();
    const { queryByText } = render(<ButtonOptionList buttons={[button1]} />);
    const button = queryByText('button 1');
    expect(button).not.toBeNull();

    //  click once
    await user.click(button!);
    // another click => should not trigger anything
    await user.click(button!);
    // then
    await waitFor(() => {
      expect(handleSendButtonAnswerMock).toHaveBeenCalledOnce();
    });
  });
  it('should call handleSendButtonAnswer with button 1', async () => {
    // given
    const button1: ButtonOption = {
      title: 'button 1',
      payload: 'payload 1',
    };

    // when
    const user = userEvent.setup();
    const { queryByText } = render(<ButtonOptionList buttons={[button1]} />);
    const button = queryByText('button 1');
    expect(button).not.toBeNull();

    //  click once
    await user.click(button!);

    // then
    await waitFor(() => {
      expect(handleSendButtonAnswerMock).toHaveBeenCalledWith(button1);
    });
  });
});
