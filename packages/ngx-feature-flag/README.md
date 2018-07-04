# ngx-feature-flag

Angular-based library to use [fabric8-toggles-service](https://github.com/fabric8-services/fabric8-toggles-service) in your Angular application.

## Getting started

* You can import the lib in your application:

`npm install ngx-feature-flag`

* or use the demo app:

```shell
npm run build:demo
npm run start:demo
```
  
## Build 
 
* Pre-requisites
  * node 8.3.0
  * npm 5.3.0

* Install the dependencies
 
```
npm install
```
 
* Run the tests
 
```
npm test
```
 
## Demo

* build and run
```
npm run build:demo
npm run start:demo

```
* see
Go to http://localhost:8001 

## Release

* pre-requisites
Login to [npmjs central repo](https://www.npmjs.com/) with your credential (you should be owner of the library).

* build `ngx-feature-flag` as a npm library

```
npm run build   
```

* publish
```
npm publish dist
```

