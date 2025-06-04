/**
 * DOM 元素标注和分析工具
 * 用于在页面中注入脚本，标注可交互元素并返回结构化数据
 */

import { Page } from 'playwright';

// 可交互元素的类型
export interface InteractiveElement {
  id: string; // 生成的唯一 ID
  tagName: string; // 元素标签名
  type: string; // 元素类型
  text: string; // 元素文本内容
  placeholder?: string; // 占位符文本
  value?: string; // 元素值
  name?: string; // name 属性
  role?: string; // ARIA 角色
  visible: boolean; // 元素是否可见
  enabled: boolean; // 元素是否启用
  rect: {
    // 元素位置和尺寸
    x: number;
    y: number;
    width: number;
    height: number;
  };
  xpath: string; // XPath 路径
  cssSelector: string; // CSS 选择器
  attributes: Record<string, string>; // 元素所有属性
  interactionType: string[]; // 交互类型：click, type, select, etc.
}

/**
 * 在页面中注入脚本，标注可交互元素并返回结构化数据
 */
export async function annotateInteractiveElements(page: Page): Promise<InteractiveElement[]> {
  const scriptContent = `
    (function() {
      // 用于生成唯一 ID
      var idCounter = 0;

      // 要标注的交互元素类型
      var INTERACTIVE_SELECTORS = [
        'a',
        'button',
        'input',
        'select',
        'textarea',
        '[role="button"]',
        '[role="link"]',
        '[role="checkbox"]',
        '[role="radio"]',
        '[role="tab"]',
        '[role="menuitem"]',
        '[role="option"]',
        '[role="switch"]',
        '[tabindex]:not([tabindex="-1"])',
        '[onclick]',
        '[onchange]',
        '[onsubmit]',
      ];

      // 标注样式
      var styles = {
        border: '2px solid #2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        color: '#0D47A1',
        fontSize: '11px',
        padding: '2px 4px',
        position: 'absolute',
        zIndex: '9999',
        pointerEvents: 'none',
        fontFamily: 'Arial, sans-serif',
      };

      // 清除之前的标注
      var existingAnnotations = document.querySelectorAll('.astack-element-annotation');
      existingAnnotations.forEach(function(el) {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });

      // 获取元素的 XPath
      var getXPath = function(element) {
        if (!element) return '';
        if (element === document.body) return '/html/body';

        var ix = 0;
        var siblings = [];
        if (element.parentElement && element.parentElement.children) {
          siblings = Array.from(element.parentElement.children);
        }

        for (var i = 0; i < siblings.length; i++) {
          var sibling = siblings[i];
          if (sibling === element) {
            var tagName = element.tagName.toLowerCase();
            var pathIndex = ix > 0 ? '[' + (ix + 1) + ']' : '';
            var parentPath = '';
            if (element.parentElement) {
              parentPath = getXPath(element.parentElement);
            }
            return parentPath + '/' + tagName + pathIndex;
          }

          if (sibling.tagName.toLowerCase() === element.tagName.toLowerCase()) {
            ix++;
          }
        }

        return '';
      };

      // 获取元素的 CSS 选择器
      var getCssSelector = function(element) {
        // 基础实现 - 可以根据需要改进
        if (element.id) {
          return '#' + CSS.escape(element.id);
        }

        if (element.classList && element.classList.length) {
          var classes = Array.from(element.classList)
            .map(function(c) { return '.' + CSS.escape(c); })
            .join('');
          return classes;
        }

        var tagName = element.tagName.toLowerCase();
        var selector = tagName;

        if (element.parentElement) {
          var siblings = Array.from(element.parentElement.children).filter(function(el) {
            return el.tagName.toLowerCase() === tagName;
          });

          if (siblings.length > 1) {
            var index = siblings.indexOf(element);
            selector += ':nth-child(' + (index + 1) + ')';
          }
        }

        return selector;
      };

      // 判断元素是否可见
      var isVisible = function(element) {
        var style = window.getComputedStyle(element);

        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          element.offsetWidth > 0 &&
          element.offsetHeight > 0
        );
      };

      // 判断元素是否启用
      var isEnabled = function(element) {
        return !element.hasAttribute('disabled');
      };

      // 获取元素的交互类型
      var getInteractionTypes = function(element) {
        var types = [];
        var tagName = element.tagName.toLowerCase();
        var typeAttr = element.getAttribute('type');
        var type = typeAttr ? typeAttr.toLowerCase() : null;
        var roleAttr = element.getAttribute('role');
        var role = roleAttr ? roleAttr.toLowerCase() : null;
        var hasClickHandler = element.hasAttribute('onclick');
        var hasChangeHandler = element.hasAttribute('onchange');

        // 基本交互元素
        if (tagName === 'a' || tagName === 'button' || role === 'button' || role === 'link' || hasClickHandler) {
          types.push('click');
        }

        if (tagName === 'input' && (type === 'text' || type === 'password' || type === 'email' || type === 'tel' || type === 'url' || type === 'search' || type === 'number')) {
          types.push('type');
        }

        if (tagName === 'textarea') {
          types.push('type');
        }

        if (tagName === 'select' || role === 'listbox' || hasChangeHandler) {
          types.push('select');
        }

        if (tagName === 'input' && (type === 'checkbox' || type === 'radio')) {
          types.push('toggle');
        }

        return types;
      };

      // 创建标注
      var createAnnotation = function(element, index) {
        var rect = element.getBoundingClientRect();

        var annotationEl = document.createElement('div');
        annotationEl.className = 'astack-element-annotation';
        annotationEl.textContent = index + ': ' + element.tagName.toLowerCase();

        // 应用标注样式
        Object.entries(styles).forEach(function(entry) {
          var key = entry[0];
          var value = entry[1];
          annotationEl.style[key] = value;
        });

        // 定位标注
        annotationEl.style.top = rect.top + window.scrollY + 'px';
        annotationEl.style.left = rect.left + window.scrollX + 'px';

        // 根据元素的交互类型设置不同颜色
        var interactionTypes = getInteractionTypes(element);
        if (interactionTypes.includes('click')) {
          annotationEl.style.borderColor = '#2196F3'; // 蓝色表示可点击
        } else if (interactionTypes.includes('type')) {
          annotationEl.style.borderColor = '#4CAF50'; // 绿色表示可输入
        } else if (interactionTypes.includes('select')) {
          annotationEl.style.borderColor = '#9C27B0'; // 紫色表示可选择
        } else if (interactionTypes.includes('toggle')) {
          annotationEl.style.borderColor = '#FF9800'; // 橙色表示可切换
        }

        document.body.appendChild(annotationEl);
      };

      // 分析交互元素
      var analyzeInteractiveElements = function() {
        // 找出所有可能的交互元素
        var elementSelector = INTERACTIVE_SELECTORS.join(',');
        var elements = Array.from(document.querySelectorAll(elementSelector));

        var interactiveElements = [];

        // 分析每个元素
        elements.forEach(function(element, index) {
          // 只处理可见元素
          if (!isVisible(element)) return;

          // 生成元素的唯一 ID
          var elementId = 'element-' + ++idCounter;

          // 获取元素的属性
          var attrs = {};
          Array.from(element.attributes).forEach(function(attr) {
            attrs[attr.name] = attr.value;
          });

          // 创建元素信息
          var elementInfo = {
            id: elementId,
            tagName: element.tagName.toLowerCase(),
            type: element.getAttribute('type') || '',
            text: (element.textContent ? element.textContent.trim() : '') || '',
            placeholder: element.getAttribute('placeholder') || undefined,
            value: element.value,
            name: element.getAttribute('name') || undefined,
            role: element.getAttribute('role') || undefined,
            visible: isVisible(element),
            enabled: isEnabled(element),
            rect: {
              x: element.getBoundingClientRect().x,
              y: element.getBoundingClientRect().y,
              width: element.getBoundingClientRect().width,
              height: element.getBoundingClientRect().height,
            },
            xpath: getXPath(element),
            cssSelector: getCssSelector(element),
            attributes: attrs,
            interactionType: getInteractionTypes(element),
          };

          // 添加到结果列表
          interactiveElements.push(elementInfo);

          // 创建标注
          createAnnotation(element, index + 1);
        });

        return interactiveElements;
      };

      // 执行分析并返回结果
      return analyzeInteractiveElements();
    })();
  `;

  // 使用字符串语法执行脚本
  return page.evaluate(scriptContent);
}

/**
 * 移除页面中的元素标注
 */
export async function removeAnnotations(page: Page): Promise<void> {
  const cleanupScript = `
    (function() {
      var annotations = document.querySelectorAll('.astack-element-annotation');
      annotations.forEach(function(el) {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    })();
  `;
  await page.evaluate(cleanupScript);
}
