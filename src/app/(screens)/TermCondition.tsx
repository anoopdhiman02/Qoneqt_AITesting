import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo for icons
import ViewWrapper from "@/components/ViewWrapper";
import GoBackNavigation from "@/components/Header/GoBackNavigation";
import { globalColors } from "@/assets/GlobalColors";
import { ArrowDownIcon, ArrowUpIcon } from "@/assets/DarkIcon";

const TermCondition = () => {
  const [expandedItem, setExpandedItem] = useState(null);

  const Data = [
    {
      id: 1,
      title: "Introduction",
      content:
        "The domain name is a site operated by Human Quotient Private Limited, a company incorporated under laws of India (Company).",
    },
    {
      id: 2,
      title: "Services",
      content: `1. Operationalizing the website www.qoneqt.com to users.

2. Payment generation from the activities on the given platform.`,
    },
    {
      id: 3,
      title: "Contractual Obligation",
      content: `When you use our services you agree to all of the terms. Your use of our services is also subject to our Privacy Policy and Cookie Policy which covers all the aspect of data collection, usability, sharing and storing of your personal information.

You agree that by clicking “Get Started” and “Sign-In” or similar, registering, accessing or using our services YOU ARE AGREEING TO ENTER INTO A LEGALLY BINDING CONTRACT with Qoneqt being a member/user or visitor.`,
    },
    {
      id: 4,
      title: "Obligations",
      content: `Here are the conditions which you abide by on the platform:

1. Minimum Age Clause : You agree to be of minimum age of 18 to use services on platform

2. Password/OTP: you agree that the credentials and password are not transferable and will keep them discreet.

3. Payment: you will honor all the payment obligations. Upon receiving your request, we carry out a standard pre-authorization check on your payment method to ensure there are sufficient funds to fulfil the transaction. Services will not be activated until this pre-authorization check has been completed. Your card will be debited once the service request has been accepted.`,
    },
    {
      id: 5,
      title: "Rights and Limits",
      content: `All the content posted by users would be the sole responsibility of users on platform and Qoneqt will not take any responsibility for the verification or authenticity of the contents posted by them.

If any content is flagged and reported, Qoneqt will have full discretion to accept or reject the report.

We have full right to limit the services for specific/all users on the platform.`,
    },
    {
      id: 6,
      title: "Verification",
      content: `For verification purpose of the users we shall be using self-image with identification proof, the users have given their consent for the same. The said details shall not be shared with third parties.`,
    },
    {
      id: 7,
      title: "Intellectual Property Rights",
      content:
        "Qoneqt reserves all the IPRs in the services, however individual account holders reserves the right to their Trademark, graphics and logos for their original content.",
    },
    {
      id: 8,
      title: "Disclaimer and Liability clause",
      content: `1. Qoneqt (platform) and the company makes no representation or warranty about the services and will be available on ‘As is’ and “As Available” basis. The company or platform cannot be used if any infringement, accuracy or verifiability of its content.

2. Qoneqt (platform) and the company will not be held responsible for any loss of business or loss of opportunities.`,
    },
    {
      id: 9,
      title: "Copyright Policy",
      content: `Qoneqt believes in the safety of the copyrighted material and any complaint received under the Digital Millennium Copyright Act (DMCA). As per DMCA section 5.2 points out the requirements for reporting any copyright infringement and mode of appeal. Qoneqt will take action in this regards as per the laid down procedure in respective act.`,
    },
    {
      id: 10,
      title: "Indemnification",
      content:
        "You agree to indemnify, defend and hold harmless the Company, its directors, officers, employees, consultants, agents, and affiliates, from any and all third party claims, liability, damages or costs arising from your use of this website, your breach of these Terms of Service, or infringement of any intellectual property right.",
    },
    {
      id: 11,
      title: "Violation & Termination",
      content: `You agree that the Company may, in its sole discretion and without prior notice, terminate your access to the website and block your future access if we determine that you have violated these Terms of Service or any other policies. If you or the Company terminates your use of any service, you shall still be liable to pay for any service that you have already ordered till the time of such termination.

To delete your account account check setting section on profile page.`,
    },
    {
      id: 12,
      title: "Legal Dispute Resolution",
      content:
        "In any unlikely event of legal nature, the appropriate laws of countries will be honored, however the dispute resolution will only take place in the designated residence of the company.",
    },
    {
      id: 13,
      title: "Any other Important Point",
      content:
        "The platform and the company will have full discretion to take decision on specific issues which are not mentioned.",
    },
    {
      id: 14,
      title: "Disclaimer",
      content:
        "Application downloaded should be provided with all the permissions to work correctly. Permission for audio is required for adding audio files to post, permission for video is required for adding videos in post, permission for photos is required for photo varification, adding pictures to post and permission to camera is required for adding profile/display picture of self. However, no permission will be misutilised for any tracking of users on this platform.",
    },
    {
      id: 15,
      title: "Contact Us",
      content: "For enquiries please mail to support@qoneqt.com",
    },
  ];

  const toggleItem = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <ViewWrapper>
      <GoBackNavigation header="Term & Condition" isDeepLink={true}/>
      <ScrollView style={{ padding: "4.5%" }}>
        <View style={{ marginBottom: "5%" }}>
          <Text
            style={{
              fontSize: 16,
              color: globalColors.neutral7,
              marginBottom: 12,
              letterSpacing: 0.5,
              lineHeight: 21,
            }}
          >
            Welcome and thank you for your interest in Qoneqt. The access to and
            use of qoneqt.com and the service available through the website are
            subject to the following terms, conditions and notices ("Terms of
            Service").
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: globalColors.neutral7,
              marginBottom: 12,
              letterSpacing: 0.5,
              lineHeight: 21,
            }}
          >
            By browsing through these Terms of Service and using the services
            provided by our website (qoneqt.com), you agree to all terms of
            Service along with the Privacy Policy on our website, which may be
            updated by us from time to time.
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: globalColors.neutral8,
              marginBottom: 12,
              letterSpacing: 0.5,
              lineHeight: 21,
            }}
          >
            We reserve the right, at our discretion, to change these terms on an
            ongoing-forward basis at any time. Please check these terms
            periodically for changes. If a change to these terms materially
            modifies your rights or obligations, you will be required to accept
            the modified terms in order to continue to use the service. Material
            modifications are effective upon your acceptance of the modified
            terms. Immaterial modifications are effective upon publication.
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: globalColors.neutral7,
              marginBottom: 12,
              letterSpacing: 0.5,
              lineHeight: 21,
            }}
          >
            We will not be liable if for any reason this Website is unavailable
            at any time or for any period. From time to time, we may restrict
            access to some parts or this entire Website.
          </Text>
          <Text
            style={{
              fontSize: 23,
              fontWeight: "bold",
              marginBottom: "10%",
              color: globalColors.neutralWhite,
            }}
          >
            Collection of data
          </Text>
        </View>

        {Data.map((item) => (
          <View
            key={item.id}
            style={{
              marginBottom: "5%",
              bottom: "2%",
              borderWidth: 0.5,
              borderColor: globalColors.neutral9,
              borderRadius: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => toggleItem(item.id)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "4%",
                backgroundColor: globalColors.neutral2,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: globalColors.neutralWhite,
                }}
              >
                {item.id}. {item.title}
              </Text>
              {expandedItem === item.id ? <ArrowDownIcon /> : <ArrowUpIcon />}
            </TouchableOpacity>
            {expandedItem === item.id && (
              <View
                style={{ padding: 10, backgroundColor: globalColors.neutral4 }}
              >
                <Text
                  style={{
                    color: globalColors.neutral10,
                    fontSize: 14,
                    letterSpacing: 0.5,
                    lineHeight: 21,
                  }}
                >
                  {item.content}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </ViewWrapper>
  );
};

export default TermCondition;
