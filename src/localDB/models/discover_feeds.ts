import Realm from "realm";
import { BSON, ObjectSchema } from "realm";

export class DiscoverPostSchema extends Realm.Object<DiscoverPostSchema> {
  _id!: BSON.ObjectId;
  name: "discover_post";
  primaryKey: "id";
  properties: {
    id: "int";
    post_title: "string";
    post_type: "int";
    post_video: "string?";
    post_audio: "string?";
    post_content: "string";
    tip_amount: "string";
    post_image: "string";
    category: "int";
    file_type: "string";
    like_count: "int";
    time: "date";
    post_by: {
      // Embedded User schema
      type: "object";
      properties: {
        id: "int";
        full_name: "string";
        profile_pic: "string";
        social_name: "string?";
        username: "string";
        kyc_status: "int";
      };
    };
    likeby_me: { type: "list"; objectType: "User" }; // Array of User objects
    likes_aggregate: {
      // Embedded LikesAggregate schema
      type: "object";
      properties: {
        count: "int";
      };
    };
    post_comments_aggregate: {
      // Embedded CommentsAggregate schema
      type: "object";
      properties: {
        count: "int";
      };
    };
    loop_id_conn: {
      // Embedded Loop schema
      type: "object";
      properties: {
        id: "int";
        loop_name: "string";
        loop_logo: "string";
        slug: "string";
        subscription_type: "string";
        loop_cat: "int";
        category_name: "string";
        group_type: "int";
        members: {
          // Array of Member objects
          type: "list";
          objectType: "Member";
        };
      };
    };
  };
  static primaryKey: "_id";
}
