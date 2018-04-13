import { Injectable } from '@angular/core';

@Injectable()
export class AnalyticsUrlService {

    getRecommenderAPIUrl(): string {
        return process.env['ANALYTICS_RECOMMENDER_URL'] || '';
    }

    getLicenseAPIUrl(): string {
        return process.env['ANALYTICS_LICENSE_URL'] || '';
    }

}
