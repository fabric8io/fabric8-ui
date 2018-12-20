export class Dialog {
  title: String = 'Dialog Title';

  message: String = 'Dialog Message';

  actionButtons: ActionItems[];
}

export class ActionItems {
  title: string;

  value: number;

  default: boolean;
}
