REBOL [Действия с двоично дърво.]

{ Поставя стойността x в ДП дърво tree.
  С /cmp изрично се задава сравняваща функция. За нея се подразбира lesser?. }
bst-insert: func [tree x /cmp f /local t t-next dir] [
  node: make object! [data: x left: none right: none]
  either tree [
    if not cmp [f: 'lesser?]
    t: tree
    while [dir: either do :f x t/data ['left] ['right]
           t-next: get in t dir]
      [t: t-next]
    set in t dir node
    tree
  ] [
    node
  ]
]

{ Образува редица от стойностите във възлите на дървото tree, обхождайки го в ред ЛКД.
  Началното – нерекурсивното – повикване на процедурата е това, което образува редицата
  и накрая я дава на повикващия като свой резултат. То е и единственото, което изобщо
  има резултат. За да работят с редицата и рекурсивните повиквания, те я получават във
  вид на допълнителен аргумент. }
bst-inorder: func [tree /rec s] [
  if not rec [s: copy []]
  if tree [
    bst-inorder/rec tree/left s
    append/only s tree/data
    bst-inorder/rec tree/right s
  ]
  if not rec [s]
]

{ Пример: построяване на дърво от членовете на редица и след това на подредена редица
  чрез обхождане на дървото. Образуваната редица непосредствено се извежда. }
root: none
foreach x [12 3 4 1 17] [root: bst-insert root x]
; foreach x [12 3 4 1 17] [root: bst-insert/cmp root x 'greater?]
print mold bst-inorder root
