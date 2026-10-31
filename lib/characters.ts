// webp copies of public/characteridesign/*.png (full + 360px thumb for the explore marquee)
export const characters = [
  'Bloodstained Gothic Chainbound Warrior',
  'Chained Grimdark Berserker with Spiked Maul',
  'Gothic Chainbound Executioner',
  'Gritty Spiked Punk Antihero',
].map(name => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return { name, src: `/characters/${slug}.webp`, thumb: `/characters/${slug}-thumb.webp` }
})
