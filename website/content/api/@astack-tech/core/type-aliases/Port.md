# Type Alias: Port

```ts
type Port = (portName) => object;
```

Defined in: [packages/core/src/component/index.ts:21](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L21)

Port accessor passed to `Component._transform()` as `$i` and `$o`. Call it with a port
name to read from an input port (`receive`) or write to an output port (`send`).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `portName` | `string` |

## Returns

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `$` | `Observable`\<`unknown`\> | The port's messages as a read-only RxJS stream. | [packages/core/src/component/index.ts:39](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L39) |
| `receive()` | (`callback`) => `Subscription` | Subscribes `callback` to every message the port delivers. Ports are wired at run time, so a message is `unknown` until the callback narrows it. A callback that throws sends the error on the component's error port and the port keeps delivering. A callback that returns a promise works on the message until the promise settles. | [packages/core/src/component/index.ts:30](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L30) |
| `send()` | (`data`) => `void` | Sends `data` on the port. | [packages/core/src/component/index.ts:35](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L35) |

## Example

```typescript
// Receive from an input port. Messages are `unknown`: narrow them first.
$i('in').receive(data => {
  if (typeof data === 'string') {
    $o('out').send(data.toUpperCase());
  }
});

// Read the port's stream with RxJS
const stream = $i('in').$;
```
