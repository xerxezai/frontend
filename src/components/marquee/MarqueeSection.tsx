interface Props {
  variant?: boolean;
}
const marqueeTexts = ["BOOSTING", "DIGITAL", "MARKETING", "SEO", "ANALYTICS"];

const MarqueeSection = ({ variant }: Props) => {
  const numberOfMarqueeGroups = 3;
  return (
    <div
      className={`marquee-section fix section-padding ${variant ? "" : "pt-0"}`}
    >
      <div className="marquee">
        {[...Array(numberOfMarqueeGroups)].map((_, groupIndex) => (
          <div className="marquee-group" key={groupIndex}>
            {marqueeTexts.map((text, textIndex) => (
              <div
                className={`text ${variant ? "text-white" : ""}`}
                key={textIndex}
              >
                {text}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeSection;
