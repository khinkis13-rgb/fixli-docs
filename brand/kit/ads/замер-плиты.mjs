/**
 * Замер зазоров знака внутри плиты фотокреатива.
 *
 * Написан 2026-08-27 по дефекту, которого не видело правило 7: охранное поле
 * знака (0,21 его высоты) отмерялось до кромки холста, а на фотомакете знак
 * стоит в плите — за её краем начинается снимок. В квадрате зазор был 16 px
 * при норме 22,9, и до кромки холста там 96 px, поэтому сборка молчала.
 *
 * Правило с тех пор расширено и ловит это само. Скрипт остаётся инструментом:
 * он печатает числа по всем четырём сторонам, когда надо понять, какая именно
 * сторона поджимает, — сборка говорит только «мало», но не говорит «где».
 *
 * Запуск: node brand/kit/ads/замер-плиты.mjs
 */

import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
const б = await chromium.launch();
const с = await б.newPage({ viewport: { width: 1800, height: 2000 } });
await с.goto(pathToFileURL('/Users/dmitrykhinkis/VC-code/FixLi/brand/kit/ads/креативы.html').href);
await с.evaluate(() => { document.body.dataset.режим = 'экспорт'; });
await с.evaluate(() => document.fonts.ready);
const р = await с.evaluate(() => {
  const из = [];
  for (const id of ['16-телевизор-фото-ru','16-телевизор-фото-he','14-упаковка-ru','14-упаковка-he']) {
    const кр = document.querySelector(`article[id="${id}"]`);
    const знак = кр.querySelector('.кр-знак');
    const плита = кр.querySelector('.кр-плита');
    if (!знак || !плита) continue;
    const з = знак.getBoundingClientRect(), п = плита.getBoundingClientRect();
    из.push({ id, поле: +(0.21 * з.height).toFixed(1),
      слева: +(з.left - п.left).toFixed(1), справа: +(п.right - з.right).toFixed(1),
      снизу: +(п.bottom - з.bottom).toFixed(1), сверху: +(з.top - п.top).toFixed(1) });
  }
  return из;
});
console.table(р);
await б.close();
