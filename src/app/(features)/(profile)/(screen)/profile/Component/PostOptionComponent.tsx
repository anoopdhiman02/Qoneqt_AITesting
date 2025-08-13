import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { globalColors } from '@/assets/GlobalColors';
import { DeleteIcon } from '@/assets/DarkIcon';

interface PostOptionComponentProps {
    onPressDeletePost: (post: any) => void;
}

const PostOptionComponent: React.FC<PostOptionComponentProps> = ({ onPressDeletePost }) => {
  return (
    <View>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 22,
              alignSelf: "center",
            }}
          >
            Post option
          </Text>

          <TouchableOpacity
            onPress={onPressDeletePost}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: "6%",
            }}
          >
            <View
              style={{
                padding: "1%",
                borderRadius: 10,
                backgroundColor: globalColors.slateBlueShade60,
              }}
            >
              <DeleteIcon />
            </View>
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 18,
                marginTop: "1%",
                marginLeft: "5%",
              }}
            >
              Delete Post
            </Text>
          </TouchableOpacity>
        </View>
  )
}

export default PostOptionComponent