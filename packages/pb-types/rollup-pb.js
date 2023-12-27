import pb from 'protobufjs-cli'

const loader=()=>{
    return new Promise((res,err)=>{
        pb.pbjs.main([ "-t","static-module","-w","es6","--dependency","protobufjs/dist/minimal/protobuf.js", "./src/*.proto" ], function(error, output) {
            if (error){
                err(error);
                return;}
            res(output);
        });
    });
}
export default function myExample () {
    return {
      name: 'my-example', // this name will show up in logs and errors
      resolveId ( source ) {
        if (source === 'virtual-module') {
          // this signals that Rollup should not ask other plugins or check
          // the file system to find this id
          return source;
        }
        return null; // other ids should be handled as usually
      },
      load ( id ) {
        if (id === 'virtual-module') {
          // the source code for "virtual-module"
          return loader();
        }
        return null; // other ids should be handled as usually
      }
    };
  }