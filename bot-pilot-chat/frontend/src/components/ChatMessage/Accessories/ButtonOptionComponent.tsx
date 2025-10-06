import { Button } from '@mui/material';
import React from 'react';
import type { GeneralButtonProps } from '../../../domain/GeneralButtonProps.ts';
import type { ButtonOption } from '../../../domain/ButtonOption.ts';

type Props = {
  button: ButtonOption;
  filled?: boolean;
};

export const ButtonOptionComponent: React.FC<GeneralButtonProps & Props> = ({
  onClick,
  button,
  filled,
}) => {
  console.log(`filled: [${filled}]`);
  return (
    <Button
      sx={{
        fontSize: '0.7rem',
      }}
      value={button.payload}
      title={button.title}
      onClick={(e) => {
        if (!filled) {
          onClick(e);
        }
      }}
      variant={filled ? 'contained' : 'outlined'}
      size="small"
    >
      {button.title}
    </Button>
  );
};

export default ButtonOptionComponent;
