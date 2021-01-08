/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

import * as fs from 'fs-extra';
import * as path from 'path';

import { AnyAction } from '../../src/actions/any-action';
import { Container } from 'inversify';

describe('Test Action AnyAction', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
    container.bind(AnyAction).toSelf().inSingletonScope();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('test single opened execute', async () => {
    const anyAction = container.get(AnyAction);

    const fooMock: any = { dummyCall: jest.fn() };
    await anyAction.registerCallback(async () => {
      fooMock.dummyCall();
    });

    await anyAction.execute();
    expect(fooMock.dummyCall).toHaveBeenCalled();
  });
});
