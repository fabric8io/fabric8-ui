import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SentimentComponent} from './sentiment.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        SentimentComponent
    ],
    exports: [
        SentimentComponent
    ]
})
export class SentimentModule {}
