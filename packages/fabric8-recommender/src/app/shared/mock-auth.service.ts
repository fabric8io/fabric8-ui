import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class MockAuthenticationService {
    getToken(): string {
        // let token: string = process.env['STACK_API_TOKEN'];
        return environment.STACK_API_TOKEN || '';
    }
}
