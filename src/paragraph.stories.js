import React from 'react';

import '@wordpress/block-library/build-style/style.css';
import {settings as Paragraph} from '@wordpress/block-library/build/paragraph';

export default { title: 'Paragraph' };

const {content} = Paragraph.example.attributes;
const attr = {content, dropCap: false};

export const Small = () => {
  let attributes = Object.assign({fontSize: 'small', dropCap: false}, attr);
  return Paragraph.save({attributes});
};

export const Regular = () => {
  let attributes = Object.assign({fontSize: 'normal', dropCap: false}, attr);
  return Paragraph.save({attributes});
};

export const Large = () => {
  let attributes = Object.assign({fontSize: 'large', dropCap: false}, attr);
  return Paragraph.save({attributes});
};
