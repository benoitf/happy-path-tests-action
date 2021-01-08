import { ContainerModule, interfaces } from 'inversify';

import { AnyListener } from './any-listener';
import { bindMultiInjectProvider } from '../api/multi-inject-provider';

const apisModule = new ContainerModule((bind: interfaces.Bind) => {
  bindMultiInjectProvider(bind, AnyListener);
});

export { apisModule };
