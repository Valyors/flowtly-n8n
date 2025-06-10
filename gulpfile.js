const gulp = require('gulp');
const svgmin = require('gulp-svgmin');
const svgSprite = require('gulp-svg-sprite');

// Tâche pour copier le SVG Flowtly dans le bon dossier
gulp.task('copy:svg', () => {
  return gulp
    .src('src/nodes/Flowtly/flowtly.svg')
    .pipe(gulp.dest('dist/nodes/Flowtly'));
});

// Tâche pour construire les sprites
gulp.task('build:icons', () => {
  return gulp
    .src('src/nodes/**/*.svg')
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      }),
    )
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            dest: 'dist',
            sprite: 'sprite.svg',
          },
        },
      }),
    )
    .pipe(gulp.dest('dist'));
});

// Tâche par défaut qui exécute les deux tâches
gulp.task('default', gulp.series('copy:svg', 'build:icons')); 