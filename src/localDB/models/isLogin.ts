import Realm from "realm";

export class isLogin extends Realm.Object {
  id!: number;
  isLoggedDb: boolean;
  userIdDb: number;
  userKycStatusDb!: number;
  full_name!: string;
  username!: string;
  social_name?: string;
  default_currency!: string;
  isVerified!: number;
  status!: number;
  profile_pic?: string;
  phone!: string;
  email!: string;
  favorite_category!: Realm.List<string>;
  identificationType!: number;
}
