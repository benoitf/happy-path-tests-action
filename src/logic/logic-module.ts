import { ContainerModule, interfaces } from 'inversify';

import { AnyListener } from '../api/any-listener';
import { Logic } from '../api/logic';
import { bindMultiInjectProvider } from '../api/multi-inject-provider';
import { LaunchHappyPathTestsLogic } from './launch-happy-path-tests-logic';

const logicModule = new ContainerModule((bind: interfaces.Bind) => {
  bindMultiInjectProvider(bind, Logic);
  bind(LaunchHappyPathTestsLogic).toSelf().inSingletonScope();
  bind(Logic).toService(LaunchHappyPathTestsLogic);
  bind(AnyListener).toService(LaunchHappyPathTestsLogic);
});

export { logicModule };
