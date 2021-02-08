import path from 'path';
import { Command } from 'commander';
import { serve } from '@myjsnote/local-api';

const isProduction = process.env.NODE_ENV === 'production';

export const serveCommand = new Command()
  .command('serve [filename]')
  .description('Open a file for editing')
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action(async (filename = 'notebook.js', options: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
      const actualFileName: string = path.basename(filename);
      await serve(parseInt(options.port), actualFileName, dir, !isProduction);
      console.log(
        `Opened ${actualFileName}. Navigate to http://localhost:${options.port} to edit the file`
      );
    } catch (error) {
      if (error.code === 'EADDRINUSE') {
        console.error('Port already in use');
        console.log('Here is the problem:', error.message);
      } else {
        console.log('Here is the problem:', error.message);
      }
      process.exit(1);
    }
  });
