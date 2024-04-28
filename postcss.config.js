module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    // Add @fullhuman/postcss-purgecss only in production
    process.env.NODE_ENV === 'production' && require('@fullhuman/postcss-purgecss')({
      content: ['./src/**/*.html', './src/**/*.ts'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
  ],
};
