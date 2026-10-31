// webp copies of public/theUIIdesign/*.png (full + 560px thumb for the explore marquee)
export const uiDesigns = [
  'Visqora: Find Your People',
  'Visqora Invoice Dashboard Overview',
  'Visqora Learning Dashboard Interface',
  'VISQORA Learning Dashboard',
  'Santorini Treasure Hunt Poster',
].map(name => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return { name, src: `/ui/${slug}.webp`, thumb: `/ui/${slug}-thumb.webp` }
})
