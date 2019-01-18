// For vendors for example jQuery, Lodash, angular2-jwt just import them here unless you plan on
// chunking vendors files for async loading. You would need to import the async loaded vendors
// at the entry point of the async loaded file. Also see custom-typings.d.ts as you also need to
// run `typings install x` where `x` is your module

// TODO(gdi2290): switch to DLLs

// Angular 2
// import '@angular/platform-browser';
// import '@angular/platform-browser-dynamic';
// import '@angular/core';
// import '@angular/common';
// import '@angular/forms';
// import '@angular/http';
// import '@angular/router';

// AngularClass
import '@angularclass/hmr';

// RxJS
import 'ngx-bootstrap';
import 'rxjs';
//import 'ng2-dnd';
//

// import PatternFly CSS
/* tslint:disable:ordered-imports */
import 'patternfly/dist/css/patternfly.fontless.min.css';
import 'patternfly/dist/css/patternfly-additions.min.css';
import 'patternfly-ng/dist/css/patternfly-ng.min.css';
import 'patternfly-sandbox-ng/dist/css/patternfly-sandbox-ng.min.css';

if ('production' === ENV) {
  // Production
} else {
  // Development
}
