
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 24853, hash: 'af381cb251a9583580d61b516dd556294bb419e9665b8426c26e6e8d45f5e294', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17153, hash: '54ef33cadb94e126136dd4771479562724d40c2d1bf82ee265f1168a662b9c0d', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 195987, hash: '410dcf0e3c4cdcb019f6d7801f1988c0a92f8ef25c95d87a2ea0bdcff0a44542', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-2YS3WRPH.css': {size: 8315, hash: '+fpJivzZxP4', text: () => import('./assets-chunks/styles-2YS3WRPH_css.mjs').then(m => m.default)}
  },
};
