import { useState } from "react";

export const useOpen = (initial = false) => {
  const [open, setOpen] = useState<boolean>(initial);
  const toggle = () => setOpen((prev) => !prev);

  return { open, setOpen, toggle };
};
