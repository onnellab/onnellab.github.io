import { expect, test } from '@playwright/test';

const widths = [320, 390, 820, 1440];

test('balanced layered hero preserves geometry after navigation', async ({page}) => {
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
    // Controlled off-baseline stagger: left raised slightly, right raised
    // more. Keep the difference small enough to avoid detached previews.
    const leftLift = width <= 650 ? 6 : 9;
    const rightLift = width <= 650 ? 14 : 20;
    const leftDelta = initial.left.y + initial.left.height - initial.center.y - initial.center.height;
    const rightDelta = initial.right.y + initial.right.height - initial.center.y - initial.center.height;
    expect(Math.abs(leftDelta + leftLift)).toBeLessThanOrEqual(0.2);
    expect(Math.abs(rightDelta + rightLift)).toBeLessThanOrEqual(0.2);
    expect(rightDelta).toBeLessThan(leftDelta);
    expect(initial.left.y).toBeGreaterThan(initial.center.y);
    expect(initial.right.y, 'right sits higher').toBeLessThan(initial.left.y);
    expect(initial.center.width).toBeGreaterThan(initial.left.width);
    expect(Math.abs(initial.left.width - initial.right.width),
      'side preview widths are identical').toBeLessThanOrEqual(0.2);
    expect(Math.abs(initial.left.height - initial.right.height),
      'side preview heights are identical').toBeLessThanOrEqual(0.2);
    const expectedRatio=[33 / 103,37 / 103,33 / 103];
    const sum=initial.left.width+initial.center.width+initial.right.width;
    for(const [i,value] of [initial.left.width,initial.center.width,initial.right.width].entries()) {
      expect(Math.abs(value/sum-expectedRatio[i])).toBeLessThan(0.002);
    }
    const inset=width<=355?12:width<=650?width*0.04:22;
    expect(initial.leftOverlap).toBeCloseTo(inset,0);
    expect(initial.rightOverlap).toBeCloseTo(inset,0);

    for(const selector of ['[data-hero-next]','[data-hero-next]','[data-hero-previous]']) {
      await page.locator(selector).click();
      await expect(stage).not.toHaveAttribute('data-animating','true');
      expect(await geometry(), width+'px '+selector).toEqual(initial);
    }
  }
});

test('all nine languages preserve balanced preview positions', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  for(const locale of ['', 'ko/', 'ja/', 'zh-hans/', 'zh-hant/', 'pt-br/', 'de/', 'fr/', 'es/']){
    await page.goto('/'+locale);
    const metrics=await page.locator('[data-hero-track]').evaluate(stage=>{
      const box=(s:string)=>stage.querySelector('[data-hero-slot="'+s+'"] .hero-slide-screen')!.getBoundingClientRect();
      const l=box('previous'),c=box('active'),r=box('next');
      return {leftBottom:Number((l.bottom-c.bottom).toFixed(2)),
        rightBottom:Number((r.bottom-c.bottom).toFixed(2)),
        leftTop:Number((l.top-c.top).toFixed(1)),
        rightTop:Number((r.top-c.top).toFixed(1)),
        centerRatio:Number((c.width/l.width).toFixed(2)),
        viewportOverflow:document.documentElement.scrollWidth-innerWidth};
    });
    expect(metrics.centerRatio,locale).toBeCloseTo(37 / 33, 2);
    expect(Math.abs(metrics.leftBottom + 6),locale).toBeLessThanOrEqual(0.2);
    expect(Math.abs(metrics.rightBottom + 14),locale).toBeLessThanOrEqual(0.2);
    expect(metrics.rightBottom).toBeLessThan(metrics.leftBottom);
    expect(metrics.leftTop,locale).toBeGreaterThan(12);
    expect(metrics.rightTop,locale).toBeLessThan(metrics.leftTop);
    expect(metrics.viewportOverflow,locale).toBeLessThanOrEqual(1);
  }
});
