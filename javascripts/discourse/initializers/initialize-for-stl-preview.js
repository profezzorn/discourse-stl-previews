import { withPluginApi } from "discourse/lib/plugin-api";
import Mobile from "discourse/lib/mobile";

const createPreviewElem = () => {
  const preview = document.createElement("div");
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
              stl.parentNode.insertBefore(preview, stl);

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
