import { writable } from 'svelte/store';
import allTemplates from '../util/templates/all-templates';

function createStepList() {
  const { subscribe, set, update } = writable([]);

  let subscriptions = [];

  const onChange = (action, step, steps) => {
    subscriptions.forEach((s) => s(action, step, steps));
  }

  const subscribeToChanges = (fn) => {
    subscriptions.push(fn);

    return () => {
      subscriptions = subscriptions.filter((s) => s !== fn);
    }
  };

  return {
    subscribe,
    add: (step) => {
      update((steps) => {
        onChange('add', step, steps);
        return [...steps, step]
      })
    },
    remove: (step) => {
      update((steps) => {
        onChange('remove', step, steps);
        return steps.filter((s) => s !== step)
      })
    },
    set,
    update,
    subscribeToChanges
  }
}

export const templates = allTemplates;
export const stepList = createStepList();
export const selected = writable(null);
export const modeler = writable(null);

export const ejected = writable(false);
export const ejectedXML = writable(null);