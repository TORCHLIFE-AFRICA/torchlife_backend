import { AccountStatus, AgentType, CountryType, Gender, Lga, State } from "@prisma/client";

export class UserEntity {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  residentialAddress?: string;
  phoneNumber?: string;
  roleId: string;
  profilePic?: string;
  gender?: Gender;
  state?: State;
  lga?: Lga;
  country: CountryType;
  trafficSource?: string;
  myReferralId? : string;
  bankName?: string;
  bankAccountNumber?: string;
  bankCode?: string;
  agentType?: AgentType;
  accountStatus?: AccountStatus;
  publicId?: string;
  isQualified: boolean;
  requestPartnership?: boolean;
  roleAssignedBy?: any;
  isCompleted: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
  