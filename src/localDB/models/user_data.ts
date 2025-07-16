import { BSON, ObjectSchema } from "realm";
import Realm from "realm";
// Define your object model
export class user_data extends Realm.Object<user_data> {
  // _id!: BSON.ObjectId;
  name!: string;
  userId: string;
  email: string;
  mobile: number;
  token: string;
  kycStatus: number;
  socialName: string;
  userName: string;
  isLogged: boolean;
  // static primaryKey: "_id";
}
