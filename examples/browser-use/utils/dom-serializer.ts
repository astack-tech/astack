import * as cheerio from 'cheerio';

/**
 * 将 HTML DOM 结构序列化为简化的文本表示
 * 用于给大模型提供 DOM 结构信息，但过滤不必要的细节
 */
export function serializeDom(html: string): string {
  const $ = cheerio.load(html);

  // 移除所有 script 和 style 标签
  $("script, style, link[rel='stylesheet'], noscript").remove();

  // 处理 body 元素及其所有子元素
  const body = $('body');
  const domStructure = serializeElement(body, $, 0);

  return domStructure;
}

/**
 * 递归序列化 DOM 元素及其子元素
 */
function serializeElement<T>(
  element: cheerio.Cheerio<T>,
  $: cheerio.CheerioAPI,
  depth: number
): string {
  const maxDepth = 15; // 限制 DOM 序列化深度
  if (depth > maxDepth) return '';

  const indent = '  '.repeat(depth);
  let output = '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  element.each((_: number, el: any) => {
    const $el = $(el);

    // 获取元素名称
    const tagName = el.name?.toLowerCase();
    if (!tagName || tagName === 'html' || tagName === 'head') return;

    // 获取重要属性
    const id = $el.attr('id') ? ` id="${$el.attr('id')}"` : '';
    const className = $el.attr('class') ? ` class="${$el.attr('class')}"` : '';
    const href = $el.attr('href') ? ` href="${$el.attr('href')}"` : '';
    const src = $el.attr('src') ? ` src="${$el.attr('src')}"` : '';
    const type = $el.attr('type') ? ` type="${$el.attr('type')}"` : '';
    const name = $el.attr('name') ? ` name="${$el.attr('name')}"` : '';
    const role = $el.attr('role') ? ` role="${$el.attr('role')}"` : '';

    // 获取元素的文本内容（清理并截断）
    let text = $el.clone().children().remove().end().text().trim();
    if (text.length > 80) {
      text = text.substring(0, 80) + '...';
    }

    // 构建元素描述
    let elementInfo = `${indent}<${tagName}${id}${className}${href}${src}${type}${name}${role}`;

    // 添加文本内容（如果有）
    if (text) {
      elementInfo += `> ${text.replace(/\s+/g, ' ')}</${tagName}>`;
      output += elementInfo + '\n';
    } else {
      // 递归处理子元素
      const children = $el.children();
      if (children.length > 0) {
        elementInfo += '>\n';
        output += elementInfo;

        // 限制子元素数量，避免过大的输出
        const maxChildren = 50;
        children.each((i, child) => {
          if (i < maxChildren) {
            output += serializeElement($(child), $, depth + 1);
          } else if (i === maxChildren) {
            output += `${indent}  ... (${children.length - maxChildren} more elements)\n`;
            return false; // 中断 each 循环
          }
        });

        output += `${indent}</${tagName}>\n`;
      } else {
        elementInfo += ' />\n';
        output += elementInfo;
      }
    }
  });

  return output;
}
