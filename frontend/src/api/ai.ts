import { apiClient } from '@/lib/apiClient';

export interface AgentVote {
  agent: string;
  reason: string;
  confidence: number;
}

export interface AIExplanation {
  summary: string;
  supporting_agents: AgentVote[];
  opposing_agents: AgentVote[];
  key_evidence: string[];
  key_weaknesses: string[];
  recommendation: string;
}

export interface AIDecision {
  action: 'BUY' | 'SELL' | 'WAIT';
  confidence: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  explanation: AIExplanation;
  disclaimer: string;
}

export interface AIHistoryItem {
  id: string;
  symbol: string;
  action: string;
  confidence: number;
  risk: string;
  evidence: string[];
  weakness: string[];
  created_at: string;
}

export const aiApi = {
  analyze: (symbol: string) =>
    apiClient.post<AIDecision>(`/ai/analyze/${symbol}`, {}),

  getReport: (symbol: string) =>
    apiClient.get<AIDecision>(`/ai/report/${symbol}`),

  getHistory: (limit: number = 20) =>
    apiClient.get<AIHistoryItem[]>(`/ai/history?limit=${limit}`),
};
