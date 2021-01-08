/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

import * as fs from 'fs-extra';
import * as path from 'path';

import { AnyAction } from '../../src/actions/any-action';
import { Configuration } from '../../src/api/configuration';
import { Container } from 'inversify';
import { InstallEclipseCheLogic } from '../../src/logic/install-eclipse-che-logic';

describe('Test Logic InstallEclipseCheLogic', () => {
  let container: Container;
  let configuration: Configuration;
  let anyAction: AnyAction;

  beforeEach(() => {
    container = new Container();
    container.bind(InstallEclipseCheLogic).toSelf().inSingletonScope();

    anyAction = {
      registerCallback: jest.fn(),
    } as any;
    container.bind(AnyAction).toConstantValue(anyAction);

    configuration = {
      addComment: jest.fn(),

      addStatus: jest.fn(),

      cheInstance: jest.fn(),
    };
    container.bind(Configuration).toConstantValue(configuration);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('test no comment, no status', async () => {
    const installEclipseCheLogic = container.get(InstallEclipseCheLogic);

    installEclipseCheLogic.execute();

    expect(installEclipseCheLogic).toBeCalledTimes(0);
  });
});
