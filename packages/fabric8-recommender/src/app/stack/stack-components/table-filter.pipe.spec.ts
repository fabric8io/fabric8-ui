/* tslint:disable:no-unused-variable */
import { TableFilter } from './table-filter.pipe';

describe('pipe :filter', () => {
    let pipe: any = TableFilter;
    let items: Array<any> = [
        {
            'name': 'io.vertx:vertx-hazelcast', 'curVersion': '3.3.3', 'latestVersion': '3.3.3',
            'dateAdded': 'NA', 'pubPopularity': -1, 'enterpriseUsage': 'NA', 'teamUsage': 'NA'
        },
        {
            'name': 'io.vertx:vertx-mongo-embedded-db', 'curVersion': '3.3.3',
            'latestVersion': '3.3.3', 'dateAdded': 'NA', 'pubPopularity': -1,
            'enterpriseUsage': 'NA', 'teamUsage': 'NA'
        },
        {
            'name': 'io.vertx:vertx-mongo-client', 'curVersion': '3.3.3', 'latestVersion': '3.3.3',
            'dateAdded': 'NA', 'pubPopularity': -1, 'enterpriseUsage': 'NA', 'teamUsage': 'NA'
        },
        {
            'name': 'io.vertx:vertx-web', 'curVersion': '3.3.3', 'latestVersion': '3.3.3',
            'dateAdded': 'NA', 'pubPopularity': -1, 'enterpriseUsage': 'NA', 'teamUsage': 'NA'
        },
        {
            'name': 'io.vertx:vertx-core', 'curVersion': '3.3.3', 'latestVersion': '3.3.3',
            'dateAdded': 'NA', 'pubPopularity': 5664, 'enterpriseUsage': 'NA', 'teamUsage': 'NA'
        },
        {
            'name': 'io.vertx:examples-utils', 'curVersion': '3.3.3', 'latestVersion': 'NA',
            'dateAdded': 'NA', 'pubPopularity': -1, 'enterpriseUsage': 'NA', 'teamUsage': 'NA'
        }
    ];
    let field: String;
    let value: String;
    let retList: Array<any>;

    beforeEach(() => {
        pipe = new TableFilter();
    });

    it('should work with empty list', () => {
        expect(pipe.transform('')).toEqual([]);
    });

    it('should return empty list if items is empty list', () => {
        field = 'name';
        value = '';
        expect(pipe.transform([], field, value)).toEqual([]);
    });

    it('should filter with name value', () => {
        field = 'name';
        value = 'core';
        retList = [{
            'name': 'io.vertx:vertx-core', 'curVersion': '3.3.3', 'latestVersion': '3.3.3',
            'dateAdded': 'NA', 'pubPopularity': 5664, 'enterpriseUsage': 'NA', 'teamUsage': 'NA'
        }];
        expect(pipe.transform(items, field, value)).toEqual(retList);
    });

    it('should return complete list if field is empty', () => {
        field = '';
        value = 'core';
        expect(pipe.transform(items, field, value)).toEqual(items);
    });

    it('should return complete list if value is empty', () => {
        field = 'name';
        value = '';
        expect(pipe.transform(items, field, value)).toEqual(items);
    });

});
