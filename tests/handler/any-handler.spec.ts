import 'reflect-metadata';

import { AnyHandler } from '../../src/handler/any-handler';
import { AnyListener } from '../../src/api/any-listener';
import { Container } from 'inversify';
import { Handler } from '../../src/api/handler';
import { bindMultiInjectProvider } from '../../src/api/multi-inject-provider';

describe('Test PullRequestHandler', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
    bindMultiInjectProvider(container, Handler);
    bindMultiInjectProvider(container, AnyListener);
    container.bind(Handler).to(AnyHandler).inSingletonScope();
  });

  test('test acceptance (true)', async () => {
    const prHandler: Handler = container.get(Handler);
    const supports = prHandler.supports('foo');
    expect(supports).toBeTruthy();
  });

  test('test no listener', async () => {
    const handler: Handler = container.get(Handler);
    expect(handler.constructor.name).toEqual(AnyHandler.name);
    const prHandler: AnyHandler = handler as AnyHandler;
    prHandler.handle();
    expect(prHandler['anyListeners'].getAll()).toEqual([]);
  });

  test('test call one listener', async () => {
    const listener: AnyListener = { execute: jest.fn() };
    container.bind(AnyListener).toConstantValue(listener);
    const handler: Handler = container.get(Handler);
    expect(handler.constructor.name).toEqual(AnyHandler.name);
    const prHandler: AnyHandler = handler as AnyHandler;
    prHandler.handle();
    expect(listener.execute).toBeCalled();
  });

  test('test call several listeners', async () => {
    // bind 2 listeners
    const listener: AnyListener = { execute: jest.fn() };
    container.bind(AnyListener).toConstantValue(listener);
    const anotherListener: AnyListener = { execute: jest.fn() };
    container.bind(AnyListener).toConstantValue(anotherListener);

    const handler: Handler = container.get(Handler);
    expect(handler.constructor.name).toEqual(AnyHandler.name);
    const prHandler: AnyHandler = handler as AnyHandler;
    prHandler.handle();

    // two listeners
    expect(prHandler['anyListeners'].getAll().length).toEqual(2);

    // each listener being invoked
    expect(listener.execute).toBeCalled();
    expect(anotherListener.execute).toBeCalled();
  });
});
