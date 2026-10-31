// cut from public/thebadgesidesign/Grunge Vintage Badge Collection (1).png (4×4 sheet, row-major) into public/badges/badge-NN(-thumb).webp
export const badges = [
  'Good Boy?', "Heaven Knows I'm Rotten", 'Bad Luck Club', 'Lonely Ocean',
  'Beauty in Decay', 'Bleeding Smile', 'Out of This World', 'Stitched Mask',
  'Dead Ideas Still Breathe', 'Starry Night', 'Far Away', 'Beauty Poison',
  '1997 Speed Kills Peacefully', 'Same Mind Different World', 'Lost Angel', 'The Wanderer',
].map((name, i) => {
  const n = String(i + 1).padStart(2, '0')
  return { name, src: `/badges/badge-${n}.webp`, thumb: `/badges/badge-${n}-thumb.webp` }
})
