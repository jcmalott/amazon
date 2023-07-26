import fs from "fs";

export default function AddToFile(fileLocation, newContent, setId = false) {
  const fileContents = fs.readFileSync(fileLocation, "utf-8");

  let parseContents = JSON.parse(fileContents);
  if (setId) {
    newContent = { ...newContent, _id: "" + (parseContents.length + 1) };
  }

  parseContents.push(newContent);
  fs.writeFile(fileLocation, JSON.stringify(parseContents, null, 2), (err) => {
    err ? console.log(err) : console.log("File Written");
  });
}
