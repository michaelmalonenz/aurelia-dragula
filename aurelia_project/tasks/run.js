import gulp from 'gulp';
import project from '../aurelia.json';
import * as devServer from './dev-server';
import {CLIOptions} from 'aurelia-cli';
import build from './build';
import watch from './watch';

if (!CLIOptions.hasFlag('watch')) {
  // "au run" always runs in watch mode
  CLIOptions.instance.args.push('--watch');
}

let serve = gulp.series(
  build,
  function startDevServer(done) {
    devServer.run({
      open: CLIOptions.hasFlag('open') || project.platform.open,
      port: CLIOptions.getFlagValue('port') || project.platform.port,
      host: CLIOptions.getFlagValue('host') || project.platform.host || "localhost",
      baseDir: project.platform.baseDir
    });
    done();
  }
);

function log(message) {
  console.log(message); //eslint-disable-line no-console
}

function reload() {
  log('Refreshing the browser');
  devServer.reload();
}

const run = gulp.series(
  serve,
  done => { watch(reload); done(); }
);

const shutdownDevServer = () => {
  devServer.destroy();
};

export { run as default, serve , shutdownDevServer };
