/**
 * DOM Annotator 测试脚本
 * 这个脚本直接使用 Playwright 加载测试页面并测试 DOM 标注工具
 */

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { annotateInteractiveElements, removeAnnotations } from './utils/dom-annotator';

async function main() {
  console.log('🚀 启动浏览器测试 DOM 标注工具...');

  // 启动浏览器
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 获取测试 HTML 文件的绝对路径
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const testPagePath = path.join(__dirname, 'test-dom-annotator.html');
    const testPageUrl = `file://${testPagePath}`;

    console.log(`📄 加载测试页面: ${testPageUrl}`);
    await page.goto(testPageUrl);

    // 等待页面加载
    await page.waitForSelector('h1');
    console.log('✓ 测试页面已加载');

    // 截图 - 标注前
    await page.screenshot({ path: 'before-annotation.png' });
    console.log('📸 已保存标注前的截图');

    // 测试 DOM 标注工具
    console.log('🔍 测试 DOM 标注工具...');
    try {
      const elements = await annotateInteractiveElements(page);
      console.log(`✓ 成功！找到 ${elements.length} 个交互元素:`);

      // 显示找到的元素
      elements.forEach(el => {
        console.log(
          `- ${el.id}: ${el.tagName} (${el.interactionType.join(', ')}) XPath: ${el.xpath}`
        );
      });

      // 截图 - 标注后
      await page.screenshot({ path: 'after-annotation.png' });
      console.log('📸 已保存标注后的截图');

      // 等待几秒查看结果
      await new Promise(r => setTimeout(r, 5000));

      // 测试移除标注
      console.log('🧹 测试移除标注...');
      await removeAnnotations(page);
      console.log('✓ 已移除标注');

      // 截图 - 移除后
      await page.screenshot({ path: 'after-removal.png' });
      console.log('📸 已保存移除标注后的截图');
    } catch (error) {
      console.error('❌ DOM 标注工具执行失败:');
      console.error(error);
    }

    // 等待用户查看结果
    console.log('👀 标注测试已完成，等待 10 秒后关闭浏览器...');
    await new Promise(r => setTimeout(r, 10000));
  } catch (error) {
    console.error('❌ 测试过程中出现错误:');
    console.error(error);
  } finally {
    // 关闭浏览器
    await browser.close();
    console.log('👋 测试完成，浏览器已关闭');
  }
}

// 执行测试
main().catch(console.error);
