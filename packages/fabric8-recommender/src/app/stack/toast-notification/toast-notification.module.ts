/** Vendor imports Go HERE */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToastNotificationComponent } from './toast-notification.component';

const declarations = [
    ToastNotificationComponent
];

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ...declarations
    ],
    exports: [
        ...declarations
    ]
})
export class ToastNotificationModule {}
