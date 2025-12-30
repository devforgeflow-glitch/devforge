'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

/**
 * Contexto de Autenticacao
 *
 * Gerencia estado de autenticacao do usuario usando Firebase Auth.
 * Suporta login com email/senha, cadastro, logout e recuperacao de senha.
 * Inclui modo de demonstracao quando Firebase nao configurado.
 *
 * Para criar usuarios de teste, execute: npx ts-node scripts/createTestAdmin.ts
 *
 * @version 1.1.0
 */

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  role?: 'user' | 'admin';
}

const AUTH_STORAGE_KEY = 'devforge_auth_user';
const DEMO_USERS_KEY = 'devforge_demo_users';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Converte FirebaseUser para nosso tipo User
 */
function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
  };
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Observar mudancas no estado de autenticacao
  useEffect(() => {
    // Se Firebase nao esta configurado, verificar localStorage para modo demo
    if (!isFirebaseConfigured || !auth) {
      // Verificar se ha usuario salvo no localStorage
      if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(mapFirebaseUser(firebaseUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Login com email e senha
   * Suporta modo demo com usuarios de teste quando Firebase nao configurado
   * Usuarios de teste sao criados via script: npx ts-node scripts/createTestAdmin.ts
   */
  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    // Modo demo: usar usuarios de teste do localStorage
    if (!isFirebaseConfigured || !auth) {
      try {
        // Simular delay de rede
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Buscar usuarios de teste do localStorage (criados via script)
        const demoUsersStr = localStorage.getItem(DEMO_USERS_KEY);
        if (!demoUsersStr) {
          throw new Error('Nenhum usuario de teste configurado. Execute: npm run seed:demo');
        }

        const demoUsers = JSON.parse(demoUsersStr) as Record<string, { password: string; user: User }>;
        const testUser = demoUsers[email.toLowerCase()];

        if (testUser && testUser.password === password) {
          setUser(testUser.user);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(testUser.user));
          return;
        }

        throw new Error('Credenciais invalidas');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro de autenticacao';
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    }

    // Firebase configurado: usar autenticacao real
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cadastro com email e senha
   */
  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      if (!auth) {
        setError('Firebase nao configurado');
        throw new Error('Firebase nao configurado');
      }
      setError(null);
      setLoading(true);
      try {
        const { user: newUser } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(newUser, { displayName: name });
        setUser(mapFirebaseUser(newUser));
      } catch (err) {
        const message = getAuthErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Logout
   */
  const signOut = useCallback(async () => {
    setError(null);

    // Modo demo: apenas limpar estado e localStorage
    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    // Firebase configurado: fazer logout real
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  }, []);

  /**
   * Recuperacao de senha
   */
  const resetPassword = useCallback(async (email: string) => {
    if (!auth) {
      setError('Firebase nao configurado');
      throw new Error('Firebase nao configurado');
    }
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  }, []);

  /**
   * Limpar erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    error,
    isConfigured: isFirebaseConfigured,
    signIn,
    signUp,
    signOut,
    resetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar o contexto de autenticacao
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

/**
 * Traduz erros do Firebase para mensagens amigaveis
 */
function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const code = (error as { code?: string }).code;
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Este email ja esta em uso';
      case 'auth/invalid-email':
        return 'Email invalido';
      case 'auth/operation-not-allowed':
        return 'Operacao nao permitida';
      case 'auth/weak-password':
        return 'Senha muito fraca. Use pelo menos 6 caracteres';
      case 'auth/user-disabled':
        return 'Esta conta foi desativada';
      case 'auth/user-not-found':
        return 'Usuario nao encontrado';
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde';
      case 'auth/invalid-credential':
        return 'Credenciais invalidas';
      default:
        return error.message || 'Erro de autenticacao';
    }
  }
  return 'Erro desconhecido';
}
