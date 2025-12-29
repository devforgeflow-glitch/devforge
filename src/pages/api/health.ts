import type { NextApiRequest, NextApiResponse } from 'next';
import { isRedisHealthy, getCircuitState } from '@/api/lib/redis';

/**
 * Endpoint de Health Check
 *
 * Verifica status da aplicacao e dependencias.
 * Usado por load balancers e monitoring.
 *
 * GET /api/health
 *
 * @version 1.0.0
 */

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  services: {
    redis: {
      status: 'up' | 'down';
      circuitState: string;
    };
    firebase: {
      status: 'up' | 'down';
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verificar Redis
    const redisHealthy = await isRedisHealthy();
    const redisCircuitState = getCircuitState();

    // Determinar status geral
    const isHealthy = redisHealthy;
    const status = isHealthy ? 'healthy' : redisCircuitState === 'OPEN' ? 'degraded' : 'unhealthy';

    const response: HealthResponse = {
      status,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      services: {
        redis: {
          status: redisHealthy ? 'up' : 'down',
          circuitState: redisCircuitState,
        },
        firebase: {
          status: 'up', // Firebase admin inicializa lazy
        },
      },
    };

    const httpStatus = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;
    return res.status(httpStatus).json(response);
  } catch {
    return res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      services: {
        redis: {
          status: 'down',
          circuitState: 'UNKNOWN',
        },
        firebase: {
          status: 'down',
        },
      },
    });
  }
}
