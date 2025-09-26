#!/usr/bin/env node

/**
 * AStack Chat Server - 设置和检查脚本
 * 
 * 此脚本用于检查环境配置和依赖安装
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 AStack Chat Server - 环境检查\n');

// 检查 Node.js 版本
function checkNodeVersion() {
  const version = process.version;
  const majorVersion = parseInt(version.slice(1).split('.')[0]);
  
  console.log(`📋 Node.js 版本: ${version}`);
  
  if (majorVersion < 18) {
    console.error('❌ 错误: 需要 Node.js 18 或更高版本');
    process.exit(1);
  } else {
    console.log('✅ Node.js 版本符合要求');
  }
}

// 检查 pnpm
function checkPnpm() {
  try {
    const { execSync } = require('child_process');
    const version = execSync('pnpm --version', { encoding: 'utf8' }).trim();
    console.log(`📋 PNPM 版本: ${version}`);
    console.log('✅ PNPM 已安装');
  } catch (error) {
    console.error('❌ 错误: 未找到 pnpm，请先安装 pnpm');
    console.log('💡 安装命令: npm install -g pnpm');
    process.exit(1);
  }
}

// 检查环境变量文件
function checkEnvFile() {
  const envPath = path.join(__dirname, '../backend/.env');
  const envExamplePath = path.join(__dirname, '../backend/.env.example');
  
  console.log('\n📋 检查环境配置文件:');
  
  if (fs.existsSync(envPath)) {
    console.log('✅ 找到 backend/.env 文件');
    
    // 检查必要的环境变量
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasDeepseekKey = envContent.includes('DEEPSEEK_API_KEY=') && 
                          !envContent.includes('DEEPSEEK_API_KEY=your_deepseek_api_key_here');
    const hasOpenAIKey = envContent.includes('OPENAI_API_KEY=') && 
                        !envContent.includes('OPENAI_API_KEY=your_openai_api_key_here');
    
    if (hasDeepseekKey || hasOpenAIKey) {
      console.log('✅ 发现有效的 API Key 配置');
    } else {
      console.log('⚠️  警告: 未发现有效的 API Key 配置');
      console.log('💡 请在 backend/.env 中设置 DEEPSEEK_API_KEY 或 OPENAI_API_KEY');
    }
  } else {
    console.log('⚠️  未找到 backend/.env 文件');
    if (fs.existsSync(envExamplePath)) {
      console.log('💡 请复制 backend/.env.example 为 backend/.env 并填入你的 API Key');
      console.log('   cp backend/.env.example backend/.env');
    }
  }
}

// 检查依赖安装
function checkDependencies() {
  console.log('\n📋 检查依赖安装:');
  
  const nodeModulesExists = fs.existsSync(path.join(__dirname, '../node_modules'));
  const backendNodeModulesExists = fs.existsSync(path.join(__dirname, '../backend/node_modules'));
  const frontendNodeModulesExists = fs.existsSync(path.join(__dirname, '../frontend/node_modules'));
  
  if (nodeModulesExists && backendNodeModulesExists && frontendNodeModulesExists) {
    console.log('✅ 所有依赖已安装');
  } else {
    console.log('⚠️  部分依赖未安装，请运行: pnpm install');
  }
}

// 显示启动指令
function showStartupInstructions() {
  console.log('\n🎯 启动指令:');
  console.log('   开发环境: pnpm dev');
  console.log('   生产环境: pnpm build && pnpm start');
  console.log('   只启动后端: pnpm -C backend dev');
  console.log('   只启动前端: pnpm -C frontend dev');
  
  console.log('\n🌐 服务地址:');
  console.log('   前端界面: http://localhost:3000');
  console.log('   后端API: http://localhost:8080');
  console.log('   健康检查: http://localhost:8080/api/health');
}

// 主函数
function main() {
  try {
    checkNodeVersion();
    checkPnpm();
    checkEnvFile();
    checkDependencies();
    showStartupInstructions();
    
    console.log('\n✨ 环境检查完成！');
  } catch (error) {
    console.error('❌ 检查过程中发生错误:', error.message);
    process.exit(1);
  }
}

main();