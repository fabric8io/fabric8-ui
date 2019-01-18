import { Injectable } from '@angular/core';
import { UserService } from 'ngx-login-client';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { AreaQuery } from '../models/area.model';
import { IterationQuery } from '../models/iteration.model';
import { LabelQuery } from '../models/label.model';
import { AND, ENCLOSURE, EQUAL_QUERY, NOT_EQUAL_QUERY, OR, P_START } from './query-keys';

const keys_before_field = [AND, OR, P_START];
const keys_before_value = [EQUAL_QUERY, NOT_EQUAL_QUERY];

@Injectable()
export class QuerySuggestionService {
  public queryObservable: BehaviorSubject<string> = new BehaviorSubject('-');
  private valueToSuggest: string = '';
  private valueToSuggestObservable: BehaviorSubject<string> = new BehaviorSubject('-');
  constructor(
    private areaQuery: AreaQuery,
    private iterationQuery: IterationQuery,
    private userService: UserService,
    private labelQuery: LabelQuery,
  ) {}

  private fields = of({
    'area.name': this.areaQuery.getAreaNames(),
    'iteration.name': this.iterationQuery.getIterationNames,
    'parent.number': of([]),
    title: of([]),
    assignee: this.fetchUsersBySearchValue(),
    'label.name': this.labelQuery.getlabelNames,
  });

  fetchUsersBySearchValue() {
    return this.valueToSuggestObservable.pipe(
      debounceTime(500),
      switchMap((value) => this.userService.getUsersBySearchString(value)),
      map((users) => users.map((user) => user.attributes.username)),
    );
  }

  /**
   * Takes the entire query written so far
   * split the query by keywords for the
   * ease of processing
   * @param query
   */
  shouldSuggestField(query: string): { suggest: boolean; value: string; lastKey: string } {
    let output = { suggest: true, value: query.trim(), lastKey: '' };

    for (let i = 0; i < keys_before_field.length; i++) {
      let temp = output.value.split(keys_before_field[i]);
      if (temp.length > 1) {
        // split with the key and take the last value from the array
        output = {
          suggest: true,
          value: temp[temp.length - 1].trim(),
          lastKey: keys_before_field[i],
        };
      }
    }

    if (output.value.indexOf(EQUAL_QUERY) > -1 || output.value.indexOf(NOT_EQUAL_QUERY) > -1) {
      output = {
        suggest: false,
        value: output.value,
        lastKey: '',
      };
    }

    return output;
  }

  /**
   * Takes a chunk of the query
   * extract the field and typed value
   * @param query
   */
  suggestValue(query: string): { field: string; value: string } {
    // split with equal
    let splitField = query.split(EQUAL_QUERY);
    // if no luck split with not equal
    if (splitField.length === 1) {
      splitField = query.split(NOT_EQUAL_QUERY);
    }
    const field = splitField[0].trim();
    // could be a IN query so we split it by ,
    let splittedvalues = splitField[1].split(',');
    // take the last one from the array
    let value = splittedvalues[splittedvalues.length - 1].trim();
    // trim the value if it has enclouser
    if (value[0] == ENCLOSURE) {
      value = value.substr(1);
    }
    if (value[value.length - 1] == ENCLOSURE) {
      value = value.substr(0, value.length - 1);
    }
    return { field, value };
  }

  replaceSuggestion(
    query_before_cursor: string,
    query_after_cursor: string,
    suggestion: string,
  ): string {
    return this.replaceSuggestedValue(
      query_before_cursor,
      query_after_cursor,
      this.valueToSuggest,
      suggestion,
    );
  }

  /**
   * This function takes the query and the suggested value to be replaced
   * the value is what is typed so far or before the cursor after the last key
   * for example, if the query before cursor is "area.name: area - 1 $AND iteration"
   * and after cursor is ".name: iteration - 1"
   * the value should be "iteration" and we'll have to remove that part from
   * query before cursor
   * For query after cursor section, we have to detect the first occurance of any key
   * and remove till that from initial of that part.
   * For our example the first key is ":" and we have to remove ".name" from that section
   * @param query_before_cursor
   * @param query_after_cursor
   * @param value
   * @param suggestion
   */
  replaceSuggestedValue(
    query_before_cursor: string,
    query_after_cursor: string,
    value: string,
    suggestion: string,
  ): string {
    const all_keys = [...keys_before_field, ...keys_before_value];
    const first_part =
      value == ''
        ? query_before_cursor
        : query_before_cursor.substr(0, query_before_cursor.length - value.length).trim();
    let after_cursor = query_after_cursor;
    all_keys.forEach((key) => {
      if (after_cursor !== '') {
        after_cursor = after_cursor.split(key)[0];
      }
    });
    const last_part = query_after_cursor.substr(after_cursor.length);
    return `${first_part} ${suggestion} ${last_part}`.trim();
  }

  getSuggestions(): Observable<string[]> {
    return this.queryObservable.pipe(
      distinctUntilChanged(),
      switchMap((query) => {
        if (query === '-') {
          return of([]);
        }
        const fieldSuggest = this.shouldSuggestField(query);
        if (fieldSuggest.suggest) {
          this.valueToSuggest = fieldSuggest.value;
          this.valueToSuggestObservable.next(fieldSuggest.value);
          return this.fields.pipe(
            map((fields) => Object.keys(fields).filter((f) => f.indexOf(fieldSuggest.value) > -1)),
          );
        } else {
          const fieldValue = this.suggestValue(fieldSuggest.value);
          this.valueToSuggest = fieldValue.value;
          this.valueToSuggestObservable.next(fieldValue.value);
          return this.fields.pipe(
            switchMap((fields) => {
              if (fields[fieldValue.field]) {
                return fields[fieldValue.field].pipe(
                  map((values: string[]) => values.filter((v) => v.indexOf(fieldValue.value) > -1)),
                );
              } else {
                return of([]);
              }
            }),
          );
        }
      }),
    );
  }
}
