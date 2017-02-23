export interface Modal {
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
  open();
  close();
  onOpen();
  onClose();
}
