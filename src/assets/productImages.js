export const productImages = Object.fromEntries(
  Object.entries(
    import.meta.glob('@/assets/Products/*.{png,jpg,jpeg,webp}', {
      eager: true,
      as: 'url',
    })
  ).map(([path, url]) => [path.split('/').pop(), url])
);