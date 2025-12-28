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
 *
 * @version 1.0.0
 */

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

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
    // Se Firebase nao esta configurado, nao observar
    if (!isFirebaseConfigured || !auth) {
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
   */
  const signIn = useCallback(async (email: string, password: string) => {
    if (!auth) {
      setError('Firebase nao configurado');
      throw new Error('Firebase nao configurado');
    }
    setError(null);
    setLoading(true);
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
    if (!auth) {
      setError('Firebase nao configurado');
      throw new Error('Firebase nao configurado');
    }
    setError(null);
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
