export default interface ModalData {
  isOpen: boolean;
  title: string;
  body: any;
  actionLabel: string;
  disabled: boolean;
  secondaryAction?: () => void | undefined;
  secondaryActionLabel?: string | undefined;
  footer: any
}
