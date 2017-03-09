/* tslint:disable:no-unused-variable */
import { TableOrderByPipe } from './table-orderby.pipe';

describe('pipe :orderBy', () => {
    let pipe: any = TableOrderByPipe;
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
    let fieldName: String;
    let direction: String;
    let retList: Array<any>;

    beforeEach(() => {
        pipe = new TableOrderByPipe();
    });

    it('should work with empty list', () => {
        expect(pipe.transform(items, '', '')).toEqual(items);
    });

    it('should filter with fieldName and direction', () => {
        fieldName = 'name';
        direction = 'up';
        retList = [
            {
                'name': 'io.vertx:examples-utils', 'curVersion': '3.3.3', 'latestVersion': 'NA',
                'dateAdded': 'NA', 'pubPopularity': -1, 'enterpriseUsage': 'NA', 'teamUsage': 'NA'
            },
            {
                'name': 'io.vertx:vertx-core', 'curVersion': '3.3.3', 'latestVersion': '3.3.3',
                'dateAdded': 'NA', 'pubPopularity': 5664, 'enterpriseUsage': 'NA', 'teamUsage': 'NA'
            },
            {
                'name': 'io.vertx:vertx-hazelcast', 'curVersion': '3.3.3', 'latestVersion': '3.3.3',
                'dateAdded': 'NA', 'pubPopularity': -1, 'enterpriseUsage': 'NA', 'teamUsage': 'NA'
            },
            {
                'name': 'io.vertx:vertx-mongo-client', 'curVersion': '3.3.3',
                'latestVersion': '3.3.3', 'dateAdded': 'NA', 'pubPopularity': -1,
                'enterpriseUsage': 'NA', 'teamUsage': 'NA'
            },
            {
                'name': 'io.vertx:vertx-mongo-embedded-db', 'curVersion': '3.3.3',
                'latestVersion': '3.3.3', 'dateAdded': 'NA', 'pubPopularity': -1,
                'enterpriseUsage': 'NA', 'teamUsage': 'NA'
            },
            {
                'name': 'io.vertx:vertx-web', 'curVersion': '3.3.3', 'latestVersion': '3.3.3',
                'dateAdded': 'NA', 'pubPopularity': -1, 'enterpriseUsage': 'NA', 'teamUsage': 'NA'
            }];
        expect(pipe.transform(items, fieldName, direction)).toEqual(retList);
    });

    it('should return reverse complete list if fieldName is empty', () => {
        fieldName = '';
        direction = 'up';
        expect(pipe.transform(items, fieldName, direction)).toEqual(items.reverse());
    });

});
