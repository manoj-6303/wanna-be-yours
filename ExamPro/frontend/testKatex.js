import katex from 'katex';

const str = "10\\text{ cm}";
console.log("Input:", str);
try {
  const html = katex.renderToString(str, { throwOnError: false });
  console.log("HTML:", html);
} catch(e) {
  console.error(e);
}
