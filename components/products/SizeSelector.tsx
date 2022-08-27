import { Box, Button } from "@mui/material";
import { FC } from "react";
import { ISize } from "../../interfaces";

interface Props {
  selectedSize?: ISize;
  sizes: ISize[];
  //methods
  onselectedSize: (size: ISize) => void;
}

export const SizeSelector: FC<Props> = ({
  selectedSize,
  sizes,
  onselectedSize,
}) => {
  return (
    <Box>
      {sizes.map((size) => (
        <Button
          key={size}
          size="small"
          color={selectedSize === size ? "primary" : "info"}
          onClick={() => onselectedSize(size)}
        >
          {size}
        </Button>
      ))}
    </Box>
  );
};
