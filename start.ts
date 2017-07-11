import * as child from "child_process";
import * as os from "os";

let server;

if(os.platform() === "linux"){
  server = child.spawn('bash', ['-c','ts-node','./server/index.ts']);
}
else{
  server = child.spawn('cmd', ['/c','ts-node','./server/index.ts']);
}

server.stdout.on('data', (data) => {
  console.log(`server: ${data}`);
});
server.stderr.on('data', (data) => {
  console.log(`server: ${data}`);
});
server.on('close', (code) => {
  console.log(`server exited with code ${code}`);
});

process.on("exit",function(){
    //webpack.kill();
    server.kill();
})
