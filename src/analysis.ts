import { inject, injectable, named } from 'inversify';

import { Context } from '@actions/github/lib/context';
import { Handler } from './api/handler';
import { MultiInjectProvider } from './api/multi-inject-provider';

@injectable()
export class Analysis {
  @inject(MultiInjectProvider)
  @named(Handler)
  protected readonly handlers: MultiInjectProvider<Handler>;

  async analyze(context: Context): Promise<void> {
    for await (const handler of this.handlers.getAll()) {
      console.log('check if supports for ' + handler);
      if (handler.supports(context.eventName)) {
        console.log('handling...');
        await handler.handle(context.eventName, context.payload);
      }
    }
  }
}
