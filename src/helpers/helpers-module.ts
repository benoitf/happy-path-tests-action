import { ContainerModule, interfaces } from 'inversify';
import { CheHelper } from './che-helper';
import { HappyPathHelper } from './happy-path-helper';
import { ImagesHelper } from './images-helper';
import { WorkspaceHelper } from './workspace-helper';


const helpersModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(CheHelper).toSelf().inSingletonScope();
  bind(HappyPathHelper).toSelf().inSingletonScope();
  bind(ImagesHelper).toSelf().inSingletonScope();
  bind(WorkspaceHelper).toSelf().inSingletonScope();
  
});

export { helpersModule };
