import { PersonalInfo } from "./PersonalInfo";
import { EmailPreferences } from "./EmailPreferences";
import { PersonalAccessToken, PersonalAccessTokenDescription } from "./PersonalAccessToken";
import { MembershipInfo } from "./MembershipInfo";
import type React from "react";
import { PersonalJWTToken } from "./PersonalJWTToken";
import type { AuthTokenSettings } from "../types";
import { ff } from "@humansignal/core";

type SectionType = {
  title: string;
  id: string;
  component: React.FC;
  description?: React.FC;
};

export const accountSettingsSections = (settings: AuthTokenSettings): SectionType[] => {
  return [
    {
      title: "个人信息",
      id: "personal-info",
      component: PersonalInfo,
    },
    {
      title: "电子邮件偏好",
      id: "email-preferences",
      component: EmailPreferences,
    },
    {
      title: "成员信息",
      id: "membership-info",
      component: MembershipInfo,
    },
    settings.api_tokens_enabled &&
      ff.isActive(ff.FF_AUTH_TOKENS) && {
        title: "个人访问令牌",
        id: "personal-access-token",
        component: PersonalJWTToken,
        description: PersonalAccessTokenDescription,
      },
    settings.legacy_api_tokens_enabled && {
      title: ff.isActive(ff.FF_AUTH_TOKENS) ? "Legacy Token" : "Access Token",
      id: "legacy-token",
      component: PersonalAccessToken,
      description: PersonalAccessTokenDescription,
    },
  ].filter(Boolean) as SectionType[];
};
