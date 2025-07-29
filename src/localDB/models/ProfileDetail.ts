import { BSON, ObjectSchema } from "realm";
import Realm from "realm";

// Define your object model
export class profile_detail extends Realm.Object<profile_detail> {
  // _id!: number;
  user_id: number;
  full_name!: string;
  social_name!: string;
  username!: string;
  email!: string;
  ccode!: number;
  phone!: string;
  profile_pic!: string;
  kyc_status!: number;
  wallet_balance!: string;
  seller_balance!: string;
  default_currency!: string;
  about!: string;
  website!: string;
  country!: string;
  city!: string;
  followers_count!: number;
  follows_count!: number;
  post_count!: number;
  isLogged!: boolean;

  // static primaryKey: "_id";

  // static schema: ObjectSchema = {
  //   name: "profile_detail",
  //   primaryKey: "_id",
  //   properties: {
  //     _id: "objectId",
  //     username: "string",
  //     full_name: "string",
  //     social_name: "string",
  //     email: "string",
  //     ccode: "int",
  //     phone: "string",
  //     profile_pic: "string",
  //     kyc_status: "int",
  //     wallet_balance: "string",
  //     seller_balance: "string",
  //     default_currency: "string",
  //     about: "string",
  //     website: "string",
  //     country: "string",
  //     city: "string?",
  //     followers_count: "int",
  //     follows_count_aggregate: "int",
  //     post_count_aggregate: "int",
  //     isLogged: "bool",
  //   },
  // };
}
