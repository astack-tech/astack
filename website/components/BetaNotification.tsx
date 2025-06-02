'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Release {
  tag_name: string;
  html_url: string;
  name: string;
  prerelease: boolean;
  published_at: string;
}

export default function BetaNotification() {
  const [release, setRelease] = useState<Release | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchReleaseInfo() {
      try {
        // 首先尝试获取最新的非预发布版本
        let response = await fetch('https://api.github.com/repos/astack-tech/astack/releases/latest');
        
        // 如果找不到最新的非预发布版本(404)，尝试获取所有版本
        if (response.status === 404) {
          console.log('No non-prerelease version found, fetching all releases');
          response = await fetch('https://api.github.com/repos/astack-tech/astack/releases');
          
          if (response.ok) {
            const allReleases = await response.json();
            // 如果有任何版本，使用第一个（最新的）
            if (allReleases && allReleases.length > 0) {
              setRelease(allReleases[0]);
            } else {
              setError(true);
            }
          } else {
            setError(true);
          }
        } else if (response.ok) {
          // 成功获取到最新的非预发布版本
          const data = await response.json();
          setRelease(data);
        } else {
          // 其他错误情况
          console.error('Failed to fetch release info:', response.status);
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch release info:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchReleaseInfo();
  }, []);

  // 如果还在加载或出现错误，使用默认值
  const version = release?.tag_name || 'v0.1.1-beta.0';
  const releaseUrl = release?.html_url || 'https://github.com/astack-tech/astack/releases/latest';
  const isPrerelease = release?.prerelease ?? true;
  
  // 格式化日期 (如果有)
  const formattedDate = release?.published_at 
    ? new Date(release.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : '';

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 py-3 shadow-lg shadow-blue-500/20 relative overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0 bg-grid-white/[0.1] bg-[length:20px_20px]"></div>
      <div className="absolute -top-8 left-1/3 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-8 right-1/4 w-32 h-32 bg-indigo-400/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between text-center sm:text-left">
          <div className="flex items-center flex-wrap justify-center sm:justify-start">
            <div className="flex items-center mr-3">
              <span className="animate-pulse bg-yellow-400 h-2 w-2 rounded-full mr-1"></span>
              <span className="font-bold text-white">
                {isPrerelease ? 'BETA RELEASE' : 'RELEASE'}
              </span>
              {formattedDate && (
                <span className="ml-2 text-xs text-white/70">{formattedDate}</span>
              )}
            </div>
            <p className="text-sm text-white">
              <span className="font-semibold">
                🎉 AStack {version} is now available!
              </span>
              {' '}Try it today with {' '}
              <code className="bg-white/20 border border-white/30 px-2 py-0.5 rounded text-xs font-mono">
                npm install @astack-tech/core
              </code>
            </p>
          </div>
          <Link 
            href={releaseUrl}
            target="_blank"
            rel="noopener noreferrer" 
            className="mt-3 sm:mt-0 text-xs bg-white/20 hover:bg-white/30 text-white font-medium px-3 py-1.5 rounded-full transition flex items-center group"
          >
            Release notes
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-0.5 transition-transform">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
