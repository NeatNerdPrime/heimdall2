import {SequelizeOptions} from 'sequelize-typescript';
import AppConfig from '../../config/app_config';
import {StartupSettingsDto} from './dto/startup-settings.dto';

export class ConfigService {
  private readonly appConfig: AppConfig;
  public defaultGithubBaseURL = 'https://github.com/';
  public defaultGithubAPIURL = 'https://api.github.com/';

  constructor() {
    this.appConfig = new AppConfig();
  }

  isRegistrationAllowed(): boolean {
    return this.get('REGISTRATION_DISABLED')?.toLowerCase() !== 'true';
  }

  frontendStartupSettings(): StartupSettingsDto {
    const enabledOauth: string[] = [];
    supportedOauth.forEach((oauthStrategy) => {
      if (this.get(`${oauthStrategy.toUpperCase()}_CLIENTID`)) {
        enabledOauth.push(oauthStrategy);
      }
    });
    return new StartupSettingsDto({
      banner: this.get('WARNING_BANNER') || '',
      enabledOAuth: enabledOauth,
      oidcName: this.get('OIDC_NAME') || '',
      ldap: this.get('LDAP_ENABLED')?.toLocaleLowerCase() === 'true' || false,
      registrationEnabled: this.isRegistrationAllowed()
    });
  }

  getDbConfig(): SequelizeOptions {
    return this.appConfig.getDbConfig();
  }

  getSSLConfig(): false | {rejectUnauthorized: boolean} {
    return this.appConfig.getSSLConfig();
  }

  set(key: string, value: string | undefined): void {
    this.appConfig.set(key, value);
  }

  get(key: string): string | undefined {
    return this.appConfig.get(key);
  }
}
export const supportedOauth: string[] = [
  'github',
  'gitlab',
  'google',
  'okta',
  'oidc'
];
