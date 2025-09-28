import { Calculator, ChevronRight } from 'lucide-react';

interface CalculatorCardProps {
  expression: string;
  result: string | number;
  steps?: string[];
}

export function CalculatorCard({ expression, result, steps }: CalculatorCardProps) {
  return (
    <div className="not-prose my-4 overflow-hidden rounded-lg border border-neutral-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-neutral-100 bg-neutral-50 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-100">
          <Calculator className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <h3 className="font-medium text-neutral-900">数学计算</h3>
          <p className="text-sm text-neutral-500">Mathematical Computation</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Expression */}
        <div className="mb-4">
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
            表达式
          </label>
          <div className="mt-1 rounded-md bg-neutral-50 px-3 py-2 font-mono text-sm">
            {expression}
          </div>
        </div>

        {/* Result */}
        <div className="mb-4">
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
            结果
          </label>
          <div className="mt-1 flex items-center gap-2">
            <div className="rounded-md bg-green-50 px-3 py-2 font-mono text-lg font-semibold text-green-700">
              {result}
            </div>
          </div>
        </div>

        {/* Steps (if provided) */}
        {steps && steps.length > 0 && (
          <div>
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              计算步骤
            </label>
            <div className="mt-2 space-y-2">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <ChevronRight className="h-3 w-3 text-neutral-400" />
                  <span className="font-mono">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
