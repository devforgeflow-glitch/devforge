/**
 * Script para criar usuarios de demonstracao
 * Arquivo: scripts/seedDemoUsers.js
 *
 * Este script cria usuarios de teste no localStorage para demonstracao
 * quando o Firebase nao esta configurado.
 *
 * IMPORTANTE: Este script deve ser executado no navegador!
 * Copie o conteudo deste script e cole no console do navegador,
 * ou acesse /seed-demo para executar automaticamente.
 *
 * Usuarios criados:
 * - Admin: admin@devforge.com / Admin@123
 * - Usuario: user@devforge.com / User@123
 *
 * @version 1.0.0
 */

(function seedDemoUsers() {
  const DEMO_USERS_KEY = 'devforge_demo_users';

  // Usuarios de demonstracao
  const demoUsers = {
    'admin@devforge.com': {
      password: 'Admin@123',
      user: {
        uid: 'demo-admin-001',
        email: 'admin@devforge.com',
        displayName: 'Admin DevForge',
        photoURL: null,
        emailVerified: true,
        role: 'admin',
      },
    },
    'user@devforge.com': {
      password: 'User@123',
      user: {
        uid: 'demo-user-001',
        email: 'user@devforge.com',
        displayName: 'Usuario Teste',
        photoURL: null,
        emailVerified: true,
        role: 'user',
      },
    },
  };

  // Salvar no localStorage
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(demoUsers));

  console.log('==========================================');
  console.log('✅ Usuarios de demonstracao criados!');
  console.log('==========================================');
  console.log('');
  console.log('📋 CREDENCIAIS DE ACESSO:');
  console.log('');
  console.log('🔐 ADMIN:');
  console.log('   Email: admin@devforge.com');
  console.log('   Senha: Admin@123');
  console.log('');
  console.log('👤 USUARIO:');
  console.log('   Email: user@devforge.com');
  console.log('   Senha: User@123');
  console.log('');
  console.log('==========================================');
  console.log('Acesse /auth/login para fazer login');
  console.log('==========================================');

  return demoUsers;
})();
