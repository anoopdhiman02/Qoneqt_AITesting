import { create } from "zustand";

interface ProfileDetailsProps {
  username: string;
  full_name: string;
  social_name: string;
  email: string;
  ccode: number;
  phone: string;
  profile_pic: string;
  kyc_status: number;
  joinDate: number;
  wallet_balance: string;
  seller_balance: string;
  default_currency: string;
  about: string;
  website: string;
  country: string;
  city: string;
  ethureum_wallet_address: string | null;
  followers_count: number;
  follows_count: number;
  post_count: number;

  setUsername: (data: string) => void;
  setFullName: (data: string) => void;
  setSocialName: (data: string) => void;
  setEmail: (data: string) => void;
  setCcode: (data: number) => void;
  setPhone: (data: string) => void;
  setProfilePic: (data: string) => void;
  setKycStatus: (data: number) => void;
  setJoinDate: (data: number) => void;
  setWalletBalance: (data: string) => void;
  setSellerBalance: (data: string) => void;
  setDefaultCurrency: (data: string) => void;
  setAbout: (data: string) => void;
  setWebsite: (data: string) => void;
  setCountry: (data: string) => void;
  setCity: (data: string) => void;
  setEthereumWalletAddress: (data: string | null) => void;
  setFollowersCount: (data: number) => void;
  setFollowsCount: (data: number) => void;
  setPostCount: (data: number) => void;
}

export const useProfileDetailsStore = create<ProfileDetailsProps>((set) => ({
  username: "",
  full_name: "",
  social_name: "",
  email: "",
  ccode: 0,
  phone: "",
  profile_pic: "",
  kyc_status: 0,
  wallet_balance: "0",
  seller_balance: "0",
  default_currency: "",
  about: "",
  website: "",
  country: "",
  joinDate: 0,
  city: "",
  ethureum_wallet_address: null,
  followers_count: 0,
  follows_count: 0,
  post_count: 0,

  setUsername: (data) => set({ username: data }),
  setFullName: (data) => set({ full_name: data }),
  setSocialName: (data) => set({ social_name: data }),
  setEmail: (data) => set({ email: data }),
  setCcode: (data) => set({ ccode: data }),
  setPhone: (data) => set({ phone: data }),
  setProfilePic: (data) => set({ profile_pic: data }),
  setKycStatus: (data) => set({ kyc_status: data }),
  setJoinDate(data) {
    time: data;
  },
  setWalletBalance: (data) => set({ wallet_balance: data }),
  setSellerBalance: (data) => set({ seller_balance: data }),
  setDefaultCurrency: (data) => set({ default_currency: data }),
  setAbout: (data) => set({ about: data }),
  setWebsite: (data) => set({ website: data }),
  setCountry: (data) => set({ country: data }),
  setCity: (data) => set({ city: data }),
  setEthereumWalletAddress: (data) => set({ ethureum_wallet_address: data }),
  setFollowersCount: (data) => set({ followers_count: data }),
  setFollowsCount: (data) => set({ follows_count: data }),
  setPostCount: (data) => set({ post_count: data }),
}));
