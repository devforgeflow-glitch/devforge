/**
 * Cliente API para requisicoes ao backend
 *
 * Inclui:
 * - Refresh token automatico
 * - Type safety com generics
 * - Tratamento centralizado de erros
 *
 * @version 1.0.0
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Obtem access token do localStorage
 */
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

/**
 * Salva access token no localStorage
 */
function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', token);
}

/**
 * Remove access token do localStorage
 */
function clearAccessToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
}

/**
 * Flag para evitar multiplos refreshes simultaneos
 */
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Tenta renovar o access token usando o refresh token (httpOnly cookie)
 */
async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Envia cookies
      });

      if (!response.ok) {
        clearAccessToken();
        return false;
      }

      const data = await response.json();
      if (data.success && data.data?.accessToken) {
        setAccessToken(data.data.accessToken);
        return true;
      }

      return false;
    } catch {
      clearAccessToken();
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Faz requisicao com tratamento de refresh token
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
  skipAuth = false
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Adiciona Authorization se nao for skipAuth
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Sempre incluir cookies
  };

  // Serializa body se necessario
  if (options.body && typeof options.body !== 'string') {
    config.body = JSON.stringify(options.body);
  }

  try {
    let response = await fetch(url, config);

    // Se 401 e nao for skipAuth, tentar refresh
    if (response.status === 401 && !skipAuth) {
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        // Atualiza header com novo token
        const newToken = getAccessToken();
        if (newToken) {
          (headers as Record<string, string>)['Authorization'] =
            `Bearer ${newToken}`;
        }
        config.headers = headers;

        // Repete requisicao
        response = await fetch(url, config);
      } else {
        // Refresh falhou - redirecionar para login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return {
          success: false,
          error: {
            code: 'AUTHENTICATION_ERROR',
            message: 'Sessao expirada. Faca login novamente.',
          },
        };
      }
    }

    const data = await response.json();
    return data as ApiResponse<T>;
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message:
          error instanceof Error
            ? error.message
            : 'Erro de conexao com o servidor',
      },
    };
  }
}

/**
 * Cliente API com metodos HTTP
 */
export const apiClient = {
  /**
   * GET request
   */
  get<T>(endpoint: string, skipAuth = false): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { method: 'GET' }, skipAuth);
  },

  /**
   * POST request
   */
  post<T>(
    endpoint: string,
    body?: unknown,
    skipAuth = false
  ): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { method: 'POST', body }, skipAuth);
  },

  /**
   * PUT request
   */
  put<T>(
    endpoint: string,
    body?: unknown,
    skipAuth = false
  ): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { method: 'PUT', body }, skipAuth);
  },

  /**
   * PATCH request
   */
  patch<T>(
    endpoint: string,
    body?: unknown,
    skipAuth = false
  ): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { method: 'PATCH', body }, skipAuth);
  },

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, skipAuth = false): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { method: 'DELETE' }, skipAuth);
  },

  /**
   * Request generico
   */
  request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return request<T>(endpoint, options);
  },
};

export default apiClient;
