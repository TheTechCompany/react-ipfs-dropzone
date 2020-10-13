import React from 'react';
import IPFS from 'ipfs';
import toBuffer from 'blob-to-buffer';
import Dropzone from 'react-dropzone';
import async from 'async';

let ipfs = window.ipfs;

export default function ReactIPFSDropzone(props){

  React.useEffect(() => {
    if(!ipfs && !window.ipfs){
      console.debug("=> IPFS Dropzone: Creating IPFS node")
      async function initIPFS(){
        ipfs = await IPFS.create()
        console.debug("=> IPFS Dropzone: IPFS node created")
      }
      initIPFS()
    }else if(window.ipfs && !ipfs){
      console.debug("=> IPFS Dropzone: Reusing open IPFS node")
      ipfs = window.ipfs;
    }
  }, [window.ipfs]) 

  const onDrop = React.useCallback((files) => {
    if(files && files.length > 0){
      async.map(files, (file, cb) => {
        toBuffer(file, (err, buff) => {
          if(err) return cb(err)
          ipfs.add(buff).then((results) => {
            console.debug("=> IPFS Dropzone added: ", results.cid.string)
            cb(null, {name: file.name, cid: results.cid.string})
          })
        })
      }, (err, results) => {
        if(err) return console.error("=> IPFS Dropzone: IPFS Upload Error: ", err)
        props.onLoad(results)
      })
    }
  }, [])

  const dropzoneRef = React.createRef()

  return (
    <Dropzone ref={dropzoneRef} onDrop={onDrop}>
      {({getRootProps, getInputProps}) => (
        <div className="react-ipfs-dropzone" {...getRootProps()} {...props}>
          <input {...getInputProps()} />
          {props.loadBody ? props.loadBody(isDragActive) : "Drop files here"}
        </div>
      )}
    </Dropzone>
  );
}
