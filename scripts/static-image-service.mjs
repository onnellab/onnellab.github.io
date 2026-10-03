/**
 * This site serves repository-owned assets with normal <img> elements and its
 * static app-assets route. It does not use Astro's image-processing pipeline.
 *
 * An external service (no `transform` property) closes that pipeline before
 * remote fetches, persistent cache reads, revalidation, or stale-on-error reuse.
 * Do not replace this with Astro's passthrough service: it still has transform.
 */
export const staticImageServiceEntrypoint = './scripts/static-image-service.mjs';

function disabled() {
  const error = new Error(
    'Astro image processing is disabled. Use repository-owned public assets and ordinary img elements.',
  );
  error.code = 'ONNELLAB_IMAGE_PROCESSING_DISABLED';
  throw error;
}

export default Object.freeze({
  // inferSize is processed before validateOptions. It must not fall back to a
  // network probe, including when image domains are added to the configuration.
  getRemoteSize: disabled,
  validateOptions: disabled,
  getURL: disabled,
  getHTMLAttributes: disabled,
});

export function staticImageBoundary() {
  return {
    name: 'onnellab/static-image-boundary',
    hooks: {
      'astro:config:done': ({ config, buildOutput }) => {
        if (config.output !== 'static' || config.adapter || (buildOutput && buildOutput !== 'static')) {
          throw new Error('The image-cache replacement is reviewed only for a static, adapter-free site.');
        }
        if (config.image.service.entrypoint !== staticImageServiceEntrypoint) {
          throw new Error('The static image-service boundary must remain enabled.');
        }
        // Persistent incremental state may contain image transforms registered
        // under an earlier service. Do not let it bypass the current boundary.
        if (config.experimental?.incrementalBuild) {
          throw new Error('Incremental builds require a new image-cache security review.');
        }
      },
    },
  };
}
