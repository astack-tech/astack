# Type Alias: Port

```ts
type Port = (portName) => object;
```

Defined in: [packages/core/src/component/index.ts:22](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L22)

Port accessor passed to `Component._transform()` as `$i` and `$o`. Call it with a port
name to read from an input port (`receive`) or write to an output port (`send`).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `portName` | `string` |

## Returns

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `$` | `Subject`\<`unknown`\> | Access raw RxJS Subject | [packages/core/src/component/index.ts:38](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L38) |
| `receive()` | \<`T`\>(`callback`) => `Subscription` | Receive data from port | [packages/core/src/component/index.ts:29](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L29) |
| `send()` | (`data`) => `void` | Send data to port | [packages/core/src/component/index.ts:34](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L34) |

## Example

```typescript
// Get input port and receive data
$i('in').receive((data: { text: string }) => {
  console.log(data.text);
});

// Get output port and send data
$o('out').send({ result: 'processed' });

// Access raw RxJS Subject
const subject = $i('in').$;
```
