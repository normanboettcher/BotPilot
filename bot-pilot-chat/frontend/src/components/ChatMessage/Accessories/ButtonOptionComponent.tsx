import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import React from 'react';
import type { GeneralButtonProps } from '../../../domain/GeneralButtonProps.ts';
import type { ButtonOption } from '../../../domain/ButtonOption.ts';

type Props = {
  button: ButtonOption;
};

export const ButtonOptionComponent: React.FC<GeneralButtonProps & Props> = ({
  onClick,
  button,
}) => {
  const [filled, setFilled] = useState<boolean>(false);

  useEffect(() => {
    console.log(`filled: [${filled}]`);
  }, [filled]);
  return (
    <Button
      sx={{
        fontSize: '0.7rem',
        backgroundColor: filled ? 'primary.main' : 'white',
      }}
      disabled={button.disabled ?? false}
      value={button.payload}
      title={button.title}
      onClick={(e) => {
        if (!filled) {
          onClick(e);
          setFilled(true);
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
