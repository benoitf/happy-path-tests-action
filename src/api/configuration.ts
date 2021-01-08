export const Configuration = Symbol.for('Configuration');
export interface Configuration {
  cheUrl(): string;
}
