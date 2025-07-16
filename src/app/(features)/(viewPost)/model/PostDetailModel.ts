export interface PostDetailModel {
  id: number;
  post_title: string;
  post_type: number;
  post_video: any;
  post_audio: any;
  post_content: string;
  tip_amount: string;
  post_image: string;
  category: number;
  file_type: string;
  like_count: number;
  time: string;
  post_by: PostBy;
  like_byme: LikeByme[];
  likes_aggregate: LikesAggregate;
  post_comments_aggregate: PostCommentsAggregate;
  post_comments: PostComment[];
  loop_id_conn: LoopIdConn;
}

export interface PostBy {
  id: number;
  full_name: string;
  profile_pic: string;
  social_name: string;
  username: string;
  kyc_status: number;
}

export interface LikeByme {
  id: number;
}

export interface LikesAggregate {
  aggregate: Aggregate;
}

export interface Aggregate {
  count: number;
}

export interface PostCommentsAggregate {
  aggregate: Aggregate2;
}

export interface Aggregate2 {
  count: number;
}

export interface PostComment {
  id: number;
  comment: string;
  image: any;
  audio: any;
  video: any;
  created_at: string;
  replies_aggregate: RepliesAggregate;
  replies: Reply[];
  user: User2;
}

export interface RepliesAggregate {
  aggregate: Aggregate3;
}

export interface Aggregate3 {
  count: number;
}

export interface Reply {
  id: number;
  parent_id: number;
  comment: string;
  image: any;
  audio: any;
  video: any;
  user_id: number;
  created_at: string;
  user: User;
}

export interface User {
  id: number;
  full_name: string;
  profile_pic: string;
  username: string;
  social_name: string;
  kyc_status: number;
}

export interface User2 {
  id: number;
  full_name: string;
  profile_pic: string;
  username: string;
  social_name: string;
  kyc_status: number;
}

export interface LoopIdConn {
  id: number;
  loop_name: string;
  loop_logo: string;
  slug: string;
  subscription_type: string;
  loop_cat: number;
  category: Category;
  group_type: number;
  members: Member[];
}

export interface Category {
  id: number;
  category_name: string;
}

export interface Member {
  user_id: number;
  role: number;
  unseen: number;
  subscription_end: any;
  subscription_type: string;
  subscription_start: any;
  is_blocked: number;
  is_msg_disabled: number;
  is_post_disabled: number;
  is_comment_disabled: number;
}
