import html2Canvas from "html2canvas";
import JsPDF from "jspdf";

export function exportAssetPdf(title, id) {
  let content = document.querySelector(`#${id}`);
  let first = content.firstElementChild.firstElementChild;
  let second = content.lastElementChild;
  oneNodeMultipleChildren(title, content, [first, second]);
}

export function oneNodeMultipleChildren(title, fNode, sNode) {
  html2Canvas(fNode, {
    scale: 2,
  }).then(function (canvas) {
    let PDF = new JsPDF("", "mm", "a4");
    let position = 0;
    let contentWidth = canvas.width;
    let contentHeight = canvas.height;
    let proportion = 200 / fNode.offsetWidth; // 减少10mm
    let currentHeight = 0;
    let imgWidth = 200; // 减少10mm
    let imgHeight = (200 / contentWidth) * contentHeight; // 减少10mm
    let pageData = canvas.toDataURL("image/jpeg", 1.0);
    let sameIndex = 1;
    let widthX = 1;

    for (let i = 0; i < sNode.length; i++) {
      for (let j = 0; j < sNode[i].children.length; j++) {
        let childHeight = (sNode[i].children[j].offsetHeight + 8) * proportion;
        let childWidth = sNode[i].children[j].offsetWidth * proportion;
        if (sameIndex === 1) {
          widthX = Math.round(200 / childWidth); // 减少10mm
        }
        if (sameIndex < widthX) {
          childHeight = 0;
          sameIndex++;
        } else {
          sameIndex = 1;
        }

        if (currentHeight + childHeight > 287) {
          // 减小10mm
          addImage(PDF, pageData, position, imgWidth, imgHeight, currentHeight);
          position -= currentHeight;
          if (position >= -contentHeight) {
            PDF.addPage();
          }
          currentHeight = childHeight;
        } else {
          currentHeight += childHeight;
        }
      }
    }
    addImage(PDF, pageData, position, imgWidth, imgHeight, currentHeight);
    PDF.save(title + ".pdf");
  });
}

function addImage(PDF, pageData, position, imgWidth, imgHeight, currentHeight) {
  PDF.addImage(pageData, "JPEG", 5, position + 5, imgWidth, imgHeight); // 增加偏移量
  PDF.setFillColor(255, 255, 255);
  PDF.rect(0, 0, 210, 4, "F"); // 添加页眉遮挡
  PDF.rect(0, currentHeight + 5, 210, Math.ceil(292 - currentHeight), "F"); // 添加页脚遮挡
}
