const header = `0
SECTION
2
HEADER
0
ENDSEC
0
SECTION
2
TABLES
0
TABLE
2
LTYPE
70
2
0
LTYPE
2
HIDDEN
70
64
3
- - - - - - - - - -
72
65
73
2
40
9
49
6
49
-3
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
`;

const footer = `0
ENDSEC
0
EOF
`;

// LINEを出力する
// x1, y1: 始点
// x2, y2: 終点
// type: 0:solid line, 1:HIDDEN, 2:PHANTOM
function line(x1, y1, x2, y2, type=1) {
  const head = `0
LINE
8
0
`;
  let lineType ="";
  switch (type) {
    case 0:
      break;
    case 1:
      lineType = `6
HIDDEN
`;
      break;
    default:
      break;
  }
  return head + lineType + "10\n" + x1 + "\n20\n" + y1 + "\n11\n" + x2 + "\n21\n" + y2 + "\n";
}

// CIRCLEを出力する
// x,y: 中心点
//   r: 半径
function circle(x, y, r) {
  const head =`0
CIRCLE
8
0
`;
  return head + "10\n" + x + "\n20\n" + y + "\n40\n" + r + "\n";
}

function main() {
  let dxf = header;
  dxf += line(10,10,20,10,0);
  dxf += circle(10,10,5);
  dxf += footer;

  let blob = new Blob([dxf], {type: "text/dxf"});
  // blobをなんらかで保存してファイルを出力する
  // https://github.com/eligrey/FileSaver.js などが使える
}
