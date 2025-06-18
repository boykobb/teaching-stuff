// Обхождане на двоично дърво: общо, префиксно, инфиксно, суфиксно или само листата.
// За всеки възел съпрограмно се излъчва двойка от стойността му и номера на слоя му.
var btTraverse = function*(tr,mode) {
  if (tr.value == undefined) return
  var rets = [], dir = '<'
  for (;;) {
    if (mode == undefined || mode == 'round'
                          || mode == 'pre' && dir == '<'
                          || mode == 'leaves' && tr.left.value == undefined && tr.right.value == undefined)
      yield [tr.value,rets.length]
    if (dir != '') {
      if (dir == '<' && tr.left.value != undefined) {
        rets.push([tr,'>'])
        tr = tr.left; dir = '<'
        continue
      }
      if (mode == 'in') yield [tr.value,rets.length]
      if (tr.right.value != undefined) {
        rets.push([tr,''])
        tr = tr.right; dir = '<'
        continue
      }
    }
    if (mode == 'post') yield [tr.value,rets.length]
    if (rets.length == 0) break
    [tr,dir] = rets.pop()
  }
}

// Образуване на хоризонтален образ на двоично дърво посредством постъпково
// инфиксно обхождане с btTraverse().
// Резултатът е масив от редове (низове).
// dy, ако присъства, задава разстояние между слоевете в брой редове.
var btPicture = function(tr,dy) {
  var pic = []                                          // слоеве на дървото (низове)
  var pnt = []                                          // места за свързване с родителски възел
  var rgt = []                                          // true, ако в слоя има възел, очакващ десен наследник
  var prf = '', x = 0, yp
  for (var [s,y] of btTraverse(tr,'in')) {              // за всеки възел в инфиксен ред: съдържание и № на слой
    if (typeof s != 'string') s = JSON.stringify(s)     // привеждане на съдържанието към низ
    for (var i = pic.length; i <= y; ++i)               // ако е нужно, добавяне на слоеве до този с номер y
      {pic.push(''); rgt.push(false)}
    x += prf.length                                     // отместване на хоризонталната граница, ако възелът не е най-левия
    pnt[y] = x+prf.length+Math.floor((s.length-1)/2)    // отбелязване на място за свързване с родителски възел
    s = prf+s                                           // добавяне на отместването към съдържанието на възела
    var n = y < yp ? x-pnt[y+1] : 0                     // изкачване ?-> дължина на ляв клон, иначе 0
    pic[y] += Array(x-pic[y].length-n+1).join(' ')      // отместване на възела в слоя до границата
    if (n > 0) pic[y] += '┌'+Array(n).join('─')         // поставяне на ляв клон от текущия слой y към y+1
    pic[y] += s                                         // поставяне на възел
    x += s.length                                       // текуща хоризонтална граница
    if (y > yp) rgt[yp] = true                          // слизане ?-> от слой yp трябва да започва десен клон
    if (rgt[y-1]) {                                     // поставяне на десен клон от слой y-1 към текущия y
      pic[y-1] += ' ' + Array(pnt[y]-pic[y-1].length).join('─') + '┐'
      rgt[y-1] = false
    }
    yp = y
    prf = ' '
  }
  var n = pic.length
  if (dy && n > 1) {                                    // следобработка: разтягане по вертикала
    for (var i = 0; --n; i += dy+1) {                   // за всеки слой без последния:
      var a = pic[i].split('')                          //    образуване на масив от съдържанието
      for (var j in a)                                  //    за всеки елемент:
        a[j] = a[j] == '┌' || a[j] == '┐' ? '│' : ' '   //       ако е '┌' или '┐' става '│', иначе ' '
      var s = a.join('')                                //    образуваме на низ от масива
      for (var j = dy; j; --j) pic.splice(i+1,0,s)      //    вмъкване на dy брой реда с този низ
    }
  }
  return pic
}

// Пример: образуване на редица от случайни числа, подреждане в двоично дърво, извеждане.
var bstInsert = function(tr,x) {
  var root = tr
  while (tr.value != undefined)
    tr = x <= tr.value ? tr.left : tr.right
  ;[tr.value,tr.left,tr.right] = [x,{},{}]
  return root
}
bstree = []
for (var i = 0; i < 20; ++i) bstree.push(Math.round(100*Math.random()))
bstree = bstree.reduce(bstInsert,{})
for (var x of btPicture(bstree,1))
  console.log(x)

/*
// Пример: дървото на израза a × b^n + c × d^(z^k) × e.
var e = {left: {left: {value: 'a', left: {}, right: {}},
                value: '×',
                right: {left: {value: 'b', left: {}, right: {}},
                        value: '^',
                        right: {value: 'n', left: {}, right: {}}}},
         value: '+',
         right: {left: {left: {value: 'c', left: {}, right: {}},
                        value: '×',
                        right: {left: {value: 'd', left: {}, right: {}},
                                value: '^',
                                right: {left: {value: 'z', left: {}, right: {}},
                                        value: '^',
                                        right: {value: 'k', left: {}, right: {}}}}},
                 value: '×',
                 right: {value: 'e', left: {}, right: {}}}}
for (var x of btPicture(e)) console.log(x)
*/

/*
// Пример: родословно дърво на Тюдорите.
var EI = {value: 'Elizabeth Tudor (Elizabeth I)',
          left: {value: 'Henry Tudor (Henry VIII)',
                 left: {value: 'Henry Tudor (Henry VII)', left: {}, right: {}},
                 right: {value: 'Elizabeth Plantagenet of York', left: {}, right: {}}},
          right: {value: 'Anne Boleyn',
                  left: {value: 'Thomas Boleyn', left: {}, right: {}},
                  right: {value: 'Elizabeth Howard', left: {}, right: {}}}}
for (var x of btPicture(EI,2)) console.log(x)
*/
