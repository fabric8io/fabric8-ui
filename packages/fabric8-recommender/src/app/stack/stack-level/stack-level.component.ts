import {Component, Input, OnChanges, Output, EventEmitter} from '@angular/core';

import {UserStackInfoModel, ComponentInformationModel} from '../models/stack-report.model';

@Component({
    selector: 'stack-level-information',
    templateUrl: './stack-level.component.html',
    styleUrls: ['stack-level.component.scss']
})

export class StackLevelComponent {
    @Input() userStack: UserStackInfoModel;
    @Input() outliers: any;

    @Output() changeFilter: EventEmitter<any> = new EventEmitter();

    public licenseInfo: any = {};
    public securityInfo: any = {};

    constructor() {}

    ngOnChanges(): void {
        if (this.userStack) {
            this.handleLicenseInformation(this.userStack);
            this.handleSecurityInformation(this.userStack);
        }
        if (this.outliers) {
            this.handleStatistics(this.outliers);
        }
    }

    public handleFilter(filterBy: any): void {
        this.changeFilter.emit(filterBy);
    }

    private handleStatistics(outliers: any): void {
        
    }

    private sortChartColumnData(array: Array<Array<any>>): Array<Array<any>> {
        return array.sort((a, b) => {
            if (a[1] === b[1]) {
                return 0;
            }
            return a[1] > b[1] ? -1 : 1;
        });
    }

    private handleSecurityInformation(tab: UserStackInfoModel): void {
        let dependencies: Array<ComponentInformationModel> = tab.dependencies;
        let security: Array<any> = [];
        let temp: Array<any> = [];
        
        dependencies.forEach((dependency) => {
            security = dependency.security;
            if (security.length > 0) {
                let max: any = security.reduce((a, b) => {
                    return parseFloat(a['CVSS']) < parseFloat(b['CVSS']) ? b : a;
                });
                temp.push({
                    name: dependency.name,
                    cve: max
                });
            }
        });
        if (temp.length > 0) {
            let final: any = temp.reduce((a, b) => {
                return parseFloat(a['cve']['CVSS']) < parseFloat(b['cve']['CVSS']) ? b : a;
            });
            let cvssValue: number = final.cve.CVSS;
            let indicator: number;
            let iconClass: string = 'fa fa-shield';
            let displayClass: string = 'progress-bar-warning';

            if (cvssValue < 0) {
                indicator = -1;
            }
            if (cvssValue >= 7.0) {
                indicator = cvssValue;
                iconClass = 'fa fa-shield';
                displayClass = 'progress-bar-danger';
            }
            this.securityInfo = {
                name: final.name,
                cve: final.cve,
                percentage: final.cve.CVSS * 10,
                status: final.cve.CVSS < 7 ? 'moderate' : 'critical',
                iconClass: iconClass,
                displayClass: displayClass
            };
        }
    }

    private handleLicenseInformation(tab: UserStackInfoModel): void {
        
        let licenses: any = {};
        let columnData: Array<Array<any>> = [];
        let columnDataLength: number = 0;
        let otherLicensesArray: Array<string> = [];
        let otherLicensesRatio: any = 0;

        let temp: Array<any> = [];

        tab.dependencies.forEach((t) => {
            t.licenses.forEach((license) => {
                if (!licenses[license]) {
                    licenses[license] = 1;
                } else {
                    ++ licenses[license];
                }
            });
        });
        for (let i in licenses) {
            if (licenses.hasOwnProperty(i)) {
                // Push names and count to be in this structure ['Name', 20] for C3
                temp = [];
                temp.push(i);
                temp.push(licenses[i]);
                columnData.push(temp);
            }
        }
        // sort the data array by license count
        columnData = this.sortChartColumnData(columnData);
        columnDataLength = columnData ? columnData.length : 0;
        if (columnDataLength > 4) {
            for (let i = 3; i < columnDataLength; i++) {
                otherLicensesArray.push(columnData[i][0]);
                otherLicensesRatio += columnData[i][1];
            }
            columnData.splice(4);
            columnData[3][0] = 'Others';
            columnData[3][1] = otherLicensesRatio;
        }
        console.log(columnData);
        this.licenseInfo = {
            data: {
                columns: columnData,
                type: 'donut',
                labels: false
            },
            chartOptions: {
                size: {
                    height: 150,
                    width: 250
                },
                donut: {
                    width: 13,
                    label: {
                        show: false
                    },
                    title: columnDataLength + ' Licenses'
                }
            },
            configs: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    format: {
                        name: (name, ratio, id, index) => {
                            if (name === 'Others') {
                                return otherLicensesArray.toString();
                            }
                            return name;
                        },
                        value: (value, ratio, id, index) => {
                            return (ratio * 100).toFixed(2) + '%';
                        }
                    }
                }
            }
        };
        console.log (licenses);
    }
}
