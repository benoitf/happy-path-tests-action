/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

import * as core from '@actions/core';

import { Main } from '../src/main';

jest.mock('@actions/core');

describe('Test Main', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('test missing github token', async () => {
    const main = new Main();
    await main.start();
    expect(core.setFailed).toBeCalled();
    const call = (core.setFailed as jest.Mock).mock.calls[0];
    expect(call[0]).toMatch('No Github Token provided (github-token)');
  });

  test('test with token and no options', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (core as any).__setInput(Main.GITHUB_TOKEN, 'foo');

    jest.mock('../src/inversify-binding');
    const main = new Main();
    await main.start();
    expect(core.setFailed).toBeCalledTimes(0);
  });

  test('test with token and all options', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (core as any).__setInput(Main.GITHUB_TOKEN, 'foo');
    (core as any).__setInput(Main.ADD_STATUS, 'true');
    (core as any).__setInput(Main.ADD_COMMENT, 'true');
    (core as any).__setInput(Main.CHE_INSTANCE, 'https://foo.com');

    jest.mock('../src/inversify-binding');
    const main = new Main();
    await main.start();
    expect(core.setFailed).toBeCalledTimes(0);
  });
});
