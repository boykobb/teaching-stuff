// Извеждане на вертикален образ на дърво с корен.
var treeprint = function(tr,p,r) {
  var cp = p != undefined ? p.slice(0) : []
  r ??= false
  for (var x of cp) process.stdout.write(x)
  console.log(tr[0])
  if (cp.length)
    cp[cp.length-1] = r ? '    ' : '│   '
  var hs = tr.slice(1)
  if (hs.length) {
    cp.push('├── ')
    var last = hs.pop()
    for (var x of hs) treeprint(x,cp)
    cp[cp.length-1] = '└── '
    treeprint(last,cp,true)
  }
}

treeprint(
  ['a',['b',['e'],['f',['j']]],['c'],['d',['g'],['h'],['i']]]
)

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

treeprint(
  ['+',['*',[2],['k']],['?',['&',['=',['sin',['a']],['s']],['<',['p'],['q']]],['f',['m']],['g',['~',['*',['u'],['v']]]]]]
)
