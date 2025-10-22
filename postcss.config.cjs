const purgecss = require('@fullhuman/postcss-purgecss').default;
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    purgecss({
      content: [
        './*.html',
        './admin.html',
        './contact.html',
        './devis.html'
      ],
      // Safelist pour conserver les classes générées dynamiquement
      safelist: {
        standard: [
          'active',
          'animate',
          'animate-on-scroll',
          'animate-fade-up',
          'animate-fade-left',
          'animate-fade-right',
          'animate-scale'
        ],
        deep: [],
        greedy: []
      },
      // Options de PurgeCSS
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    }),
    cssnano({
      preset: ['default', {
        discardComments: {
          removeAll: true
        },
        normalizeWhitespace: true,
        colormin: true,
        minifyFontValues: true,
        minifySelectors: true
      }]
    })
  ]
};
