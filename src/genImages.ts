import * as fs from "fs";

function namify(image: string) {
  return image
    .substring(0, image.indexOf(".jpg"))
    .replace(/ /g, "")
    .replace(/'/g, "")
    .replace(/-/g, "")
    .replace(/_/g, "")
    .toLowerCase();
}

function genImages() {
  let images = fs.readdirSync("src/images");
  images = images.filter((image) => image.indexOf(".jpg") !== -1);
  console.log("images:", images);

  const fileContents = `${images
    .map((image) => `import ${namify(image)} from "./images/${image}";`)
    .join("\n")}
    
    export function getImage(name: string) {
      switch (name) {
        ${images
          .map(
            (image) =>
              `case "${image.substring(
                0,
                image.indexOf(".jpg")
              )}": return ${namify(image)};`
          )
          .join("\n")}
      }
    }`;

  fs.writeFileSync("src/images.ts", fileContents);
}

genImages();
