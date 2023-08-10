/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

// import VariableProvider from '@bpmn-io/variable-resolver/lib/VariableProvider';



export default (getSchemaVariables) => {

  class VariableProvider {
    constructor(variableResolver) {
      console.log('register');
      this._variableResolver = variableResolver;
      this.register();
    }

    /**
     * This method should implement the creation of a list of process variables.
     *
     * @param {djs.model.Base} element
     * @return {Array<Variable>} a list of process variables
     *
     * The following example contains one variable
     *
     * @example
     * VariableProvider.getVariables = function(element) {
     *   const variables = [
     *     {
     *       name: 'myVariable',
     *       type: 'String',
     *       info: 'This is a global variable'
     *     }
     *   ];
     *
     *   if (is(element, 'bpmn:Process')) {
     *     return variables;
     *   }
     * }
     */
    getVariables(element) { }

    register() {
      this._variableResolver.registerProvider(this);
    }
  }

  VariableProvider.$inject = ['variableResolver'];

  class MyCustomProvider extends VariableProvider {
    getVariables(element) {
      console.log('getVariables', element);
      const extensionElements = element.get('extensionElements');
      const values = extensionElements && extensionElements.get('values');

      if (!values) {
        return;
      }

      const form = values.find(value => value.$type === 'zeebe:FormDefinition');

      if (!form) {
        return;
      }

      const formKey = form.formKey;
      const parent = element.$parent;
      const formDefinition = parent.get('extensionElements').get('values').find(
        value => value.$type === 'zeebe:UserTaskForm' && value.id === formKey.replace('camunda-forms:bpmn:', '')
      );

      const body = formDefinition.body;

      const variables = getSchemaVariables(JSON.parse(body));
      return variables.map(name => {
        return { name, info: 'Imported from form' };
      });
    }
  }


  return {
    __init__: [
      'myCustomProvider',
    ],
    myCustomProvider: ['type', MyCustomProvider],
  }
};

