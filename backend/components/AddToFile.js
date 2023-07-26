import fs from "fs";

export default function AddToFile(fileLocation, newContent) {
  const fileContents = fs.readFileSync(fileLocation, "utf-8");

  let parseContents = JSON.parse(fileContents);
  parseContents.push(newContent);
  fs.writeFile(fileLocation, JSON.stringify(parseContents, null, 2), (err) => {
    err ? console.log(err) : console.log("File Written");
  });
}
