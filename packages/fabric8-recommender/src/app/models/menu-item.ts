export interface MenuItem {
    name?: string;
    path: string;
    fullPath?: string;
    icon?: string;
    menus?: MenuItem [];
    active?: boolean;
    hide?: boolean;
}
