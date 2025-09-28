import { Brain, Zap, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface AgentStep {
  type: 'thinking' | 'tool_call' | 'result';
  title: string;
  content?: string;
  status?: 'running' | 'completed' | 'error';
  timestamp?: string;
}

interface AgentCardProps {
  agentName?: string;
  status: 'running' | 'completed' | 'error';
  steps: AgentStep[];
  finalResult?: string;
}

export function AgentCard({ agentName = 'AI Agent', status, steps, finalResult }: AgentCardProps) {
  const getStatusIcon = (stepStatus: string) => {
    switch (stepStatus) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-orange-500 animate-pulse" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-orange-100 text-orange-700';
    }
  };

  return (
    <div className="not-prose my-4 overflow-hidden rounded-lg border border-neutral-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-100">
            <Brain className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-neutral-900">{agentName}</h3>
            <p className="text-sm text-neutral-500">AI Agent Execution</p>
          </div>
        </div>
        
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(status)}`}>
          {status === 'running' ? '执行中' : status === 'completed' ? '已完成' : '错误'}
        </span>
      </div>

      {/* Steps */}
      <div className="p-4">
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-1">
                {getStatusIcon(step.status || 'running')}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-neutral-900">{step.title}</h4>
                  {step.type === 'tool_call' && (
                    <Zap className="h-3 w-3 text-amber-500" />
                  )}
                </div>
                
                {step.content && (
                  <div className="mt-1">
                    {step.type === 'thinking' ? (
                      <p className="text-sm text-neutral-600 italic">{step.content}</p>
                    ) : (
                      <div className="rounded-md bg-neutral-50 p-2 text-sm font-mono">
                        {step.content}
                      </div>
                    )}
                  </div>
                )}
                
                {step.timestamp && (
                  <p className="mt-1 text-xs text-neutral-400">{step.timestamp}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Final Result */}
        {finalResult && status === 'completed' && (
          <div className="mt-4 border-t border-neutral-100 pt-4">
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">最终结果</label>
            <div className="mt-2 rounded-md bg-green-50 p-3 text-sm leading-relaxed">
              {finalResult}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}