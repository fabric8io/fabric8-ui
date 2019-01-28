import * as selectors from '../selectors';
import { AppState } from '../../appState';
import { ContextState } from '../state';

describe('context selectors', () => {
  it('should return context', () => {
    const context = {} as ContextState;
    expect(
      selectors.getContext({
        context,
      } as AppState),
    ).toBe(context);
  });
});
