import { AnyListener } from '../api/any-listener';
import { injectable } from 'inversify';

@injectable()
export class AnyAction implements AnyListener {
  private callbacks: Array<() => Promise<void>> = [];

  /**
   * Add the callback provided by given action name
   */
  registerCallback(callback: () => Promise<void>): void {
    this.callbacks.push(callback);
  }

  async execute(): Promise<void> {
    for await (const callback of this.callbacks) {
      callback();
    }
  }
}
