const { app , BrowserWindow } = require('electron');
const { exec } = require('child_process');
const { Worker } = require('worker_threads');
const path = require('path');


// Dev version //
function tryLoadUrl(url, window){
    window.loadURL(url)
        .then(() => console.log('Finished Frontend load'))
        .catch(() => {
            console.log('Waiting for frontend...');
            setTimeout(() => tryLoadUrl(url, window), 1000);
        })
}

function createDevFrontend(){
    exec('npm start',
        { cwd: path.resolve(__dirname, 'frontend') },
        (err, stdout, stderr) => {
            console.log('frontend:', stdout);
        });
}


function createBackEnd(updateCallback) {
    return new Promise((_, reject) => {
        const service = new Worker(
            path.resolve(__dirname, 
                app.isPackaged ? '../app.asar.unpacked/server.js' : 'server.js'));
        service.on('message', updateCallback || (() => {}));
        service.on('error', reject);
        service.on('exit', (code) => {
            if(code != 0) {
                reject(new Error(`Server stopped status code: ${code}`));
            }
        });
    });
}

app.on('ready', async (info) => {
    const window = new BrowserWindow();
    if(app.isPackaged)
        window.loadFile('app/index.html');
    else{
        createDevFrontend();
        tryLoadUrl('http://localhost:3000/', window);
    }
});

app.on('window-all-closed', () => {
    app.quit();
});

const backend = createBackEnd((message) => {
    console.log('[backend]:', message);
});

backend.catch((message) => {
    console.log(message);
    app.quit();
});
