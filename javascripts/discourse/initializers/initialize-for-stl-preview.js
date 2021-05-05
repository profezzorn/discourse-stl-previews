import { withPluginApi } from "discourse/lib/plugin-api";
import Mobile from "discourse/lib/mobile";

const PREVIEW_HEIGHT = 500;

const createPreviewElem = () => {
  const preview = document.createElement("div");
  preview.height = PREVIEW_HEIGHT + "px";
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

             var stl_viewer=new StlViewer(preview, { models: [ {id:0, filename: stl.href} ] });
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
