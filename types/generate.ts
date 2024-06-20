import * as vm from "vm";
import FileUtil from "./FileUtil.ts";

const context = vm.createContext({
  window: {},
  navigator: {},
  performance: {},
  yyAllocate: function () {},
});

const preloading = ["./GameMaker-HTML5-master-feb-23/scripts/yyParticle.js"];
for (const filePath of preloading) {
  const sourceCode = await FileUtil.readText(filePath);
  vm.runInContext(sourceCode, context);
}

const files = await FileUtil.getAllFiles(
  "./GameMaker-HTML5-master-feb-23/scripts/functions",
);
for (const filePath of files) {
  const sourceCode = await FileUtil.readText(filePath);
  vm.runInContext(sourceCode, context);
}

let typesCode = "";

for (const func in context) {
  if (typeof context[func] === "function") {
    const args = context[func].toString().match(/\(([^)]*)\)/)[1]
      .split(",")
      .map((arg) =>
        arg.replace(/\/\*.*\*\//, "")
          .replace(/=.*$/, "")
          .trim()
      )
      .filter((arg) => arg);
    let argsCode = "";
    for (const arg of args) {
      argsCode += `${arg}: any, `;
    }
    typesCode += `declare function ${func}(${argsCode}): any;\n`;
  }
}

await FileUtil.write("./types/GameMaker.d.ts", typesCode);
