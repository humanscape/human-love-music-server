/**
 * Type defs copied from @slack/bolt
 * https://github.com/slackapi/bolt-js/blob/main/src/types/events/index.ts
 */

export interface EnvelopedEvent<T> extends Record<string, any> {
  token: string;
  team_id: string;
  enterprise_id?: string;
  api_app_id: string;
  event: T;
  type: string;
  event_id: string;
  event_time: number;
  // TODO: the two properties below are being deprecated on Feb 24, 2021
  authed_users?: string[];
  authed_teams?: string[];
  is_ext_shared_channel?: boolean;
  authorizations?: Authorization[];
}

interface Authorization {
  enterprise_id: string | null;
  team_id: string | null;
  user_id: string;
  is_bot: boolean;
  is_enterprise_install?: boolean;
}
