export const Configuration = Symbol.for('Configuration');
export interface Configuration {
  empty(): string;
}
