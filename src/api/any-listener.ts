export const AnyListener = Symbol.for('AnyListener');
export interface AnyListener {
  execute(): Promise<void>;
}
