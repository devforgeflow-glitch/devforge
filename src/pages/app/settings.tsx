import Head from 'next/head';
import { useState } from 'react';
import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { Layout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input, Label, Badge } from '@/components/ui';
import { useAuth } from '@/contexts';
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Palette,
  Key,
  Mail,
  Smartphone,
  Save,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

/**
 * Página: Configurações
 *
 * Permite o usuário configurar preferências da conta.
 *
 * @version 1.0.0
 */

const TAB_IDS = ['profile', 'notifications', 'security', 'billing', 'preferences'] as const;
const TAB_ICONS = [User, Bell, Shield, CreditCard, Palette];

export default function SettingsPage() {
  const t = useTranslations();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  // Estados do formulário
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  // Notificações
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  // Preferências
  const [language, setLanguage] = useState('pt-BR');
  const [timezone, setTimezone] = useState('America/Sao_Paulo');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground">
                {name?.substring(0, 2).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{name || t('settingsPage.profile.defaultUser')}</h3>
                <p className="text-sm text-muted-foreground">{email}</p>
                <Badge className="mt-1">{user?.role === 'admin' ? t('settingsPage.profile.roleAdmin') : t('settingsPage.profile.roleUser')}</Badge>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t('settingsPage.profile.fullName')}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('settingsPage.profile.fullNamePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('settingsPage.profile.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('settingsPage.profile.phone')}</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('settingsPage.profile.phonePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">{t('settingsPage.profile.company')}</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={t('settingsPage.profile.companyPlaceholder')}
                />
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t('settingsPage.notifications.email.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('settingsPage.notifications.email.description')}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t('settingsPage.notifications.push.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('settingsPage.notifications.push.description')}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t('settingsPage.notifications.weekly.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('settingsPage.notifications.weekly.description')}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={weeklyReport}
                  onChange={(e) => setWeeklyReport(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-3 mb-4">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t('settingsPage.security.changePassword.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('settingsPage.security.changePassword.description')}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('settingsPage.security.changePassword.currentPassword')}</Label>
                  <Input type="password" placeholder={t('settingsPage.security.changePassword.currentPasswordPlaceholder')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('settingsPage.security.changePassword.newPassword')}</Label>
                  <Input type="password" placeholder={t('settingsPage.security.changePassword.newPasswordPlaceholder')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('settingsPage.security.changePassword.confirmPassword')}</Label>
                  <Input type="password" placeholder={t('settingsPage.security.changePassword.confirmPasswordPlaceholder')} />
                </div>
                <Button variant="outline">{t('settingsPage.security.changePassword.button')}</Button>
              </div>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('settingsPage.security.twoFactor.title')}</p>
                    <p className="text-sm text-muted-foreground">{t('settingsPage.security.twoFactor.description')}</p>
                  </div>
                </div>
                <Button variant="outline">{t('settingsPage.security.twoFactor.button')}</Button>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('settingsPage.billing.currentPlan')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{t('settingsPage.billing.free')}</p>
                    <p className="text-sm text-muted-foreground">{t('settingsPage.billing.freeDescription')}</p>
                  </div>
                  <Button>{t('settingsPage.billing.upgrade')}</Button>
                </div>
              </CardContent>
            </Card>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    {t('settingsPage.billing.demoMode.title')}
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {t('settingsPage.billing.demoMode.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="language">{t('settingsPage.preferences.language')}</Label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-background"
                >
                  <option value="pt-BR">{t('settingsPage.preferences.languages.pt-BR')}</option>
                  <option value="en">{t('settingsPage.preferences.languages.en')}</option>
                  <option value="es">{t('settingsPage.preferences.languages.es')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">{t('settingsPage.preferences.timezone')}</Label>
                <select
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-background"
                >
                  <option value="America/Sao_Paulo">{t('settingsPage.preferences.timezones.sao_paulo')}</option>
                  <option value="America/New_York">{t('settingsPage.preferences.timezones.new_york')}</option>
                  <option value="Europe/London">{t('settingsPage.preferences.timezones.london')}</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-3 mb-2">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">{t('settingsPage.preferences.theme.title')}</p>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {t('settingsPage.preferences.theme.description')}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>{t('settingsPage.meta.title')}</title>
      </Head>

      <Layout title={t('settingsPage.title')} description={t('settingsPage.description')}>
        <div className="container-app py-8">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Sidebar de Tabs */}
            <Card className="lg:col-span-1 h-fit">
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {TAB_IDS.map((tabId, index) => {
                    const Icon = TAB_ICONS[index];
                    return (
                      <button
                        key={tabId}
                        onClick={() => setActiveTab(tabId)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === tabId
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {t(`settingsPage.tabs.${tabId}`)}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Conteúdo */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const tabIndex = TAB_IDS.indexOf(activeTab as typeof TAB_IDS[number]);
                    if (tabIndex >= 0) {
                      const Icon = TAB_ICONS[tabIndex];
                      return <Icon className="h-5 w-5" />;
                    }
                    return null;
                  })()}
                  {t(`settingsPage.tabs.${activeTab}`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderTabContent()}

                {/* Botão Salvar */}
                {activeTab !== 'billing' && (
                  <div className="mt-6 pt-6 border-t flex items-center justify-between">
                    {saved && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">{t('settingsPage.save.success')}</span>
                      </div>
                    )}
                    <Button onClick={handleSave} className="ml-auto gap-2">
                      <Save className="h-4 w-4" />
                      {t('settingsPage.save.button')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const { loadMessages } = await import('@/i18n');
  return {
    props: {
      messages: await loadMessages(locale || 'pt-BR'),
    },
  };
}
