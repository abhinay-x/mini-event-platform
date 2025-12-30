const pick = (list) => list[Math.floor(Math.random() * list.length)];

export const generateDescription = async (req, res) => {
  const { title = 'your event', category = 'General', location = 'your city', vibe = 'energetic' } = req.body;

  const intros = [
    `Get ready for ${title}!`,
    `Step into ${title}—a ${category.toLowerCase()} experience like no other.`,
    `⚡ ${title} is landing in ${location}!`
  ];
  const valueProps = [
    `Expect curated sessions, real conversations, and hands-on moments tailored for modern innovators.`,
    `We blend actionable insights with meaningful community building so you leave inspired and equipped.`,
    `From immersive demos to lightning talks, every segment is crafted to keep you ${vibe}.`
  ];
  const closings = [
    `Reserve your slot now—spaces are limited to keep the experience high-impact.`,
    `Bring a teammate or come solo; just don’t miss the momentum.`,
    `Secure your RSVP today and be part of the story that unfolds in ${location}.`
  ];

  const description = `${pick(intros)} ${pick(valueProps)} ${pick(closings)}`;

  res.json({ description });
};
