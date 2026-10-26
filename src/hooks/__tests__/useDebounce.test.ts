import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce custom hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return initial value immediately and update debounced value after specified delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce<string>(value, delay),
      {
        initialProps: { value: 'React', delay: 300 },
      }
    );

    expect(result.current).toBe('React');

    rerender({ value: 'TypeScript', delay: 300 });

    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe('React');

    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe('TypeScript');
  });

  test('should handle rapid consecutive changes by debouncing to the latest value', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: number }) => useDebounce<number>(value, 300),
      {
        initialProps: { value: 1 },
      }
    );

    expect(result.current).toBe(1);

    rerender({ value: 2 });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 3 });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 4 });
    act(() => {
      jest.advanceTimersByTime(299);
    });

    expect(result.current).toBe(1);

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe(4);
  });
});
