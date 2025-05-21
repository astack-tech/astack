// @ts-ignore
import { type Node, Flow } from '@hlang-org/runtime';

import BaseProducer from './internal-components/base/Producer';
import BaseConsumer from './internal-components/base/Consumer';

import { START_COMPONENT_NAME, END_COMPONENT_NAME } from './constants';

class Pipeline {
  // components
  private components: Map<string, Node> = new Map();
  private connectPairs: Array<Array<string>> = [];

  // running trigger
  private runningTrigger: Set<string> = new Set();

  constructor() { }

  /**
   * Get source port from a component
   * @param name - Source identifier in format 'componentName.portName'
   * @returns Output port of the specified component
   */
  private from(name: string) {
    // Parse component name and port name from the dot notation
    const [componentName, portName] = name.split('.');

    // Retrieve the component by name
    const currentNode = this.components.get(componentName);

    // Ensure component exists
    if (!currentNode) {
      throw new Error(`Source component not found: ${componentName}`);
    }

    // Get output port from the component
    return currentNode.O(portName);
  }

  /**
   * Get destination port from a component
   * @param name - Destination identifier in format 'componentName.portName'
   * @returns Input port of the specified component
   */
  private to(name: string) {
    // Parse component name and port name from the dot notation
    const [componentName, portName] = name.split('.');

    // Retrieve the component by name
    const currentNode = this.components.get(componentName);

    // Ensure component exists
    if (!currentNode) {
      throw new Error(`Destination component not found: ${componentName}`);
    }

    // Get input port from the component
    return currentNode.I(portName);
  }

  /**
   * Add a component to the pipeline
   * @param name - Unique identifier for the component
   * @param instance - Component instance to add
   * @returns void
   */
  addComponent(name: string, instance: Node) {
    // Skip if component with the same name already exists
    if (this.components.get(name)) return;

    // Register the component in the pipeline
    this.components.set(name, instance);
  }

  getComponent(name: string): Node | undefined {
    return this.components.get(name);
  }

  /**
   * Connect two components in the pipeline
   * @param sourceName - Source identifier in format 'componentName.portName'
   * @param sinkName - Destination identifier in format 'componentName.portName'
   * @returns void
   */
  connect(sourceName: string, sinkName: string) {
    // Connect output port of source to input port of sink
    this.from(sourceName).connect(this.to(sinkName));

    // Record the connection for later use in determining pipeline endpoints
    this.connectPairs.push([sourceName, sinkName]);
  }

  /**
   * Execute the pipeline
   * @param triggerName - Entry point for the pipeline in format 'componentName.portName'
   * @param params - Parameters to pass to the pipeline
   * @param sink - Callback/sink to process the final result
   * @returns void
   */
  private runWithBaseMode(triggerName: string, params: any, sink: unknown) {
    let startComponent: BaseProducer, endComponent: BaseConsumer;

    if (!(this.getComponent(START_COMPONENT_NAME) && this.getComponent(END_COMPONENT_NAME))) {
      // Construct two hidden component
      startComponent = new BaseProducer({});
      endComponent = new BaseConsumer({});

      // Add to components
      this.addComponent(START_COMPONENT_NAME, startComponent);
      this.addComponent(END_COMPONENT_NAME, endComponent);
    } else {
      // Get start & end component
      startComponent = this.getComponent(START_COMPONENT_NAME) as BaseProducer;
      endComponent = this.getComponent(END_COMPONENT_NAME) as BaseConsumer;
    }

    // Create a flow instance to manage the execution
    const pipeline = new Flow({});

    if (!this.runningTrigger.has(triggerName)) {
      // Validate the trigger name format
      if (!triggerName || !triggerName.includes('.')) {
        throw new Error(`Invalid trigger name: ${triggerName}. Format should be 'componentName.portName'`);
      }

      // We need to determine the final sink dynamically
      let lastComponentName: string;

      // Check if we have explicit connections defined
      const lastPair = this.connectPairs[this.connectPairs.length - 1];

      if (lastPair) {
        // If connections exist, use the last sink as the endpoint
        // This is the standard case for multi-component pipelines
        lastComponentName = lastPair[1].split('.')[0];
      } else {
        // Smart fallback: If no connections were defined (single component case),
        // infer the output port from the component itself
        lastComponentName = triggerName.split('.')[0];
      }

      const lastComponent = this.components.get(lastComponentName);

      if (!lastComponent) {
        throw new Error(`Last component not found: ${lastComponentName}`);
      }

      // Access the standard output port of the component (defined in our Component base class)
      // @ts-ignore - Accessing a property that might not exist on all Node types
      const endSinkName = `${lastComponentName}.${lastComponent?.outPort?.name}`;

      // Connect the internal start component to the user-specified entry point
      this.connect(`${START_COMPONENT_NAME}.out`, triggerName);

      // Connect the endpoint to our internal end component
      this.connect(endSinkName, `${END_COMPONENT_NAME}.in`);

      // Set flag
      this.runningTrigger.add(triggerName);
    }

    // Initialize the flow with our start component
    pipeline.run(startComponent);

    // Set up the sink to handle the final output
    endComponent.consume(sink);

    // Inject the input parameters to start the pipeline
    startComponent.produce(params);
  }

  /**
   * Execute the pipeline with base mode (default)
   * @param triggerName - Entry point for the pipeline in format 'componentName.portName'
   * @param params - Parameters to pass to the pipeline
   * @returns Promise<T>
   */
  run<T>(triggerName: string, params: any): Promise<T> {
    return new Promise((resolve) => {
      this.runWithBaseMode(triggerName, params, (value: T) => {
        resolve(value);
      })
    })
  }
}

export default Pipeline
