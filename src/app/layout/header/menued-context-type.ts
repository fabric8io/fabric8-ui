import { MenuItem } from './../../models/menu-item';
import { ContextType } from 'ngx-fabric8-wit';
export class MenuedContextType implements ContextType {
  name: string;
  icon: string;
  menus: MenuItem[];
}
