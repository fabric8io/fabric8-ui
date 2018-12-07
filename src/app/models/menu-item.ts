export interface MenuItem {
    name?: string;
    feature?: string;
    subFeature?: string;
    path: string;
    fullPath?: string;
    icon?: string;
    menus?: MenuItem [];
    active?: boolean;
    hide?: boolean;
}
