import React from 'react';
import '@wordpress/block-library/build-style/style.css';
import {createElement} from '@wordpress/element';
import {capitalize} from 'lodash';

import {settings as Columns} from '@wordpress/block-library/build/columns';
import BlockPreview from '@wordpress/block-editor/build/components/block-preview';
import {createBlock, getSaveElement, getSaveContent} from '@wordpress/blocks';
import {withBlockEditContext} from '@wordpress/block-editor/build/components/block-edit/context';
import {useEffect, useState } from '@wordpress/element';
import {EntityProvider} from '@wordpress/core-data';
import {getBlockTypes} from '@wordpress/blocks';

import { registerCoreBlocks } from '@wordpress/block-library';

registerCoreBlocks();

export default { title: 'Columns' };

const Block = 'Block';

const nameLookup = getBlockTypes()
  .filter(block => /^core\//.test(block.name))

  .reduce( (acc, block) => {
    const name = block.name;

    const fauxNom = capitalize(
      block.name.replace(
        /^[^\/]+\//,
        ''
      )
    );

    acc[fauxNom] = name;
    global[fauxNom] = name;

    return acc;
  }, {})
;

function fauxNomToBlockType(fauxNom, backup) {
  return nameLookup[fauxNom] || backup;
}

function fakeElementToRealBlock(el) {
  const attr = el.props.attributes || {};
  let children = [];

  // Move string child to content attribute
  if (typeof el.props.children == 'string') {
    attr.content = el.props.children;
  } else if (el.props.children instanceof Array) {
    children = el.props.children.map(fakeElementToRealBlock);
  } else if (React.isValidElement(el.props.children)) {
    children = [fakeElementToRealBlock(el.props.children)];
  }

  let type = el.type == 'Block' ? el.props.blockType : el.type;

  if (type.title) {
    type = nameLookup[type.title];
  }

  console.log(type, attr, children, el);

  return createBlock(type, attr, children);
}

function BlockRoot(props) {
  let children = props.children;

  if (!children) {
    children = [];
  } else if(!(children instanceof Array)) {
    children = [props.children];
  }

  let saveContent = getSaveContent(
    'core/group',
    {},
    children.flatMap(fakeElementToRealBlock)
  );

  return <div dangerouslySetInnerHTML={{__html: saveContent}}/>;
}

export const Basic = () => {
  return (
    <BlockRoot>
      <Heading>Real Heading</Heading>
      <Paragraph>here is the thing</Paragraph>

      <Heading attributes={{level: 3}}>Hello</Heading>

      <Paragraph>and here is the other thing</Paragraph>
      <Paragraph>and here is the other thing</Paragraph>

      <Columns>
        <Column>
          <Paragraph attributes={{fontSize: 'large'}}>
            Column 1 o
          </Paragraph>
        </Column>

        <Column>
          <Paragraph>
            Column 2222
          </Paragraph>
        </Column>

      </Columns>

    </BlockRoot>
  );

};
