app.service("collectionsService",function(){function n(n){for(var e=n.length,a=e;--a;){var o=t(a);a!==o&&r(n,a,o)}return n}function r(n,r,t){var e=n[r];n[r]=n[t],n[t]=e}function t(n,r){1===arguments.length&&(r=arguments[0],n=0);var t=r-n+1,e=Math.floor(t*Math.random());return n+e}return{shuffle:n,swap:r}});