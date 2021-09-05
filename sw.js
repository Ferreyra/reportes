const STATIC_CACHE    = 'static-v2';
const DYNAMIC_CACHE   = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v2';

const APP_SHELL = [
  '/',
  'index.html',
  'archivos/estilo.css',
  'archivos/scripts.js',
  'archivos/icons/favicon.ico',  
];

const APP_SHELL_INMUTABLE = [
  'archivos/bootstrap.min.css',
  'archivos/bootstrap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.1/jspdf.umd.min.js'
];

function actCache( rqcache, req, res ) {
  if ( res.ok ) {
    return caches.open( rqcache ).then( cache => {
      cache.put( req, res.clone() );      
      return res.clone();
    });
  } else {
    return res;
  }
}

self.addEventListener('install', e => {
  const cacheStatic = caches.open( STATIC_CACHE )
    .then(cache => cache.addAll( APP_SHELL ));
  const cacheInmutable = caches.open( INMUTABLE_CACHE )
    .then(cache => cache.addAll( APP_SHELL_INMUTABLE ));
  e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]) );
});


self.addEventListener('activate', e => {
  const respuesta = caches.keys().then( keys => {
    keys.forEach( key => {
      if ( key !== STATIC_CACHE && key.includes('static') ) {
        return caches.delete(key);
      }
      if ( key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
        return caches.delete(key);
      }
    });
  });
  e.waitUntil( respuesta );
});

self.addEventListener( 'fetch', e => {
  
  const respuesta = caches.match( e.request ).then( res => {
      if ( res ) {
          if ( !e.request.url.includes('min')) {
              actCache( STATIC_CACHE, e.request, res );    
          }               
          return res;
      } else {
          return fetch( e.request ).then( newRes => {
              return actCache( DYNAMIC_CACHE, e.request, newRes );
          });
      }
  });
  e.respondWith( respuesta );
});
