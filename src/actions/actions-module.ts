import { ContainerModule, interfaces } from 'inversify';

import { AnyAction } from './any-action';
import { AnyListener } from '../api/any-listener';

const actionsModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(AnyAction).toSelf().inSingletonScope();
  bind(AnyListener).toService(AnyAction);
});

export { actionsModule };
