import React from 'react';
import { Text, Linking, TouchableOpacity } from 'react-native';

function decodeHTMLEntities(text) {
  const entities = {
    '&#39;': "'",
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
  };

  return text.replace(/&#?\w+;/g, match => entities[match] || match);
}

export const TextRenderContent = ({content, textStyle, ...props}: {content: any, textStyle: any}) => {
  if (!content) return <Text {...props}> </Text>;

  const decodedContent = decodeHTMLEntities(content)
    .replace(/\\r/g, '')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'");

  // Split by words/spaces/newlines to map
  const words = decodedContent.split(/(\s+|\n)/g);

  return (
    <Text style={textStyle} {...props}>
      {words.map((word, index) => {
        if (/^https?:\/\/[^\s<]+$/.test(word)) {
          return (
            <Text
              key={index}
              style={{ color: '#2563eb', textDecorationLine: 'underline' }}
              onPress={() => Linking.openURL(word)}
            >
              {word}
            </Text>
          );
        } else if (/^#(\w+)/.test(word)) {
          const tag = word.match(/^#(\w+)/)[1];
          return (
            <Text
              key={index}
              style={{ color: '#2563eb', textDecorationLine: 'underline' }}
              onPress={() => console.log(`Navigate to /search/${tag}/hashtags`)}
            >
              {word}
            </Text>
          );
        } else if (word === '\n') {
          return <Text key={index}>{'\n'}</Text>;
        } else {
          return <Text key={index}>{word}</Text>;
        }
      })}
    </Text>
  );
};