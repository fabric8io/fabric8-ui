import { Component, Input, OnInit, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { getStackReportModel } from '../utils/stack-api-utils';
import {
    StackReportModel, ResultInformationModel, UserStackInfoModel,
    ComponentInformationModel, RecommendationsModel
} from '../models/stack-report.model';
import { PipelineInsightsService } from './pipeline-insights.service';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Component({
    selector: 'pipleine-insights-details',
    providers: [PipelineInsightsService],
    // encapsulation: ViewEncapsulation.None,
    styleUrls: ['./pipeline-insights.component.less'],
    templateUrl: './pipeline-insights.component.html'
})
@Injectable()
export class PipelineInsightsComponent implements OnInit, OnChanges {
    // @Input() gatewayConfig: any;
    @Input() stack: string;
    @Input() buildNumber;
    @Input() appName;
    @Input() stackResponse;
    @Input() component;
    @Input() url: string;

    @ViewChild('stackModule') modalStackModule: any;

    public cve_Info: string;
    public stackUrl: string;
    public flag: boolean = false;
    public flag1: boolean = false;
    public interval : number = 7000;
    // public alive: boolean = true;

    constructor(private PipelineInsightsService: PipelineInsightsService,
        private http: Http) { }



    public geturl(): void {
        let subs = null;
        let alive: boolean = true;
        let counter: number = 0;
        if(this.url && this.url !== '') {
            this.stackUrl = this.url;
            let observable: any = this.PipelineInsightsService
                .getStackAnalyses(this.url);

                TimerObservable.create(0, this.interval)
                .takeWhile(() => alive)
                .subscribe(()=>{
                    if (subs) {
                        subs.unsubscribe();
                    }
                    subs = observable.subscribe((data) => {
                        if (data && (!data.hasOwnProperty('error') && Object.keys(data).length !== 0) && (data.statusCode === 200 || data.statusCode === 202)) {
                            alive = false;
                            subs.unsubscribe();
                            console.log(data);
                            console.log("Status  :" + typeof data.statusCode);
                            let response: Array<ResultInformationModel> = data.result;
                            if (response.length> 0) {
                                for (let i = 0; i < data.result.length; ++i) {
                                let c = data.result[i];
                                if (c.user_stack_info) {
                                    if (c.user_stack_info.analyzed_dependencies) {
                                        for (let j = 0; j < c.user_stack_info.analyzed_dependencies.length; ++j) {
                                            let d = c.user_stack_info.analyzed_dependencies[j];
                                            if (d.security && d.security.length > 0) {
                                                this.flag = true;
                                                break;
                                            }
                                        }
                                    }
                                }
            
                            }
                            for (let i = 0; i < data.result.length; ++i) {
                                let c = data.result[i];
                                if (c.user_stack_info) {
                                    if (c.user_stack_info.license_analysis) {console.log("liscense"+c.user_stack_info.license_analysis.length);
                                            let d = c.user_stack_info.license_analysis.status;                                
                                            console.log("d value"+d);
                                            if (d=="ComponentConflict") {
                                                this.flag1 = true;
                                                break;
                                            }
                                            if (d=="StackConflict") {
                                                this.flag1 = true;
                                                break;
                                            }
                                    }
                                }
            
                            }
                        }
                        }
                        if(data.statusCode !== 200 && data.statusCode !== 202) {
                            alive = false;
                            subs.unsubscribe();
                            console.log("Status  :" + data.statusCode);
                        }
                    },  error => {
                        alive = false;
                    });
                    if (counter ++ > 5) {
                        alive = false;
                    }
                })
        }
                
        

    }



    ngOnInit(): void {
        this.geturl();
    }

    ngOnChanges(): void {
        this.geturl();
    }


}
