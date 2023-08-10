import { writable } from 'svelte/store';
import allTemplates from '../util/templates/all-templates';

// helpers ////
const userTask = {
  id: 'userTask',
  name: 'Form Step',
  description: 'A Form to be filled out by a Camunda User',
  icon: {
    contents: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='206.5 182.5 578.8 625'%3E%3Cpath d='M495.9 182.5C407.2 182.5 343.8 250.6 343.6 328.3L343.6 328.3 343.6 328.3C343.7 351.8 350 376.5 359.9 398.9 367.1 415 376 429.9 386.9 441.7 322.3 463.8 246.8 500.1 208.6 571.8L206.5 575.6 206.5 807.5 785.3 807.5 785.3 575.6 783.2 571.8C745.5 501.2 671.6 464.9 607.7 442.7 638.9 411 648.1 370.1 648.1 328.3L648.1 328.3 648.1 328.3C647.9 250.6 584.5 182.5 495.9 182.5ZM435.4 265.1C439.5 265.2 444 265.3 448.9 265.6 488.4 267.9 501.7 275 511.9 281.8 522.2 288.5 529.4 294.9 556.4 295.7L556.4 295.7 556.4 295.7C577.4 294.9 587.6 291.2 594.8 286.9 597.8 285.2 600.2 283.4 602.8 281.7 609.5 296.1 613.1 311.9 613.1 328.3 613.1 375 605.1 407.8 562.2 434.5L566.4 466.1C575.3 468.8 584.5 471.8 593.9 475 595.2 480.5 596.7 487.6 597.7 495.2 598.8 503.2 599.2 511.5 598.6 517.7 597.9 523.9 596 527.3 595.6 527.6 573.9 549.4 535.2 562.1 496 562.1 456.8 562.1 418.1 549.4 396.4 527.6 396 527.3 394.1 523.9 393.4 517.7 392.8 511.5 393.2 503.2 394.3 495.2 395.3 487.6 396.8 480.4 398.1 475 407.4 471.7 416.5 468.8 425.3 466.1L427.8 432.3C425.8 429.7 423.7 427.9 421.3 426.1 411.7 418.9 400.1 403.1 391.9 384.7 383.7 366.2 378.7 345.2 378.6 328.3 378.7 308.1 384.1 288.7 394.1 272 395.9 271.3 397.8 270.6 399.9 269.9 407.4 267.4 417.6 265.1 435.4 265.1ZM359.7 489.9C359.6 490.2 359.6 490.4 359.6 490.6 358.3 500.3 357.5 510.8 358.6 521.4 359.8 531.9 362.5 543.3 371.6 552.4 402.6 583.4 449.6 597.1 496 597.1 542.4 597.1 589.4 583.4 620.4 552.4 629.5 543.3 632.2 531.9 633.4 521.4 634.5 510.8 633.7 500.3 632.4 490.6 632.4 490.4 632.4 490.2 632.3 490 679.5 510.7 725.1 540.4 750.3 584.6L750.3 772.5 666.5 772.5 666.5 640 631.5 640 631.5 772.5 359.5 772.5 359.5 640 324.5 640 324.5 772.5 241.5 772.5 241.5 584.6C266.7 540.3 312.4 510.6 359.7 489.9Z' fill='%23000000'/%3E%3C/svg%3E"
  }
}

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

export const templates = [userTask, ...allTemplates];
export const stepList = createStepList();
export const selected = writable(null);
export const modeler = writable(null);

export const ejected = writable(false);
export const ejectedXML = writable(null);

export const stage = writable('dashboard');
