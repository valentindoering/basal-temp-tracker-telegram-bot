import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

const ffmpegPath = ffmpegInstaller.path;
ffmpeg.setFfmpegPath(ffmpegPath);



export async function convertToMp3(oggFilePath: string, mp3FilePath: string) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(oggFilePath)
      .output(mp3FilePath)
      .on('end', () => {
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      })
      .run();
  });
}


