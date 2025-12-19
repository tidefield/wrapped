import { faShare } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-solid-svg-icons/faCopy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import domtoimage from "dom-to-image";

const ShareButton = () => {
  const createSnapshot = async () => {
    const element = document.getElementById("story-container");
    if (!element) {
      throw new Error("Element not found");
    }
    const height = element.getBoundingClientRect().height;
    const width = element.getBoundingClientRect().width;
    const imageBlob = await domtoimage.toBlob(element, {
      height,
      width,
      bgcolor: "#fffbe9",
    });
    return imageBlob;
  };

  const shareThisPage = async () => {
    try {
      const imageBlob = await createSnapshot();
      const image = new File([imageBlob], "image.png", { type: "image/png" });
      const shareData = {
        title: "Share this stat",
        text: "Check out this amazing stat!",
        files: [image],
      };
      await navigator.share(shareData);
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const copyImage = async () => {
    try {
      const imageBlob = await createSnapshot();
      const image = new File([imageBlob], "image.png", { type: "image/png" });
      await navigator.clipboard.write([
        new ClipboardItem({ [image.type]: image }),
      ]);
    } catch (err) {
      console.error("Error copying image:", err);
    }
  };

  return (
    <div id="share-buttons-container">
      <button className="btn-tertiary" onClick={() => shareThisPage()}>
        <FontAwesomeIcon icon={faShare} /> share this stat
      </button>
      <button className="btn-tertiary" onClick={() => copyImage()}>
        <FontAwesomeIcon icon={faCopy} /> copy image
      </button>
    </div>
  );
};

export default ShareButton;
