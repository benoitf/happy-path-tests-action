import { ContainerModule, interfaces } from 'inversify';

import { AnyHandler } from './any-handler';
import { Handler } from '../api/handler';
import { bindMultiInjectProvider } from '../api/multi-inject-provider';

const handlersModule = new ContainerModule((bind: interfaces.Bind) => {
  bindMultiInjectProvider(bind, Handler);
  bind(Handler).to(AnyHandler).inSingletonScope();
});

export { handlersModule };
