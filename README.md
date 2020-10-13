Cut out the middleman and upload your content straight to IPFS

## React IPFS Dropzone


## Installation

With NPM

```
  npm install --save react-ipfs-dropzone

  Peer Dependencies

  npm install --save ipfs ipfs-http-client 
```

With Yarn

```
  yarn add react-ipfs-dropzone

  Peer Dependencies

  yarn add ipfs ipfs-http-client
```

## Usage

```javascript

import React from 'react';

import IPFSDropzone from 'react-ipfs-dropzone';

export default function DummyComponent(props){
  return (
    <IPFSDropzone 
      onLoad={(cids) => {

      }}
      loadBody={(
        <span>Drop files</span>
      )} />
  );
}

```

## Props

### onLoad

callback fired with cids of all uploaded files

### loadBody

Content of the dropzone internals

## Styling

react-ipfs-dropzone is the base class name for styling
