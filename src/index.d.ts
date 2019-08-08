import { Selector } from 'reselect';
import {
  Action,
  AnyAction,
  ActionCreator,
  Dispatch,
  Store,
  Unsubscribe,
} from 'redux';

export type PromiseProducer<R, V> = (...args: R[]) => Promise<V>;
export type Responder<S, A, V> = (
  state: S,
  dispatch: Dispatch<Action<A>>,
) => Promise<V>;

export type DefaultSelector = Selector<Object, any>;
export type DefaultPromiseProducer = PromiseProducer<any, any>;
export type DefaultResponder = Responder<Object, AnyAction, any>;

export declare function connect(
  responders: DefaultResponder[],
  store: Store,
): Unsubscribe[];

export default function responder(
  selectors: DefaultSelector[],
  promiseProducer: DefaultPromiseProducer,
  successActionCreator: ActionCreator<AnyAction>,
  failureActionCreator: ActionCreator<AnyAction>,
): DefaultResponder;