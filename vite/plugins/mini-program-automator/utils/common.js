import fs from 'fs';

/**
 * 打印banner
 */
export const printBanner = () => {
  fs.readFile('banner.txt', 'utf8', (err, data) => {
    if (err) {
      return;
    }
    console.log(data);
  });
};
