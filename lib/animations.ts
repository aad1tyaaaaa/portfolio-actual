// copies of public/theanimationidesign/*.mp4: full video (with sound) + silent 480px loop for the explore marquee + poster frame
export const animations = [
  'Red Halftone',
  'Ink Koi',
  'Chromatic Flow',
  'Harlequin',
  'Glitch Chapel',
  'Neon Casino',
].map(name => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return { name, src: `/animations/${slug}.mp4`, thumb: `/animations/${slug}-thumb.mp4`, poster: `/animations/${slug}.jpg` }
})
