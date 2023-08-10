import {
  getBusinessObject,
  is
} from './modelUtil';

import {
  createElement,
  nextId
} from './ElementUtil.mjs';

import {
  getExtensionElementsList
} from './ExtensionElementUtil.js';

import {
  find,
  isUndefined,
  without
} from 'min-dash';

const USER_TASK_FORM_PREFIX = 'userTaskForm_';

export function FormHelper(bpmnFactory, commandStack) {

  function getFormDefinition(element) {
    const businessObject = getBusinessObject(element);

    const formDefinitions = getExtensionElementsList(businessObject, 'zeebe:FormDefinition');

    return formDefinitions[0];
  }

  function getUserTaskForm(element, parent) {

    const rootElement = parent || getRootElement(element);

    // (1) get form definition from user task
    const formDefinition = getFormDefinition(element);

    if (isUndefined(formDefinition)) {
      return;
    }

    const formKey = formDefinition.get('formKey');

    // (2) retrieve user task form via form key
    const userTaskForm = findUserTaskForm(formKey, rootElement);

    return userTaskForm;
  }

  function ensureTaskForm(element, values) {

    let commands = [];

    const rootElement = getRootElement(element);

    // (1) ensure root element extension elements
    let rootExtensionElements = rootElement.get('extensionElements');
    console.log(rootElement, rootExtensionElements);
    if (!rootExtensionElements) {
      rootExtensionElements = createElement(
        'bpmn:ExtensionElements',
        { values: [] },
        rootElement,
        bpmnFactory
      );

      commands.push(
        UpdateModdlePropertiesCmd(element, rootElement, {
          extensionElements: rootExtensionElements,
        })
      );
    }

    // (2) ensure user task form
    let userTaskForm = getUserTaskForm(element);

    // (2.1) create user task form if doesn't exist
    if (!userTaskForm) {
      userTaskForm = createUserTaskForm(
        values,
        rootExtensionElements,
        bpmnFactory
      );

      commands.push(
        UpdateModdlePropertiesCmd(element, rootExtensionElements, {
          values: [...rootExtensionElements.get('values'), userTaskForm]
        })
      );
    }

    commands.push(UpdateModdlePropertiesCmd(element, userTaskForm, values));

    return commands;
  }

  function ensureFormDefinition(element, customFormKey) {
    const businessObject = getBusinessObject(element);

    let commands = [];

    // (1) ensure extension elements
    let extensionElements = businessObject.get('extensionElements');

    if (isUndefined(extensionElements)) {
      extensionElements = createElement(
        'bpmn:ExtensionElements',
        { values: [] },
        businessObject,
        bpmnFactory
      );

      commands.push(
        UpdateModdlePropertiesCmd(element, businessObject, {
          extensionElements: extensionElements,
        })
      );
    }

    // (2) ensure form definition
    let formDefinition = getFormDefinition(element);

    // (2.1) create if doesn't exist
    if (!formDefinition) {
      let formKey = customFormKey;

      if (isUndefined(formKey)) {
        const formId = createFormId();
        formKey = createFormKey(formId);
      }

      formDefinition = createFormDefinition(
        {
          formKey
        },
        extensionElements,
        bpmnFactory
      );

      commands.push(
        UpdateModdlePropertiesCmd(element, extensionElements, {
          values: [...extensionElements.get('values'), formDefinition]
        })
      );
    }

    // (2.2) update existing form definition with custom key
    else if (customFormKey) {
      commands.push(
        UpdateModdlePropertiesCmd(element, formDefinition, {
          formKey: customFormKey
        })
      );
    }

    return {
      formId: resolveFormId(formDefinition.get('formKey')),
      commands
    };
  }

  function setFormDefinition(element, customFormKey) {

    const {
      commands
    } = ensureFormDefinition(element, customFormKey);

    commandStack.execute('properties-panel.multi-command-executor', commands);
  }

  function setUserTaskForm(element, value) {

    const {
      formId,
      commands: formDefCommands
    } = ensureFormDefinition(element);

    const userTaskCommands = ensureTaskForm(element, { id: formId, body: value });
    const commands = formDefCommands.concat(userTaskCommands);

    commandStack.execute('properties-panel.multi-command-executor', commands);
  }

  function unsetFormDefinition(element) {

    const businessObject = getBusinessObject(element),
      extensionElements = businessObject.get('extensionElements');

    let commands = [];

    const formDefinition = getFormDefinition(element);

    if (!formDefinition) {
      return commands;
    }

    let values = without(extensionElements.get('values'), formDefinition);

    commands.push(
      UpdateModdlePropertiesCmd(element, extensionElements, { values })
    );

    return commands;
  }

  function resetForm(element) {

    const rootElement = getRootElement(element),
      rootExtensionElements = rootElement.get('extensionElements');

    // (1) remove form definition
    const commands = unsetFormDefinition(element);

    // (2) remove referenced user task form
    const userTaskForm = getUserTaskForm(element);

    if (!userTaskForm) {
      commandStack.execute('properties-panel.multi-command-executor', commands);
      return;
    }

    const values = without(rootExtensionElements.get('values'), userTaskForm);

    commands.push(
      UpdateModdlePropertiesCmd(element, rootExtensionElements, { values })
    );

    commandStack.execute('properties-panel.multi-command-executor', commands);

  }

  function createFormKey(formId) {
    return 'camunda-forms:bpmn:' + formId;
  }

  function createFormId() {
    return nextId(USER_TASK_FORM_PREFIX);
  }

  function resolveFormId(formKey) {
    return formKey.split(':')[2];
  }

  function createFormDefinition(properties, extensionElements, bpmnFactory) {
    return createElement(
      'zeebe:FormDefinition',
      properties,
      extensionElements,
      bpmnFactory
    );
  }

  function createUserTaskForm(properties, extensionElements, bpmnFactory) {
    return createElement(
      'zeebe:UserTaskForm',
      properties,
      extensionElements,
      bpmnFactory
    );
  }

  function findUserTaskForm(formKey, rootElement) {
    const forms = getExtensionElementsList(rootElement, 'zeebe:UserTaskForm');

    return find(forms, function (userTaskForm) {
      return createFormKey(userTaskForm.id) === formKey;
    });
  }

  function getRootElement(element) {
    const businessObject = getBusinessObject(element);

    let parent = businessObject;

    while (parent.$parent && !is(parent, 'bpmn:Process')) {
      parent = parent.$parent;
    }

    return parent;
  }

  return {
    getFormDefinition,
    getUserTaskForm,
    setFormDefinition,
    setUserTaskForm,
    resetForm
  };

}

FormHelper.$inject = ['bpmnFactory', 'commandStack'];


// helpers /////////////

function UpdateModdlePropertiesCmd(element, businessObject, newProperties) {
  return {
    cmd: 'element.updateModdleProperties',
    context: {
      element,
      moddleElement: businessObject,
      properties: newProperties
    }
  };
}