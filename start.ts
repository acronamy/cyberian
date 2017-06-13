import * as child from "child_process";


const webpack = child.spawn('cmd', ['/c','webpack','--watch','--config','./webpack.config.ts'],{ stdio:"inherit" });

const server = child.spawn('cmd', ['/c','ts-node','./server/index.ts']);

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
    webpack.kill();
    server.kill();
})