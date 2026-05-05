import { useCustomContext } from "../../context/context";

const VideoSection = () => {
  const { toggleVideoModal } = useCustomContext();
  return (
    <div className="video-section-4 fix">
      <div className="container">
        <div className="video-wrapper-4 bg-cover">
          <div className="video">
            <a
              className="video-btn ripple video-popup"
              role="button"
              onClick={toggleVideoModal}
            >
              <i className="fas fa-play"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
