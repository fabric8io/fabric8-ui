export class MenuItem {
    name?: string;
    path: string;
    fullPath?: string;
    icon?: string;
    menus?: MenuItem [];
    active?: boolean;

    /* if there is no other active menu found then should we make this menu active? */
    defaultActive?: boolean;
}
