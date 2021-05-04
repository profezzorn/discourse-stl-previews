import { withPluginApi } from "discourse/lib/plugin-api";
import Mobile from "discourse/lib/mobile";

const PREVIEW_HEIGHT = 500;

const createPreviewElem = () => {
  const preview = document.createElement("iframe");
  preview.src = "";
  preview.height = PREVIEW_HEIGHT;
  preview.loading = "lazy";
  preview.classList.add("stl-preview");

  return preview;
};

export default {
  name: "stl-previews",
  initialize() {
    withPluginApi("0.8.41", api => {
      if (Mobile.mobileView) return;

      try {
        api.decorateCookedElement(
          post => {
            const attachments = [...post.querySelectorAll(".attachment")];

            if (!attachments.length) return;

            const stls = attachments.filter(attachment =>
              attachment.href.match(/\.[stl]+$/)
            );

            if (!stls.length) return;

            stls.forEach(stl => {
              const preview = createPreviewElem();
              stl.append(preview);

              stl.classList.add("stl-attachment");
              const fileSize = stl.nextSibling;
              if (fileSize) {
                fileSize.nodeValue = "";
              }

              const httpRequest = new XMLHttpRequest();
              httpRequest.open("GET", stl.href);
              httpRequest.responseType = "blob";

              httpRequest.onreadystatechange = () => {
                if (httpRequest.readyState !== XMLHttpRequest.DONE) return;

                if (httpRequest.status === 200) {
                  const blob = new Blob([httpRequest.response], {
                    type: "application/stl"
                  });
                  const src = URL.createObjectURL(blob);

                  preview.src = src;
                }
              };
              httpRequest.send();
            });
          },
          {
            id: "stl-previews",
            onlyStream: true
          }
        );
      } catch (error) {
        console.error("There's an issue in the stl previews theme component");
        console.error(error);
      }
    });
  }
};
