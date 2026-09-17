import { apiClient } from '@/lib/apiClient';

export interface RiskRequest {
  capital: number;
  entry: number;
  stop_loss: number;
  risk_percent: number;
  target_price?: number;
}

export interface RiskResponse {
  position_size: number;
  max_loss: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  risk_reward: number | null;
  decision: 'ALLOW' | 'ALLOW_WITH_REDUCED_SIZE' | 'WAIT';
  reason: string;
}

export interface RiskScore {
  score: number;
  level: 'Safe' | 'Moderate' | 'Danger' | 'Stop Trading';
}

export const riskApi = {
  calculate: (data: RiskRequest) =>
    apiClient.post<RiskResponse>('/risk/calculate', data),

  getScore: () =>
    apiClient.get<RiskScore>('/risk/score'),
};
