import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import ButtonOptionComponent from './ButtonOptionComponent.tsx';
import useHandleSend from '../../ChatInput/useHandleSend.ts';
import type { ButtonOption } from '../../../domain/ButtonOption.ts';

type Props = {
  buttons: ButtonOption[];
};

const ButtonOptionList: React.FC<Props> = ({ buttons }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { handleSendButtonAnswer } = useHandleSend();

  const handleClick = (index: number) => {
    setSelectedIndex(index);
  };
  return (
    <Box>
      <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 8 }}>
        {(selectedIndex !== null ? [buttons[selectedIndex]] : buttons).map(
          (option, index) => (
            <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
              {
                <ButtonOptionComponent
                  onClick={() => {
                    handleClick(selectedIndex !== null ? selectedIndex : index);
                    handleSendButtonAnswer(option);
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
