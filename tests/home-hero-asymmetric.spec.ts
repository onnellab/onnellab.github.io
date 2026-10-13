import { expect, test } from '@playwright/test';

const widths = [320, 390, 820, 1440];

test('the fixed asymmetric hero remains stable after arrow navigation and mouse swipes', async ({page}) => {
  for (const width of widths) {
    await page.setViewportSize({width,height:900});
    await page.goto('/ko/');
    const stage = page.locator('[data-hero-track]');
    const geometry = () => stage.evaluate(root => {
      const frame = (position:string) => {
        const rect = root.querySelector('[data-hero-slot="' + position + '"] .hero-slide-screen')!.getBoundingClientRect();
        return {x:Number(rect.left.toFixed(1)),y:Number(rect.top.toFixed(1)),
          width:Number(rect.width.toFixed(1)),height:Number(rect.height.toFixed(1))};
      };
      const left=frame('previous'),center=frame('active'),right=frame('next');
      const rootRect=root.getBoundingClientRect();
      return {left,center,right,
        overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
        leftOverlap:Number((left.x+left.width-center.x).toFixed(1)),
        rightOverlap:Number((center.x+center.width-right.x).toFixed(1)),
        frameBounds:[left,center,right].every(f=>f.x >= rootRect.left-1 && f.x+f.width <= rootRect.right+1),
        stageHeight:Number(rootRect.height.toFixed(1))
      };
    });
    const initial=await geometry();
    expect(initial.overflow).toBeLessThanOrEqual(1);
    expect(initial.frameBounds).toBe(true);
    expect(initial.left.y-initial.center.y).toBeGreaterThan(18);
    expect(initial.right.y-initial.center.y).toBeGreaterThan(55);
    expect(initial.right.y-initial.left.y).toBeGreaterThan(38);
    expect(initial.center.width).toBeGreaterThan(initial.left.width);
    expect(initial.left.width).toBeGreaterThan(initial.right.width);
    const expectedRatio=width<=650 ? [0.32,0.4,0.28] : [0.31,0.42,0.27];
    const sum=initial.left.width+initial.center.width+initial.right.width;
    for(const [i,value] of [initial.left.width,initial.center.width,initial.right.width].entries()) {
      expect(Math.abs(value/sum-expectedRatio[i])).toBeLessThan(0.002);
    }
    const inset=width<=355?24:width<=650?30:48;
    expect(initial.leftOverlap).toBeCloseTo(inset,0);
    expect(initial.rightOverlap).toBeCloseTo(inset,0);

    for(const selector of ['[data-hero-next]','[data-hero-next]','[data-hero-previous]']) {
      await page.locator(selector).click();
      await expect(stage).not.toHaveAttribute('data-animating','true');
      expect(await geometry(), width+'px '+selector).toEqual(initial);
    }
  }
});

test('all nine languages preserve the staggered preview positions', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  for(const locale of ['', 'ko/', 'ja/', 'zh-hans/', 'zh-hant/', 'pt-br/', 'de/', 'fr/', 'es/']){
    await page.goto('/'+locale);
    const metrics=await page.locator('[data-hero-track]').evaluate(stage=>{
      const box=(s:string)=>stage.querySelector('[data-hero-slot="'+s+'"] .hero-slide-screen')!.getBoundingClientRect();
      const l=box('previous'),c=box('active'),r=box('next');
      return {left:Number((l.y-c.y).toFixed(1)),right:Number((r.y-c.y).toFixed(1)),
        centerRatio:Number((c.width/l.width).toFixed(2)),
        viewportOverflow:document.documentElement.scrollWidth-innerWidth};
    });
    expect(metrics.centerRatio,locale).toBeCloseTo(1.25,1);
    expect(metrics.left,locale).toBeGreaterThan(18);
    expect(metrics.left,locale).toBeLessThan(32);
    expect(metrics.right,locale).toBeGreaterThan(70);
    expect(metrics.right,locale).toBeLessThan(87);
    expect(metrics.viewportOverflow,locale).toBeLessThanOrEqual(1);
  }
});
