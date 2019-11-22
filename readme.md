# DXFのファイルを自作する
最終更新：2019/11/22

簡単な図形をDXFファイルで出力する必要があり、その時のメモとしてDXFファイルについての最低限のことをまとめた。

まとめたこと
* 最低限のDXFファイルの書き方
* 線分を引くときに点線や二点鎖線など線種を指定する方法（AutoCADで開く時）

## DXFとは
図面用のフォーマットの一種。拡張子は".dxf"。[AutoCAD](https://www.autodesk.co.jp/products/autocad/overview)や、[FreeCAD](https://www.freecadweb.org)など様々なソフトウェアで使用することができる。

## DXFファイルのフォーマット
3種類3本の線分をひくDXF形式のファイルsample.dxfを用意した。

### データの形
2行で1つのデータを表す。1行目に**グループコード**、2行目にグループコードに対応した**具体的な値**を書く。

例えば、以下の2行は、1行目に文字列を意味するグループコード"0"、2行目に文字列"SECTION"を書いており、セクションの始まりを表すデータである。
```
0
SECTION
```

### ファイルの構成
いくつかのセクションから構成される。**HEADER(ヘッダ)セクション、ENTITIES(図形)セクションは必須**である。sample.dxfではそのほかにTABLES(テーブル)セクションも使用している。セクションは
```
0
SECTION
```
で始まり、
```
0
ENDSEC
```
で終わる。

### HEADER(ヘッダ)セクション
**ファイルの最初**にHEADERセクションを書く。主に図面に関する変数の設定ができる。簡単な図形であればこれ以上記述をする必要はなかった。
```
0
SECTION
2
HEADER
(必要なデータがあればここに書くことができる、何も書かなくてもよい)
0
ENDSEC
```

### TABLES(テーブル)セクション
TABLES(テーブル)セクションではLAYER(画層)やLTYPE(線種)を追加することができる。TABLESセクションは複数のTABLEから構成される。線種や画層を追加しない場合はTABLESセクション自体省略してよい。以下のサンプルでは線種として点線を追加している。
```
0
SECTION
2
TABLES   ここまで書いてTABLESセクション開始
0
TABLE    ここからTABLESセクションのうちの1つのTABLE開始
2
LTYPE    TABLEの名前、線種のTABLEの意味
70       LTYPEがこのあと最大いくつあるか(グループコード)
2        追加する線種の数によってここの値を変更する
0
LTYPE    線種1つ目
2
HIDDEN   線種の名前
70       標準フラグ値(グループコード)
64       64か0を入れておけば問題ない
3        説明文(グループコード)
- - - - - - - - - -　AutoCADで開くと線種説明にこのまま表示される
72       位置合わせコード(グループコード)
65       常に65
73       線種の要素の数(グループコード)
2        点線は"-"(実線)と" "(空白)でできる要素数**2**のパターン(- )の繰り返し
40       パターンの全長(グループコード)
9        ここでは"-"を6の長さ、" "を3の長さにするのでパターンの全長は6+3=9
49       ダッシュ、ドット、またはスペースの長さ(グループコード)
6        "-"が6の長さ
49
-3       " "が3の長さ、ここまでで線種1つ目終わり
(さらに線種を追加する場合は1つ目と同様に記述)
0
ENDTAB   TABLE終わり
0
ENDSEC
```
AutoCADでファイルを開くためには
```
70       標準フラグ値(グループコード)
64       64か0を入れておけば問題ない
```
が必要だった。



### ENTITIES(図形)セクション
**ファイルの最後のセクション**としてENTITIESセクションを書く。主に図面のデータを記述する。例えば次のように記述すると1本の線分を引くことができる。
```
0
SECTION
2
ENTITIES
0        この行から
LINE
8
0
10
0
20
0
11
100
21
0        この行までで1本の線分を表す
0
ENDSEC
```
2つ以上の図形を記述する場合は次のようにENTITIESセクション内に続けて複数の図形を記述すればよい。。
```
2
ENTITIES
0        1つめの図形を記述
LINE
8
0
10
0
20
0
11
100
21
0
0        2つめの図形を記述
LINE
8
0
10
20
20
20
11
100
21
100
0        3つめの図形を記述
LINE
.        以下必要な図形のデータを同様に記述できる
.
.
0
ENDSEC
```
#### 図形
描くことのできる図形は、LINE(線分)、CIRCLE(円)など数十種ある。LINEとCIRCLEのみここでは説明する。

LINE(線分)
```
0        図形タイプ(グループコード)
LINE     LINE(線分)を指定
8        画層(レイヤー)名(グループコード)
0        画層名を指定する番号
6        線種名(グループコード、省略可能)
HIDDEN   線種名(TABLESセクションで追加したもの、省略可能)
10       線分の始点のx座標(グループコード)
0        線分の始点のx座標(数値)
20       線分の始点のy座標(グループコード)
0        線分の始点のy座標(数値)
11       線分の終点のx座標(グループコード)
100      線分の終点のx座標(数値)
21       線分の終点のy座標(グループコード)
0        線分の終点のy座標(数値)
```
TABLESセクション内で画層を追加していない場合は画層の番号は0で良い。TABLESセクションで線種を追加していた場合は線種を指定することができる。線種名は省略可能。省略した場合実線になる。

CIRCLE(円)
```
0        図形タイプ(グループコード)
CIRCLE   CIRCLE(円)を指定
8        画層(レイヤー)名(グループコード)
0        画層名を指定する番号
10       円の中心のx座標(グループコード)
0        円の中心のx座標(数値)
20       円の中心のy座標(グループコード)
0        円の中心のy座標(数値)
40       円の半径(グループコード)
5        円の半径(数値)
```
TABLESセクション内で画層を追加していない場合は画層の番号は0で良い。TABLESセクションで線種を追加していた場合はLINEと同様に線種を指定することができる。線種名は省略可能。省略した場合実線になる。

## JavaScriptでDXFファイルを出力する
dxf.jsを参照。座標などを引数にいれるとDXFの文字列を出力するLINE関数とCIRCLE関数を作成した。

[ognjen-petrovic/js-dxf: JavaScript DXF writer](https://github.com/ognjen-petrovic/js-dxf)を使うと自分で関数などを作らなくともJavaScriptでDXFファイルを作成できるようです。

## 参考
いずれも2019/11/22に参照
* [DXF リファレンス: ASCII DXF ファイル](http://docs.autodesk.com/ACD/2011/JPN/filesDXF/WS1a9193826455f5ff18cb41610ec0a2e719-796c.htm)
  * AutoCAD 2011 のヘルプページ
  * グループコードなどはここでわかる
* [DXFファイルのフォーマット | 隙間倉庫](http://umyu.upper.jp/WP/excel/dxf%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%81%AE%E3%83%95%E3%82%A9%E3%83%BC%E3%83%9E%E3%83%83%E3%83%88/)
* [AFsoft.jp](http://afsoft.jp/cad/p06.html)