if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('http://localhost/Dropbox/git/Static4/service-worker-poc/sw.js').then(function(registration) {
        
        console.log('Registration was successful')
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
    });
}
