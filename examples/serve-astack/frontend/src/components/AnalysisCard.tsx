import { FileText, BarChart3, Hash, Clock } from 'lucide-react';

interface AnalysisCardProps {
  text: string;
  wordCount?: number;
  charCount?: number;
  sentences?: number;
  keywords?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  readingTime?: number;
}

export function AnalysisCard({
  text,
  wordCount,
  charCount,
  sentences,
  keywords,
  sentiment,
  readingTime,
}: AnalysisCardProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-neutral-600 bg-neutral-50';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '积极';
      case 'negative':
        return '消极';
      default:
        return '中性';
    }
  };

  return (
    <div className="not-prose my-4 overflow-hidden rounded-lg border border-neutral-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-neutral-100 bg-neutral-50 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100">
          <FileText className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <h3 className="font-medium text-neutral-900">文本分析</h3>
          <p className="text-sm text-neutral-500">Text Analysis Results</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Source Text */}
        <div className="mb-4">
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
            原文
          </label>
          <div className="mt-1 rounded-md bg-neutral-50 p-3 text-sm leading-relaxed">{text}</div>
        </div>

        {/* Statistics Grid */}
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {wordCount !== undefined && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-neutral-900">
                <Hash className="h-5 w-5 text-neutral-500" />
                {wordCount}
              </div>
              <p className="text-xs text-neutral-500">词数</p>
            </div>
          )}

          {charCount !== undefined && (
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">{charCount}</div>
              <p className="text-xs text-neutral-500">字符数</p>
            </div>
          )}

          {sentences !== undefined && (
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">{sentences}</div>
              <p className="text-xs text-neutral-500">句子数</p>
            </div>
          )}

          {readingTime !== undefined && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-neutral-900">
                <Clock className="h-5 w-5 text-neutral-500" />
                {readingTime}分
              </div>
              <p className="text-xs text-neutral-500">阅读时间</p>
            </div>
          )}
        </div>

        {/* Sentiment Analysis */}
        {sentiment && (
          <div className="mb-4">
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              情感倾向
            </label>
            <div className="mt-2 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-neutral-500" />
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${getSentimentColor(sentiment)}`}
              >
                {getSentimentLabel(sentiment)}
              </span>
            </div>
          </div>
        )}

        {/* Keywords */}
        {keywords && keywords.length > 0 && (
          <div>
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              关键词
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
