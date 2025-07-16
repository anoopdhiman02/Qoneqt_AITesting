import { ObjectSchema } from "realm";
import Realm from "realm";
// Define your object model
export class submit_kyc_data extends Realm.Object<submit_kyc_data> {
  stage: number;
  firstName!: string;
  lastName!: string;
  contact!: string;
  dob!: string;
  gender!: string;
  selfie!: { uri: string; type: string; name: string };
  docOne: {
    front: {
      uri: string;
      type: string;
      name: string;
    };
    back: {
      uri: string;
      type: string;
      name: string;
    };
  };
  docTwo!: { uri: string; type: string; name: string };
  kycStatus!: number;
}
