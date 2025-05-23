import { Component } from '@astack/core';

/**
 * 数据中继组件
 * 
 * 用于解决组件间数据流动问题，确保数据能正确传递
 * 
 * 输入:
 *   - dataIn: 任何类型的输入数据
 * 
 * 输出:
 *   - dataOut: 原样传递的输出数据
 */
class DataRelayComponent extends Component {
  constructor() {
    super({});
    
    // 定义输入输出端口
    Component.Port.I('dataIn').attach(this);
    Component.Port.O('dataOut').attach(this);
  }
  
  /**
   * 组件在流水线中运行的方法
   * @param $i 输入端口
   * @param $o 输出端口
   */
  _transform($i: any, $o: any) {
    console.log('[DataRelay] 初始化数据中继组件');
    
    // 监听输入，直接转发到输出
    $i('dataIn').receive((data: any) => {
      console.log(`[DataRelay] 接收到数据: 类型=${typeof data}, 是否数组=${Array.isArray(data)}, 长度=${Array.isArray(data) ? data.length : 'N/A'}`);
      
      // 打印详细信息以帮助调试
      if (Array.isArray(data) && data.length > 0) {
        if (typeof data[0] === 'object' && data[0].title && data[0].url) {
          console.log('[DataRelay] 接收到搜索结果数据，样本: ');
          for (let i = 0; i < Math.min(3, data.length); i++) {
            console.log(`- 结果 ${i+1}: 标题="${data[i].title}", URL=${data[i].url}`);
          }
        }
      }
      
      // 转发数据
      console.log('[DataRelay] 转发数据到 dataOut 端口 ...');
      $o('dataOut').send(data);
      console.log('[DataRelay] 数据转发完成');
    });
    
    console.log('[DataRelay] 设置完成');
  }
  
  /**
   * 组件独立运行
   * @param data 输入数据
   * @returns 原样返回的数据
   */
  run(data: any): any {
    return data;
  }
}

export default DataRelayComponent;
