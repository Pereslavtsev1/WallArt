import { type ReactNode, Suspense, use } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

export type Streamable<T> = T | Promise<T>;

function useStreamable<T>(streamable: Streamable<T>) {
  return isPromise(streamable) ? use(streamable) : streamable;
}
function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return value instanceof Promise;
}

type StreamProps<T> = {
  value: Streamable<T>;
  children: (value: T) => ReactNode;
  fallback: ReactNode;
  errorFallback: ReactNode;
};
function UseStreamable<T>({
  value,
  children,
}: {
  value: Streamable<T>;
  children: (value: T) => React.ReactNode;
}) {
  return children(useStreamable(value));
}
export function Stream<T>({
  value,
  children,
  fallback,
  errorFallback,
}: StreamProps<T>) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        <UseStreamable value={value}>{children}</UseStreamable>
      </Suspense>
    </ErrorBoundary>
  );
}
