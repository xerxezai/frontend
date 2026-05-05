interface VideoModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const VideoModal = ({ isOpen, toggle }: VideoModalProps) => {
  return (
    <>
      <div
        className={`ar-modal-overlay ${isOpen ? "active" : ""}`}
        role="button"
        onClick={toggle}
      ></div>
      <div className={`video-modal-container ${isOpen ? "active" : ""}`}>
        <div className="ar-modal-body">
          <button onClick={toggle}>
            <i className="fas fa-times"></i>
          </button>
          <iframe
            src="https://www.youtube.com/embed/Cn4G2lZ_g2I?si=6jCP7F_zDDHUG-pT"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default VideoModal;
