import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import ButtonOptionComponent from './ButtonOptionComponent.tsx';
import type { ButtonOption } from '../../../domain/ButtonOption.ts';
import useMessageService from '../../../service/MessageService.ts';

type Props = {
  buttons: ButtonOption[];
};

const ButtonOptionList: React.FC<Props> = ({ buttons }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { sendMessageAndGetResponse } = useMessageService();
  const [selectedButtonName, setSelectedButtonName] = useState<string | null>(null);

  const handleClick = (index: number) => {
    setSelectedIndex(index);
  };
  return (
    <Box>
      <Grid container spacing={{ xs: 2, md: 2 }} columns={1}>
        {(selectedIndex !== null ? [buttons[selectedIndex]] : buttons).map(
          (option, index) => (
            <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
              {
                <ButtonOptionComponent
                  data-testid={'list-button-option-component'}
                  filled={
                    option.filled ??
                    (selectedButtonName !== null && selectedButtonName === option.title)
                  }
                  onClick={async () => {
                    handleClick(selectedIndex !== null ? selectedIndex : index);
                    setSelectedButtonName(option.title);
                    await sendMessageAndGetResponse(option.payload, option);
                  }}
                  button={option}
                />
              }
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
};

export default ButtonOptionList;
