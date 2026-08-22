const katex = require('katex');
const str = "S_1 : x^2 + y^2 - x - y - \\frac{1}{2} = 0, S_2 : x^2 + y^2 - 4y + \\frac{7}{4} = 0 \\text{ and } S_3 : x^2 + y^2 - 4x - 2y + 5 - r^2 = 0";
try {
  const html = katex.renderToString(str, { throwOnError: true, displayMode: false });
  console.log('Success:', html);
} catch (e) {
  console.log('Error:', e.message);
}
