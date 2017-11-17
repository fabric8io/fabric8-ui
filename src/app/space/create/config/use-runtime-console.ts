export function useRuntimeConsole(): boolean {
  return ENV !== 'development';
}
