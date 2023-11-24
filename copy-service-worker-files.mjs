﻿import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

try {

  /**
   * Script to run after npm install
   *
   * Copy selected files to user's directory
   */
  const script_prefix= 'react-oidc';

  const copyFile = async (src, dest, overwrite) => {
    if(!fileExists(src)) {
      console.log(`[${script_prefix}:skip] file does not exist ${src}`);
      return false;
    }
    if (!overwrite) {
      if (fileExists(dest)) {
        console.log(`[${script_prefix}:skip] file exists not overwriting ${dest}`);
        return true;
      }
    }
    await fs.promises.copyFile(src, dest);
    console.log(`[${script_prefix}:copy] ${dest}`);
    return true
  };

  const fileExists = (path) => {
    return !!fs.existsSync(path);
  };

  const initPath = process.cwd();
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const srcDir = path.join(__dirname, 'node_modules' ,'oidc-client-service-worker');
  const srcDirFallback = path.join(__dirname, "..", 'node_modules' ,'oidc-client-service-worker');
  const destinationFolder = process.argv.length >= 3 ? process.argv[2] : 'public';
  const destinationDir = path.join(initPath, destinationFolder);

  const files = [
    {
      fileName: 'ServiceWorker.js',
      overwrite: true,
    }
  ];

  for await (const file of files) {
    const success = await copyFile(
        path.join(srcDir, file.fileName),
        path.join(destinationDir, file.fileName),
        file.overwrite
    );
    if(!success){
      await copyFile(
          path.join(srcDirFallback, file.fileName),
          path.join(destinationDir, file.fileName),
          file.overwrite
      );
    }
  }

} catch (err) {
  console.warn(err);
}