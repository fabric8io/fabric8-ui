/**
 * Defines the operations of the modal 'dialog' that hosts the component
 */
export interface IModalHost {
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
  onOpen();
  onClose();
  open(options?: any);
  close();
}

