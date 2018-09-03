import {
    Component,
    ElementRef,
    ViewEncapsulation
} from '@angular/core';

import * as c3 from 'c3';
// require('../../node_modules/c3/c3');

/**
 * 
 * This chart uses C3 for generating and rendering charts.
 * 
 * Minimum Requirements:
 * C3, D3 (As C3 internally uses D3)
 *
 * Usage:
 * eg.) <f8-chart bind-data="dataFromTheComponentOrWherever"></f8-chart>
 *
 * 1. MultiLine chart takes the parameters
 *      a. data of c3 configuration
 */
@Component({
    selector: 'f8-chart',
    template: ``,
    encapsulation: ViewEncapsulation.None,
    inputs: ['data', 'chartOptions', 'configs'],
    styles: [
        `.ng2-c3 {
            display:block; // This is required for proper positioning of tooltip
        }
        `
    ]
})
export class ChartComponent {

    // All Inputs for this component declaration
    private data: any; // Configuration for series to be used for generating C3 has to be here
    private chartOptions: any;
    // Includes all the configurations for the chart and also individual chart configurations
    private element: HTMLElement; // Element to which the chart has to be attached to
    private configs: any;

    // Below configs have been captured from C3 Reference Doc's Need 
    // to be updated if in case c3 includes new options
    private c3Configs: Array<string> = [
                                        'axis',
                                        'tooltip',
                                        'grid',
                                        'legend',
                                        'zoom',
                                        'regions',
                                        'subchart'
                                        ];

    /**
     *  Below options have been captured from C3 Reference Doc's 
     *  This doesnot include call back methods those options would be captured seperately
     */
    private c3Options: Array<string> = [
                                        'size',
                                        'padding',
                                        'color',
                                        'interaction',
                                        'transition',
                                        'point',
                                        'line',
                                        'area',
                                        'bar',
                                        'pie',
                                        'donut',
                                        'gauge',
                                        'oninit',
                                        'onrendered',
                                        'onmouseover',
                                        'onmouseout',
                                        'onresize',
                                        'onresized'
                                        ];


    constructor(elementReference: ElementRef) {
        this.element = elementReference.nativeElement;
        // Adding the below line to specify CSS for the ng2-c3 selector
        this.element.className += ' ng2-c3';
    }

    // Checks for the changes made in the data and re-renders the charts accordingly
    public ngOnChanges(): void {
        try {
            this.__render(this.data, this.chartOptions, this.configs);
        } catch (err) {
            console.log(err);
        }
    }

    private __render(inputData: any, chartOptionsData: any, chartConfigsData: any): void {
        let _this: ChartComponent = this;
        if (this.isValid(inputData)) {

            let c3InputData: any = {};

            c3InputData['bindto'] = _this.element;
            c3InputData['data'] = inputData;


            /**
             * Options for the charts provided
             * Options listed like axis, tooltip, grid, legend, zoom , point
             * Individual options are parsed and set in c3InputData Json
             * to be provided to c3
             */
            if (this.isValid(chartConfigsData)) {
                this.updateIfValidInput(chartConfigsData, c3InputData, this.c3Configs);
            }

            /*
             * Chart Configuration could have multiple Options
             * Size, padding, color Pattern, Transition
             * Some callback initializers like OnInit, Onrendered, OnMouseOver, OnMouseOut
             *  
             */

            if (this.isValid(chartOptionsData)) {
                this.updateIfValidInput(chartOptionsData, c3InputData, this.c3Options);
            }

            /**
             * Should find a way to check for proper inputs
             * if(!this.isValidInput(c3InputData)) {
             *     throw new Error('Invalid Configuration passed');
             * }
             * 
             */
            c3.generate(c3InputData);
            // Generates the C3 chart for the given configuration 
            // and places it inside the directive's element.
        }

    }

    // A utility method to check if a provided value is valid
    private isValid(randomInput: any): boolean {
        return randomInput !== undefined && randomInput !== null;
    }

    /**
     * A utility method to traverse through teh input map, checks with the given config 
     *  Updates the  output map if input is present in config
     *  skips the field if the given input is not present in config map
     *  
     */
    private updateIfValidInput(inputMap: any, outputMap: any, config: Array<string>) {
        for (let key in inputMap) {
            if (inputMap.hasOwnProperty(key)) {
                let isValidOption = config.indexOf(key);
                if (isValidOption >= 0) {
                    outputMap[key] = inputMap[key];
                }
            }
        }
    }
}
