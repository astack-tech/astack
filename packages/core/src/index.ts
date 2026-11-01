/**
 * The AStack runtime: {@link Component} and {@link Pipeline}.
 *
 * A component reads from input ports and writes to output ports. A pipeline connects the
 * ports of several components into a graph and runs data from a trigger port to an endpoint.
 *
 * @packageDocumentation
 */

export { default as Pipeline } from './pipeline';
export type { RunOptions } from './pipeline';
export { default as Component, type Port } from './component';
