import { Injectable } from '@angular/core';

import { Config } from 'ngx-launcher';

@Injectable()
export class MockHelperService  {

    private keys: any = {
        BACKEND: 'backend_url',
        ORIGIN: 'origin'
    };

    constructor(
        private config: Config
    ) {}

    getBackendUrl(): string {
        if (this.config) {
            return this.config.get(this.keys.BACKEND);
        }
        return null;
    }

    getOrigin(): string {
        if (this.config) {
            return this.config.get(this.keys.ORIGIN);
        }
        return null;
    }

}
