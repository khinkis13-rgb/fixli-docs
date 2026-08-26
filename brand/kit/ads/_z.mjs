import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
const б = await chromium.launch();
const с = await б.newPage({ viewport: { width: 1800, height: 2000 } });
await с.goto(pathToFileURL('/Users/dmitrykhinkis/VC-code/FixLi/brand/kit/ads/креативы.html').href);
await с.evaluate(() => { document.body.dataset.режим = 'экспорт'; });
await с.evaluate(() => document.fonts.ready);
console.log(await с.evaluate(() => {
  const из = {};
  for (const id of ['17-упаковка-1x1-ru','17-упаковка-1x1-he']) {
    const кр = document.querySelector(`article[id="${id}"]`);
    const х = кр.getBoundingClientRect();
    const о = (s) => { const э = кр.querySelector(s); if (!э) return null;
      const r = э.getBoundingClientRect();
      return `${Math.round(r.left - х.left)}…${Math.round(r.right - х.left)}`; };
    из[id] = { холст: Math.round(х.width), кадр: о('.кр-карточка'), низ: о('.кр-низ'),
               связь: о('.кр-связь'), сайт: о('.кр-сайт'), знак: о('.кр-знак') };
  }
  return из;
}));
await б.close();
