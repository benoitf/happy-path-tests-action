import 'reflect-metadata';

import { Analysis } from '../src/analysis';
import { AnyAction } from '../src/actions/any-action';
import { AnyHandler } from '../src/handler/any-handler';
import { AnyListener } from '../src/api/any-listener';
import { Configuration } from '../src/api/configuration';
import { Container } from 'inversify';
import { Handler } from '../src/api/handler';
import { InstallEclipseCheLogic } from '../src/logic/install-eclipse-che-logic';
import { InversifyBinding } from '../src/inversify-binding';
import { Logic } from '../src/api/logic';
import { MinikubeHelper } from '../src/helpers/download-minikube-helper';
import { OctokitBuilder } from '../src/github/octokit-builder';

describe('Test InversifyBinding', () => {
  test('test bindings', async () => {
    const addComment = true;
    const addStatus = true;
    const cheInstance = 'https://foo.com';

    const inversifyBinding = new InversifyBinding('foo', addComment, addStatus, cheInstance);
    const container: Container = inversifyBinding.initBindings();

    expect(inversifyBinding).toBeDefined();

    // check all actions
    const anyAction = container.get(AnyAction);
    expect(anyAction).toBeDefined();
    const anyListeners: AnyListener[] = container.getAll(AnyListener);
    expect(anyListeners).toBeDefined();
    expect(anyListeners.includes(anyAction)).toBeTruthy();

    // Handler
    const handlers: Handler[] = container.getAll(Handler);
    expect(handlers.find((handler) => handler.constructor.name === AnyHandler.name)).toBeTruthy();

    // helpers
    expect(container.get(MinikubeHelper)).toBeDefined();

    // config
    const configuration: Configuration = container.get(Configuration);
    expect(configuration).toBeDefined();
    expect(configuration.addComment()).toEqual(addComment);
    expect(configuration.addStatus()).toEqual(addStatus);
    expect(configuration.cheInstance()).toEqual(cheInstance);

    // logic
    const logics: Logic[] = container.getAll(Logic);
    expect(logics).toBeDefined();
    expect(logics.find((logic) => logic.constructor.name === InstallEclipseCheLogic.name)).toBeTruthy();

    const octokitBuilder = container.get(OctokitBuilder);
    expect(octokitBuilder).toBeDefined();

    const analysis = container.get(Analysis);
    expect(analysis).toBeDefined();
  });
});
