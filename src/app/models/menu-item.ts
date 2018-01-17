export interface MenuItem {
    name?: string;
    feature?: string;
    path: string;
    fullPath?: string;
    icon?: string;
    menus?: MenuItem [];
    active?: boolean;
    hide?: boolean;
}
