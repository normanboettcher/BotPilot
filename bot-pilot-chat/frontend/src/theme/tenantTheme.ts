export type TenantTheme = {
  primaryColor: string;
  botBubbleColor: string;
  botBubbleTextColor: string;
  userBubbleColor: string;
  userBubbleTextColor: string;
  logoUrl: string | null;
  botName: string;
  welcomeMessage: string;
};

export const DEFAULT_TENANT_THEME: TenantTheme = {
  primaryColor: '#1e40af',
  botBubbleColor: '#f1f5f9',
  botBubbleTextColor: '#1e293b',
  userBubbleColor: '#1e40af',
  userBubbleTextColor: '#ffffff',
  logoUrl: null,
  botName: 'Assistent',
  welcomeMessage:
    'Hallo, ich bin BotPilot. Ich stehe Ihnen zu Fragen rundum die Kanzlei XY zur Verfügung sowie zu ' +
    'allen organisatorischen und auch steuerlichen Fragen. Wie kann ich Ihnen heute helfen?',
};
