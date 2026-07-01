import fs from 'node:fs';
import { getAppAssets } from '../../lib/products';

export function getStaticPaths() {
  return getAppAssets().map((asset) => ({
    params: { asset: asset.routePath.replace(/^app-assets\//, '') },
    props: { filePath: asset.filePath }
  }));
}

export function GET({ props }: { props: { filePath: string } }) {
  const icon = fs.readFileSync(props.filePath);
  return new Response(icon, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
