import {act, renderHook} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {useDebouncedValue} from './useDebouncedValue';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('useDebouncedValue', () => {
  it('keeps the initial value and publishes only the last input after a pause', () => {
    const {result, rerender} = renderHook(({value}) => useDebouncedValue(value, 300), {
      initialProps: {value: ''},
    });
    expect(result.current).toBe('');

    rerender({value: 'a'});
    act(() => vi.advanceTimersByTime(200));
    rerender({value: 'alice'});
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('');

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('alice');

    rerender({value: ''});
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('');
  });

  it('cancels a pending update when unmounted', () => {
    const {rerender, unmount} = renderHook(({value}) => useDebouncedValue(value, 300), {
      initialProps: {value: ''},
    });
    rerender({value: 'alice'});
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
