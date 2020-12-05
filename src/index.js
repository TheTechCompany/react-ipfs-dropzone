import React from 'react';
import IPFS from 'ipfs';
import toBuffer from 'blob-to-buffer';
import Dropzone from 'react-dropzone';
import async from 'async';

let ipfs = window.ipfs;

export default function ReactIPFSDropzone(props){

  React.useEffect(() => {
    if(!ipfs && !window.ipfs && !props.ipfs){
      console.debug("=> IPFS Dropzone: Creating IPFS node")
      async function initIPFS(){
        ipfs = await IPFS.create()
        window.ipfs = ipfs;
        console.debug("=> IPFS Dropzone: IPFS node created")
      }
      initIPFS()
    }else if(window.ipfs && !ipfs){
      console.debug("=> IPFS Dropzone: Reusing open IPFS node")
      ipfs = window.ipfs;
    }else if(props.ipfs){
      ipfs = props.ipfs;
      window.ipfs = ipfs;
    }
  }, [window.ipfs, props.ipfs]) 

  const onDrop = React.useCallback((files) => {
    if(files && files.length > 0){
      if(props.onLoadStart) props.onLoadStart(files.map((x) => parseName(x.name)))
      async.map(files, (file, cb) => {
        toBuffer(file, (err, buff) => {
          if(err) return cb(err)
          ipfs.add(buff).then((results) => {
            console.debug("=> IPFS Dropzone added: ", results.cid.string)
            let _file = parseName(file.name)
            cb(null, {..._file, cid: results.cid.string})
          })
        })
      }, (err, results) => {
        if(err) return console.error("=> IPFS Dropzone: IPFS Upload Error: ", err)
        if(props.onLoad) props.onLoad(results)
      })
    }
  }, [])

  const parseName = (name) => {
    let ext = name.match(/\.[^/.]+$/)
    let file = name.replace(/\.[^/.]+$/, "")
    return {
      ext: ext ? ext[0] : null,
      name: file
    }
  }

  const dropzoneRef = React.createRef()
  
  const rootProps = {
    onClick: (e) => {
      if(props.dropOnly) e.stopPropagation();
    }
  }

  return (
    <Dropzone ref={dropzoneRef} onDrop={onDrop}>
      {({getRootProps, getInputProps, isDragActive}) => (
        <div className="react-ipfs-dropzone" {...getRootProps(rootProps)} {...props}>
          <input {...getInputProps()} />
          {props.children ? props.children : "Drop files here"}
        </div>
      )}
    </Dropzone>
  );
}
