import { inject, injectable, named } from 'inversify';

import { AnyListener } from '../api/any-listener';
import { Handler } from '../api/handler';
import { MultiInjectProvider } from '../api/multi-inject-provider';

@injectable()
export class AnyHandler implements Handler {
  @inject(MultiInjectProvider)
  @named(AnyListener)
  protected readonly anyListeners: MultiInjectProvider<AnyListener>;

  supports(): boolean {
    return true;
  }

  async handle(): Promise<void> {
    await Promise.all(this.anyListeners.getAll().map(async (listener) => listener.execute()));
  }
}
