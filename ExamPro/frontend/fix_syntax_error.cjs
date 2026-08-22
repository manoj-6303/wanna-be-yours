const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.jsx', 'utf8');

// The syntax error is because we opened `{expandedSubject === subject && (` but didn't close it with `)}`
// We need to find the `</div>` that closes the `space-y-4` div in both places.

// We will just find all occurrences of:
const searchString = `                    </div>\r\n                  </div>\r\n                ))}\r\n                {groupedChapters`;

const replacement = `                    </div>\r\n                    )}\r\n                  </div>\r\n                ))}\r\n                {groupedChapters`;

let matches = content.split(searchString).length - 1;
console.log('Matches found for first method (Windows):', matches);

if (matches > 0) {
    content = content.split(searchString).join(replacement);
} else {
    // try without \r
    const searchString2 = `                    </div>\n                  </div>\n                ))}\n                {groupedChapters`;
    const replacement2 = `                    </div>\n                    )}\n                  </div>\n                ))}\n                {groupedChapters`;
    matches = content.split(searchString2).length - 1;
    console.log('Matches found for second method (Unix):', matches);
    if (matches > 0) {
        content = content.split(searchString2).join(replacement2);
    }
}

fs.writeFileSync('src/pages/Admin.jsx', content);
console.log('Done!');
