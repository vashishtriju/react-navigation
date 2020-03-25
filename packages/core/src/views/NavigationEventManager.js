// @ts-check

import * as React from 'react';

/**
 * @typedef {object} Props
 * @prop {(options: { create: any, emit: any }) => React.ReactNode} children
 *
 * @extends {React.Component<Props>}
 */
export default class NavigationEventManager extends React.Component {
  /**
   * @type {Record<string, Record<string, ((e: any) => void)[]>>}
   */
  _listeners = {};

  /**
   * @param {string} target
   */
  _create = (target) => {
    /**
     * @param {string} type
     * @param {() => void} callback
     */
    const removeListener = (type, callback) => {
      const callbacks = this._listeners[type]
        ? this._listeners[type][target]
        : undefined;

      if (!callbacks) {
        return;
      }

      const index = callbacks.indexOf(callback);

      callbacks.splice(index, 1);
    };

    /**
     * @param {string} type
     * @param {() => void} callback
     */
    const addListener = (type, callback) => {
      this._listeners[type] = this._listeners[type] || {};
      this._listeners[type][target] = this._listeners[type][target] || [];
      this._listeners[type][target].push(callback);

      return {
        remove: () => removeListener(type, callback),
      };
    };

    return {
      addListener,
      removeListener,
    };
  };

  /**
   * @param {string} type
   * @param {object} options
   * @param {string} options.target
   * @param {any} [options.data]
   */
  _emit = (type, { data, target }) => {
    const items = this._listeners[type] || {};

    /**
     * Copy the current list of callbacks in case they are mutated during execution
     * @type {((data: any) => void)[] | undefined}
     */
    const callbacks = items[target] && items[target].slice();

    callbacks?.forEach((cb) => cb(data));
  };

  render() {
    return this.props.children({
      create: this._create,
      emit: this._emit,
    });
  }
}
